document.addEventListener('DOMContentLoaded', function() {
  const botonesInfo = document.querySelectorAll('.info-servicio-btn');
  const modal = new bootstrap.Modal(document.getElementById('servicioModal'));
  const tituloModal = document.getElementById('modalServicioTitulo');
  const descripcionModal = document.getElementById('modalServicioDescripcion');

  const descripciones = {
    "Restaurante Gourmet": "Disfruta de platos locales e internacionales, con menú especial para niños y opciones vegetarianas.",
    "Spa y Bienestar": "Masajes, sauna y tratamientos rejuvenecedores para relajarte y cuidar tu bienestar.",
    "Piscina y Recreación": "Piscina para toda la familia, juegos acuáticos y áreas recreativas ."
  };

  botonesInfo.forEach(btn => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.tipo;
      tituloModal.textContent = tipo;
      descripcionModal.textContent = descripciones[tipo] || "Información no disponible";
      modal.show();
    });
  });
});
