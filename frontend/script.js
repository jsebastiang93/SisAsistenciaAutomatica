function login() {
  const user = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  const errorMessage = document.getElementById('loginError');
  const passHash = md5(pass); // Asegúrate de tener la librería md5

  fetch('http://localhost:3000/loginUser/getuserLogin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, pass: passHash })
  })
    .then(async response => {
      const data = await response.json();

      if (!response.ok) {
        // Si fue error de login, muestra el mensaje del backend
        throw new Error(data.mensaje || 'Credenciales incorrectas');
      }

      return data;
    })
    .then(data => {
      if (data.success) {
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


/*
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que el formulario se envíe normalmente
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDisplay = document.getElementById('loginError');
  
    // Usuario válido (puedes cambiarlo)
    const validEmail = "admin@unicatolica.edu.co";
    const validPassword = "1234";
  
    if (email === validEmail && password === validPassword) {
      // Redirigir al dashboard
      window.location.href = "src/pages/dashboard.html";
    } else {
      // Mostrar error
      errorDisplay.textContent = "Correo o contraseña incorrectos.";
      errorDisplay.style.color = "red";
    }
  });
  */