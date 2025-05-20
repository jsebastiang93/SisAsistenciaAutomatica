document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorMessage = document.getElementById('loginError');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const user = document.getElementById('email').value;
      const pass = document.getElementById('password').value;
      const passHash = md5(pass);

      try {
        const response = await fetch('http://localhost:3000/loginUser/getuserLogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user, pass: passHash })

        });

        const data = await response.json();
        console.log('Respuesta del backend:', data);

        if (data.success) {
          window.location.href = 'src/pages/dashboard.html';
        } else {
          errorMessage.textContent = data.message || 'Credenciales incorrectas';
        }
      } catch (error) {
        console.error('Error en el login:', error);
        errorMessage.textContent = 'Error al conectar con el servidor';
      }
    });
  }
});


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