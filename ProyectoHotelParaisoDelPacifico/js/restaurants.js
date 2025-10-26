document.addEventListener('DOMContentLoaded', () => {
  const restaurantes = [
    { id: 'Mar', nombre: 'Restaurante del Mar', info: 'Ambiente elegante frente al mar.', menu: ['Pescado frito', 'Mariscada', 'Jugo de piña', 'Postre de coco'] },
    { id: 'Pacifico', nombre: 'Sabores del Pacífico', info: 'Fusión tropical de sabores con estilo gourmet.', menu: ['Filete de pescado', 'Ensalada tropical', 'Batido de mango', 'Flan casero'] },
    { id: 'Cafe', nombre: 'Café Paraíso', info: 'Ideal para relajarse con café y postres artesanales.', menu: ['Café capuchino', 'Té verde', 'Cheesecake', 'Brownie con helado'] }
  ];

  const modalContainer = document.getElementById('modalContainer');
  const toastContainer = document.getElementById('toastContainer');

  function crearModal(rest, tipo, contenido) {
    let menuHTML = '';
    if (tipo === 'Menu') {
      menuHTML = '<ul>' + rest.menu.map(p => `<li>${p}</li>`).join('') + '</ul>';
    }
    return `
    <div class="modal fade" id="modal${tipo}${rest.id}" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">${tipo === 'Reservar' ? 'Reservar mesa - ' : ''}${rest.nombre}</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>${contenido}</p>
            ${menuHTML}
            ${tipo === 'Reservar' ? `<label class='form-label mt-2'>Cantidad de personas:</label>
            <select id='personas${rest.id}' class='form-select'>
              ${[1,2,3,4,5,6].map(n=>`<option value='${n}'>${n} persona${n>1?'s':''}</option>`).join('')}
            </select>`:''}
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button class="btn btn-success" id="btn${tipo}${rest.id}">Aceptar</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  restaurantes.forEach(r => {
    modalContainer.innerHTML += crearModal(r, 'Info', r.info);
    modalContainer.innerHTML += crearModal(r, 'Menu', 'Explora nuestro menú destacado:');
    modalContainer.innerHTML += crearModal(r, 'Reservar', 'Selecciona tu mesa y cantidad de personas.');
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

  restaurantes.forEach(r => {
    document.addEventListener('click', e => {
      if(e.target && e.target.id === `btnInfo${r.id}`) showToast(`Información de ${r.nombre} vista.`);
      if(e.target && e.target.id === `btnMenu${r.id}`) showToast(`Menú de ${r.nombre} consultado.`);
      if(e.target && e.target.id === `btnReservar${r.id}`) {
        const cant = document.getElementById(`personas${r.id}`).value;
        showToast(`Mesa reservada en ${r.nombre} para ${cant} persona(s).`);
      }
    });
  });
});
