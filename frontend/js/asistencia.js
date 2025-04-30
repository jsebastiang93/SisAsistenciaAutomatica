
//esto, un ejemplo que se puede usar para la conexion
function consultar(){
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
  
    try {
      const response = await fetch('http://localhost:3000/asistencia/getAll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Hubo un error al enviar los datos');
      }
  
      document.getElementById('respuesta').textContent = data.mensaje || 'Datos guardados correctamente';
      this.reset(); // Opcional: Limpiar el formulario
    } catch (error) {
      document.getElementById('respuesta').textContent = error.message;
    }
}