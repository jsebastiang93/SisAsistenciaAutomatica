"""
Permite leer el codigo de barras de una cedula de identidad colombiana
desde un lector de códigos de barra físico (ejemplo: Netum L8BL)

Este debe estar configurado en modo serial (COM)

Notas: Estos lectores arrojan lecturas iguales en linux y mac pero en windows
se comportan distinto. Arrojan una lectura en donde truncan los bytes nulos.
Esto dificulta un poco la lectura de los datos.

Este script soporta tanto windows como linux y mac.

Por ejemplo para linux y mac el inicio de la lectura inicia así:
"0320065791NULNULNULNULNULNULNULNULNULNULNULNULNULNULPubDSK_1"

Pero para windows iniciaría así:
"0320065791NULNULNULPubDSK_1....."

Note que en windows solo se envían 3 nulos luego del código afis (20065791)
mientras que en linux y mac si se envían todos los nulos.
"""
"""""
import json
from threading import Thread
import serial.tools.list_ports
import serial

from src.barcode.colombian_pdf417_decoder import ColombianIdCardPdf417Decoder

# Debes cambiar esto por el puerto serial del lector de códigos de barra
# Ejemplo: 'COM3'
DEFAULT_SERIAL_PORT = 'COM3'
BAUD = 9600
COLOMBIAN_CEDULA_PDF417_FULL_LEN = 531
COLOMBIAN_CEDULA_PDF417_TRUNKED_LEN = 200

NULL_BYTE = bytes('\x00', 'ascii')

TRUNKED_FRAME_PUB_SDK_MARK_IDX = 13
# Esta marca se encuentra en el pdf417
# Normalmente está en el byte 24
# Pero si la lectura es truncada, está en el byte 13
PUB_SDK_MARK = bytes('PubDSK_', 'ascii')

#                           macOS       | Linux        |  Windows
SERIAL_PORT_NAMES = ['/dev/cu.usbmodem', '/dev/ttyACM', 'COM']


def find_serial_port() -> str:
    ports = serial.tools.list_ports.comports()
    latest_port_number = 0
    latest_port_number_name = ''
    for port in ports:
        for name in SERIAL_PORT_NAMES:
            if port.device.startswith('/dev/cu.usbmodem'):
                return port.device
            if not port.device.startswith(name):
                continue
            port_number_str: str = port.device[len(name):]
            port_number = int(port_number_str.lstrip('0'))
            if port_number >= latest_port_number:
                latest_port_number = port_number
                latest_port_number_name = port.device
    return latest_port_number_name


def barcode_serial():
    serial_port_path = find_serial_port()
    if not serial_port_path:
        print('No se encontró ningún puerto serial')
        print("se tomará el siguiente puerto por defecto: {}".format(DEFAULT_SERIAL_PORT))
        serial_port_path = DEFAULT_SERIAL_PORT
    print("Iniciando....")
    try:
        serial_port = serial.Serial(serial_port_path, BAUD)
        serial_port.flushInput()

        frame = bytearray()
        while True:
            # Se leen los primeros 200 bytes de la lectura
            # En estos primeros 200 bytes se encuentra toda la data que extraeremos
            c = serial_port.read(COLOMBIAN_CEDULA_PDF417_TRUNKED_LEN)
            print(c)
            frame.extend(c)
            
            pub_sdk_mark_idx = frame.find(PUB_SDK_MARK)
            if pub_sdk_mark_idx == -1:
                continue
            if frame[pub_sdk_mark_idx - 10:pub_sdk_mark_idx].count(NULL_BYTE) > 4:
                frame = frame[pub_sdk_mark_idx - 24:]
            else:
                frame = frame[pub_sdk_mark_idx - 13:]
            if len(frame) < 200:
                continue
            serial_port.flush()
            serial_port.flushInput()
            serial_port.flushOutput()
            decoder = ColombianIdCardPdf417Decoder(frame)
            frame = bytearray()
            data = decoder.decode()
            result = json.dumps(data, indent=2, default=lambda o: o.__dict__)
            print(result)

    except Exception as e:
        print(e)


if __name__ == '__main__':
    thread1 = Thread(target=barcode_serial)
    thread1.start()
    thread1.join()
"""
import json
from src.barcode.colombian_pdf417_decoder import ColombianIdCardPdf417Decoder
from controllers.asistencia import *
from datetime import datetime

# COLOMBIAN_CEDULA_PDF417_TRUNKED_LEN = 200
# PUB_SDK_MARK = bytes('PubDSK_', 'ascii')
# NULL_BYTE = bytes('\x00', 'ascii')


def barcode_input():
    print("Escanea el código con la pistola...")
    while True:
        scanned_input = input()  # La pistola escribe aquí como si fuera el teclado
        scanned_bytes = scanned_input.encode('utf-8')
        print(f"Lectura bruta: {scanned_bytes}")

        try:
            decoded_str = scanned_bytes.decode('utf-8')
            fields = decoded_str.split('\t')

            if len(fields) < 8:
                print("⚠️ Datos incompletos. Intenta escanear de nuevo.\n")
                continue

            # Asignar campos
            cedula = fields[0]
            primer_nombre = fields[3]
            segundo_nombre = fields[4]
            primer_apellido = fields[1]
            segundo_apellido = fields[2]
            genero = fields[5]
            fecha_nacimiento = fields[6]
            rh = fields[7]
            
            # Obtener fecha y hora actual
            now = datetime.now()

            # Separar la fecha y la hora
            fecha_actual = '2025-04-16'  
            # fecha_actual = now.strftime('%Y-%m-%d')  
            hora_actual = now.strftime('%H:%M:%S')
            
            # Imprimir datos separados
            print("✅ Datos separados:")
            print(f"Cédula: {cedula}")
            print(f"Nombre: {primer_nombre} {segundo_nombre}, {primer_apellido} {segundo_apellido}")
            print(f"Género: {genero}")
            print(f"Fecha Nacimiento: {fecha_nacimiento}")
            print(f"RH: {rh}")
            print("-" * 40)
            
            print("✅ Insertando en base de datos...")
            insert_asistencia(cedula,fecha_actual,hora_actual )
        
        except Exception as e:
            print(f"❌ Error general: {e}")

if __name__ == '__main__':
    barcode_input()
