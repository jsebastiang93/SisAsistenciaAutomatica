from src.barcode.colombian_pdf417_decoder import ColombianIdCardPdf417Decoder
from controllers.asistencia import *
from datetime import datetime

def barcode_input():
    print("Escanea el código con la pistola...")
    while True:
        scanned_input = input()  # La pistola escribe aquí como si fuera el teclado
        scanned_bytes = scanned_input.encode('utf-8')

        try:
            decoded_str = scanned_bytes.decode('utf-8')
            
            # Detectar si es PDF417 (esperamos que tenga tabulaciones)
            if '\t' in decoded_str:
                fields = decoded_str.split('\t')

                if len(fields) < 8:
                    print("-" * 40)
                    print("⚠️ Datos PDF417 incompletos. Intenta escanear de nuevo.\n")
                    print("-" * 40)
                    continue

                # Asignar campos
                cedula = fields[0]

                # Obtener fecha y hora actual
                now = datetime.now()
                fecha_actual = now.date()
                print("-" * 40)
                print("✅ Documento (PDF417) detectado. Insertando en base de datos...")
                insert_asistencia(cedula, fecha_actual, now)
                print("-" * 40)
                
            else:
                # Si no tiene tabuladores, asumimos que es un Code128 o similar
                code_data = decoded_str.strip()

                if code_data == "":
                    print("-" * 40)
                    print("⚠️ Código vacío. Intenta escanear de nuevo.\n")
                    print("-" * 40)
                    continue

                now = datetime.now()
                fecha_actual = now.date()

                print("-" * 40)
                print(f"✅ Código simple detectado: {code_data}")
                insert_asistencia(code_data, fecha_actual, now)
                print("-" * 40)            
        except Exception as e:
            print(f"❌ Error general: {e}")


if __name__ == '__main__':
    barcode_input()
