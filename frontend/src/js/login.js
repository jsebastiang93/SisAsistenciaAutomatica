function login() {
  const user = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  const errorMessage = document.getElementById('loginError');
  const passHash = md5(pass);

  fetch('http://localhost:3000/loginUser/getuserLogin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, pass: passHash })
  })
    .then(async response => {
      const data = await response.json();
      console.log('Respuesta completa del backend:', data);

      if (!response.ok) {
        // Si fue error de login, muestra el mensaje del backend
        throw new Error(data.mensaje || 'Credenciales incorrectas');
      }

      return data;
    })
    .then(data => {
      if (data.success) {
         // Extraer los valores de la respuesta
         const codDocente = data.usuario[0].cod_docente;
         const nombreCompleto = data.usuario[0].nombre_completo;

 
         console.log('Datos recibidos del backend:', { codDocente, nombreCompleto });
 
         // Almacenar los valores en el localStorage
         localStorage.setItem('cod_docente', codDocente);
         localStorage.setItem('nombre_completo', nombreCompleto);

          // Redirigir al dashboard
        window.location.href = 'src/pages/dashboard.html';
      } else {
        errorMessage.textContent = data.mensaje || 'Credenciales incorrectas';
      }
    })
    .catch(error => {
      console.error('Error en el login:', error);
      errorMessage.textContent = error.message || 'Error al conectar con el servidor';
    });
}