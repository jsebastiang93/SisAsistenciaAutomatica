  let escaneoManual = false;
  let ultimaLectura = 0;

  function confirmarEnvioDesdeModal() {
    const codigo = document.getElementById("codigoEscanerModal").value.trim();

    if (codigo === "") {
      alert("⚠️ Por favor escanee o ingrese un código.");
      return;
    }

    fetch("http://localhost:8000/iniciar-escaner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ codigo })
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById("respuestaEscaneo").innerText =
        data.mensaje || data.error || "Respuesta inesperada.";
    })
    .catch(error => {
      document.getElementById("respuestaEscaneo").innerText =
        "❌ Error al conectar con el servidor.";
      console.error("Error:", error);
    });

    cerrarModal();
  }

  function mostrarModalConfirmacion() {
    const modal = document.getElementById("modalConfirmacion");
    const input = document.getElementById("codigoEscanerModal");
    modal.style.display = "flex";
    input.value = "";
    input.focus();
    escaneoManual = false; // ← Reiniciar al mostrar el modal
  }

  function cerrarModal() {
    document.getElementById("modalConfirmacion").style.display = "none";
    document.getElementById("codigoEscanerModal").value = "";
    escaneoManual = false;
  }

  // Marcar si el usuario enfocó el input manualmente
  const inputCodigo = document.getElementById("codigoEscanerModal");

  inputCodigo.addEventListener("focus", () => {
    escaneoManual = true;
  });

  inputCodigo.addEventListener("blur", () => {
    escaneoManual = false;
  });

  // Capturar Enter con lógica de control
  inputCodigo.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      const ahora = Date.now();
      
      // ⚠️ Prevenir si fue Enter automático (rápido tras escaneo)
      if (!escaneoManual || ahora - ultimaLectura < 300) {
        event.preventDefault();
        return;
      }

      ultimaLectura = ahora;
      confirmarEnvioDesdeModal();
    }
  });

  // Evitar Enter global cuando no corresponde
  document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      const modal = document.getElementById("modalConfirmacion");
      const input = document.getElementById("codigoEscanerModal");

      // Si no estamos dentro del modal o el input no está enfocado, prevenir
      if (modal.style.display === "flex" && document.activeElement !== input) {
        event.preventDefault();
      }
      if (modal.style.display !== "flex") {
        event.preventDefault();
      }
    }
  });




function tomaAsistencia() {
  let fecha_sistema = new Date();

  let fecha = new Date().toISOString().split('T')[0];
  console.log(fecha); // Ejemplo: "2025-05-20"
  //let hora = fecha_sistema.toLocaleTimeString();  // e.g. "14:37:22"
  let hora = fecha_sistema.toTimeString().split(' ')[0];  // e.g. "14:37:22"
  console.log(hora); // Ejemplo: "14:37:22"

  let documento = document.getElementById("codigoEscanerModal").value;
  let asignatura = document.getElementById("asignaturaSelect").value;

  
  fetch('http://localhost:3000/registroCod/setAsistencia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      documento:documento, 
      fecha_asis:fecha, 
      hora_asis:hora,
      periodo_id:asignatura })
  })
    .then(async response => {
    const data = await response.json();

    if (!response.ok) {
      alert("❌ " + data.mensaje);
    } else {
      alert("✅ " + data.mensaje);
      cerrarModal();

      // Limpia el campo del input  
      document.getElementById('codigoEscanerModal').value = '';
    }
  })
  .catch(error => {
    console.error("❌ Error de red:", error);
    alert("❌ Error al conectar con el servidor.");
  });
}

function cerrarModal() {
  document.getElementById('modalConfirmacion').style.display = 'none';
}
