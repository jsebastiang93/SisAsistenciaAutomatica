import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

from src.preprocessing import load_data_from_db, clean_data
from src.features import generate_features

# 📊 Paso 1: Cargar los datos desde la base
print("📊 Cargando datos desde la base de datos...")
df = load_data_from_db()
df = clean_data(df)
df = generate_features(df)

# Ajustar el estilo de los gráficos
sns.set(style="whitegrid")

# 📊 Gráfico 1: Asistencia general
conteo = df["asistio"].value_counts().sort_index()

# Etiquetas dinámicas según los valores presentes
labels = []
for i in conteo.index:
    if i == 1:
        labels.append("Asistió")
    elif i == 0:
        labels.append("No asistió")
    else:
        labels.append(str(i))  # Por si hay algún valor raro

plt.figure(figsize=(6, 4))
conteo.plot(kind="bar", color=["mediumseagreen" if i == 1 else "tomato" for i in conteo.index])
plt.title("Asistencia general")
plt.ylabel("Cantidad de registros")
plt.xticks(ticks=range(len(labels)), labels=labels, rotation=0)
plt.tight_layout()
plt.show()

# 📅 Gráfico 2: Asistencia por día de la semana
plt.figure(figsize=(8, 5))
sns.countplot(data=df, x="dia_semana", hue="asistio", palette="Set2")
plt.title("Asistencia por día de la semana")
plt.xlabel("Día de la semana (0=Lunes ... 6=Domingo)")
plt.ylabel("Número de asistencias")
plt.legend(["No asistió", "Asistió"])
plt.tight_layout()
plt.show()
