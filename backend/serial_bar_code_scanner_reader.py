
from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from controllers.asistencia import insert_asistencia

app = FastAPI()

# Permitir acceso desde tu frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Puedes cambiar "*" por tu dominio en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de entrada
class CodigoInput(BaseModel):
    codigo: str

@app.post("/iniciar-escaner")
def iniciar_escaner(data: CodigoInput):
    codigo = data.codigo.strip()

    if not codigo:
        return {"error": "⚠️ Código vacío. Intenta escanear de nuevo."}

    try:
        now = datetime.now()
        fecha_actual = now.date()

        # Insertar en la base de datos
        insert_asistencia(codigo, fecha_actual, now)

        return {
            "status": "ok",
            "mensaje": f"✅ Código recibido ({codigo}). Asistencia registrada."
        }

    except Exception as e:
        return {"error": f"❌ Error al registrar asistencia: {str(e)}"}