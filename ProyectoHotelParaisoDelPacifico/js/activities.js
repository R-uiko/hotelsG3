document.addEventListener('DOMContentLoaded', () => {
  const actividades = [
    {
      id: 'Playa',
      nombre: 'Tour por la playa',
      info: 'El tour incluye transporte y guía local. Perfecto para disfrutar el atardecer.',
      reserva: 'Recorrido guiado por las playas más hermosas.',
      detalles: 'Duración: 2 horas | Horario: 9 AM - 5 PM | Incluye hidratación.'
    },
    {
      id: 'Surf',
      nombre: 'Clases de surf',
      info: 'Aprende técnicas básicas y seguridad en el agua. Equipo incluido.',
      reserva: 'Clases con instructores certificados en una playa segura para principiantes.',
      detalles: 'Duración: 1.5 horas | Nivel: Principiante | Incluye tabla y traje.'
    },
    {
      id: 'Kayak',
      nombre: 'Kayak en la Bahía',
      info: 'Navega por aguas tranquilas con vistas impresionantes y guía profesional.',
      reserva: 'Reserva tu lugar para una experiencia única en kayak por la bahía.',
      detalles: 'Duración: 1 hora | Horario: 8 AM - 5 PM | Incluye guía y chaleco salvavidas.'
    }
  ];

  const modalContainer = document.getElementById('modalContainer');
  const toastContainer = document.getElementById('toastContainer');

  function crearModal(act, tipo, contenido) {
    return `
    <div class="modal fade" id="modal${tipo}${act.id}" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">${tipo === 'Reservar' ? 'Reservar - ' : ''}${act.nombre}</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>${contenido}</p>
            ${tipo === 'Reservar' ? `<label class='form-label'>Cantidad de personas:</label>
            <select id='personas${act.id}' class='form-select'>
              ${[1,2,3,4,5,6].map(n=>`<option value='${n}'>${n} persona${n>1?'s':''}</option>`).join('')}
            </select>`:''}
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button class="btn btn-success" id="btn${tipo}${act.id}">Aceptar</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  actividades.forEach(act => {
    modalContainer.innerHTML += crearModal(act, 'Info', act.info);
    modalContainer.innerHTML += crearModal(act, 'Reservar', act.reserva);
    modalContainer.innerHTML += crearModal(act, 'Detalles', act.detalles);
  });

  function showToast(msg) {
    const toastEl = document.createElement('div');
    toastEl.className = 'toast text-white bg-success border-0';
    toastEl.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div>
    <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', ()=> toastEl.remove());
  }

  actividades.forEach(act => {
    document.addEventListener('click', e => {
      if(e.target && e.target.id === `btnInfo${act.id}`) showToast(`Información de ${act.nombre} vista.`);
      if(e.target && e.target.id === `btnDetalles${act.id}`) showToast(`Detalles de ${act.nombre} consultados.`);
      if(e.target && e.target.id === `btnReservar${act.id}`) {
        const cant = document.getElementById(`personas${act.id}`).value;
        showToast(`Reserva de ${act.nombre} para ${cant} persona(s).`);
      }
    });
  });
});