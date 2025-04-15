def generate_features(df):
    # Día de la semana (0 = lunes)
    df["dia_semana"] = df["fecha_clase"].dt.dayofweek
    
    # Hora de inicio ya viene como número desde preprocessing
    df["hora_clase"] = df["hora_inicio"]

    # Duración de la clase (en horas)
    df["duracion"] = df["hora_fin"] - df["hora_inicio"]

    # Etiqueta: asistió o no
    df["asistio"] = df["estado"].apply(lambda x: 1 if x == 1 else 0)

    # Selecciona solo las columnas que usarás para el modelo
    return df[["dia_semana", "hora_clase", "duracion", "asistio"]]
