from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

def train_model(df):
    # Separar features (X) y etiqueta (y)
    X = df[["dia_semana", "hora_clase", "duracion"]]
    y = df["asistio"]

    # Dividir en entrenamiento (80%) y prueba (20%)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Crear el modelo
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)

    # Hacer predicciones
    y_pred = model.predict(X_test)

    # Evaluar resultados
    print("📊 Reporte de clasificación:")
    print(classification_report(y_test, y_pred))

    # Guardar modelo entrenado
    joblib.dump(model, "models/modelo_asistencia.pkl")
    print("✅ Modelo guardado en 'models/modelo_asistencia.pkl'")

