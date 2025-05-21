// Función para cargar los períodos académicos
function cargarPeriodos() {
    console.log('Iniciando solicitud a la API getPeriodo...');
    
    fetch('http://localhost:3000/infoMateria/getPeriodo', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        console.log('Respuesta recibida:', response);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Datos de periodo recibidos:', data);
  
        // Verificar si la respuesta tiene la propiedad "datos"
        if (!data.datos || !Array.isArray(data.datos)) {
          throw new Error('La respuesta no contiene un array válido en "datos"');
        }
  
        const periodoSelect = document.getElementById('periodoSelect');
        periodoSelect.innerHTML = ''; // Limpiar opciones anteriores
  
        data.datos.forEach((periodo, index) => {
            const option = document.createElement('option');
            option.value = periodo.id_periodo_acad;
            option.textContent = periodo.descripcion;
            periodoSelect.appendChild(option);
          
            // Guardar cod_periodo_acad en localStorage solo del primer elemento
            if (index === 0) {
              localStorage.setItem('cod_periodo_acad', periodo.cod_periodo_acad);
              actualizarInfoUsuario(); 
            }
          });
      
      })
      .catch(error => {
        console.error('Error al cargar períodos:', error.message);
        document.getElementById('periodoSelect').innerHTML = `<option value="">${error.message || 'Error al cargar períodos'}</option>`;
      });
  }
  

// Función para cargar las asignaturas según el docente logueado
function cargarAsignaturas() {
    console.log('Iniciando solicitud a la API getAsignatura...');
    
    const codDocente = localStorage.getItem('cod_docente');
    console.log('Código del docente:', codDocente);
  
    // Verificar si el cod_docente existe
    if (!codDocente) {
      console.error('Error: No se encontró el código del docente en el localStorage');
      document.getElementById('asignaturaSelect').innerHTML = '<option value="">Error: Docente no identificado</option>';
      return;
    }
  
    fetch('http://localhost:3000/infoMateria/getAsignatura', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cod_docente: codDocente }) 
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Datos Asignaturas recibidos:', data);
  
        // Verificar si la respuesta tiene la propiedad "datos" y es un array
        if (!data.datos || !Array.isArray(data.datos)) {
          throw new Error('La respuesta no contiene un array válido en "datos"');
        }
  
        const asignaturaSelect = document.getElementById('asignaturaSelect');
        asignaturaSelect.innerHTML = ''; // Limpiar opciones anteriores
  
        data.datos.forEach(asignatura => {
          const option = document.createElement('option');
          option.value = asignatura.id_asignatura;
          option.textContent = asignatura.descripcion;
          asignaturaSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error al cargar asignaturas:', error.message);
        document.getElementById('asignaturaSelect').innerHTML = `<option value="">${error.message || 'Error al cargar asignaturas'}</option>`;
      });
  }
  
// Función para cargar la información del Usuario
function actualizarInfoUsuario() {
    const nombreCompleto = localStorage.getItem('nombre_completo') || 'Usuario';
    const codigoPeriodo = localStorage.getItem('cod_periodo_acad') || 'Periodo no definido';
  
    const infoP = document.getElementById('infoUsuario');
    if (infoP) {
      infoP.innerHTML = `${nombreCompleto}<br><span>${codigoPeriodo}</span>`;
    }
  }
  
// Función para cargar la información de las Cards del dashboard
  

// Inicializar el dashboard
document.addEventListener('DOMContentLoaded', () => {
    cargarPeriodos();
    cargarAsignaturas();
    actualizarInfoUsuario();
  });