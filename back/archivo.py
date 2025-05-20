import serial.tools.list_ports

def find_reader_port():
    ports = serial.tools.list_ports.comports()

    if not ports:
        print("⚠ No se encontraron puertos seriales.")
        return None

    print("🔌 Puertos detectados:")
    for port in ports:
        print(f"- {port.device} | {port.description}")

    # Buscar un puerto que parezca de lector USB
    for port in ports:
        if ("USB" in port.description or "Serial" in port.description or "BarCode" in port.description):
            print(f"✅ Se encontró posible lector en: {port.device}")
            return port.device

    print("❌ No se detectó ningún lector de código de barras.")
    return None

# Ejemplo de uso:
if __name__ == "__main__":
    puerto = find_reader_port()
    if puerto:
        print(f"\n📍 Usa este puerto en tu script: {puerto}")