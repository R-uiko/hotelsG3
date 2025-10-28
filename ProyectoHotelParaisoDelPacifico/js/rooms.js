document.addEventListener('DOMContentLoaded', function() {
  const botonesReserva = document.querySelectorAll('.reservar-btn');
  const modal = new bootstrap.Modal(document.getElementById('reservaModal'));
  const inputHabitacion = document.getElementById('habitacion');
  const formReserva = document.getElementById('formReserva');

  // Array para guardar reservas en memoria
  let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

  // Abrir modal y asignar habitación
  botonesReserva.forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.habitacion-card');
      const titulo = card.querySelector('.card-title').textContent;
      inputHabitacion.value = titulo;
      modal.show();
    });
  });

  // Guardar reserva al enviar el formulario
  formReserva.addEventListener('submit', function(e) {
    e.preventDefault();

    const nuevaReserva = {
      nombre: document.getElementById('nombre').value.trim(),
      correo: document.getElementById('correo').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      habitacion: inputHabitacion.value,
      fechaEntrada: document.getElementById('fechaEntrada').value,
      fechaSalida: document.getElementById('fechaSalida').value,
      personas: document.getElementById('personas').value,
      comentarios: document.getElementById('comentarios').value
    };

    // Guardar en el array y en localStorage
    reservas.push(nuevaReserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    alert('Reserva guardada correctamente');

    formReserva.reset();
    modal.hide();

    console.log('Reservas actuales:', reservas); // Para ver las reservas en consola
  });
});
