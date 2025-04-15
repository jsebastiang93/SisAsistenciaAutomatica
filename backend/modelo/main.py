from src.preprocessing import load_data_from_db, clean_data
from src.features import generate_features
from src.train_model import train_model

def main():
    print("📥 Cargando datos desde la base de datos...")
    df = load_data_from_db()

    print("🧼 Limpiando datos...")
    df = clean_data(df)

    print("🧠 Generando variables para el modelo...")
    df = generate_features(df)

    print("🤖 Entrenando modelo de predicción...")
    train_model(df)

    print("✅ ¡Todo listo! Modelo entrenado y guardado.")

if __name__ == "__main__":
    main()
