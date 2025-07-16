// 🧠 Variables globales
const inputTarea = document.querySelector('.nueva-tarea input[type="text"]');
const selectPrioridad = document.querySelector('.nueva-tarea select');
const botonAgregar = document.querySelector('.nueva-tarea button');
const listaTareas = document.querySelector('.lista-tareas ul');
const filtros = document.querySelectorAll('.filtros button');
const completadasEl = document.querySelector('.estadisticas p:nth-child(2) b');
const pendientesEl = document.querySelector('.estadisticas p:nth-child(3) b');
const totalEl = document.querySelector('.estadisticas p:nth-child(4) b');
const barraProgreso = document.querySelector('.barra-progreso div');
const sugerenciaTexto = document.querySelector('.sugerencia.prioridad p');

let tareas = []; // 📝 Aquí guardamos las tareas como objetos

// ✅ Función para actualizar la lista
function renderTareas(filtro = 'Todas') {
  listaTareas.innerHTML = '';

  let tareasFiltradas = tareas;

  if (filtro === 'Pendientes') {
    tareasFiltradas = tareas.filter(t => !t.completada);
  } else if (filtro === 'Completadas') {
    tareasFiltradas = tareas.filter(t => t.completada);
  }

  tareasFiltradas.forEach((tarea, index) => {
    const li = document.createElement('li');
    li.className = `tarea ${tarea.prioridad.toLowerCase()} ${tarea.completada ? 'completada' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = tarea.completada;
    checkbox.addEventListener('change', () => {
      tarea.completada = checkbox.checked;
      actualizarEstadisticas();
      renderTareas(filtro);
      generarSugerencia();
    });

    const contenido = document.createElement('div');
    const titulo = document.createElement('strong');
    titulo.textContent = tarea.nombre;
    const hora = document.createElement('span');
    hora.textContent = tarea.completada ? 'Completada' : tarea.hora;

    contenido.appendChild(titulo);
    contenido.appendChild(document.createElement('br'));
    contenido.appendChild(hora);

    li.appendChild(checkbox);
    li.appendChild(contenido);

    listaTareas.appendChild(li);
  });
}

// ✅ Función para agregar tarea
botonAgregar.addEventListener('click', () => {
  const nombre = inputTarea.value.trim();
  const prioridad = selectPrioridad.value;
  const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (nombre === '') return;

  tareas.push({
    nombre,
    prioridad,
    completada: false,
    hora: horaActual
  });

  inputTarea.value = '';
  actualizarEstadisticas();
  renderTareas();
  generarSugerencia();
});

// ✅ Filtro de botones
filtros.forEach(boton => {
  boton.addEventListener('click', () => {
    filtros.forEach(b => b.classList.remove('activo'));
    boton.classList.add('activo');
    renderTareas(boton.textContent);
  });
});

// ✅ Estadísticas
function actualizarEstadisticas() {
  const completadas = tareas.filter(t => t.completada).length;
  const total = tareas.length;
  const pendientes = total - completadas;

  completadasEl.textContent = completadas;
  pendientesEl.textContent = pendientes;
  totalEl.textContent = total;

  const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);
  barraProgreso.style.width = porcentaje + '%';
}

// ✅ Sugerencia IA mágica 🧠✨
function generarSugerencia() {
  const tareaImportante = tareas.find(t => t.prioridad === 'Alta' && !t.completada);
  if (tareaImportante) {
    sugerenciaTexto.textContent = `Completá "${tareaImportante.nombre}" primero. Es tu tarea más importante.`;
  } else {
    sugerenciaTexto.textContent = '¡Todo bajo control! Podés seguir a tu ritmo 😊';
  }
}

// ✅ Cargar tareas iniciales de ejemplo
tareas = [
  { nombre: 'Estudiar JavaScript', prioridad: 'Alta', completada: false, hora: '09:00 AM' },
  { nombre: 'Preparar almuerzo', prioridad: 'Media', completada: false, hora: '12:00 PM' },
  { nombre: 'Ver Netflix', prioridad: 'Baja', completada: true, hora: '10:00 PM' }
];

renderTareas();
actualizarEstadisticas();
generarSugerencia();
