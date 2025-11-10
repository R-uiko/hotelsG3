const STORAGE_RESERVAS = "reservas";

// ====== helpers de storage reservas ======
function cargarReservas() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_RESERVAS)) ?? [];
  } catch {
    return [];
  }
}

function guardarReservas(reservas) {
  localStorage.setItem(STORAGE_RESERVAS, JSON.stringify(reservas));
}

// ====== UI ======
function mostrarToast(mensaje, tipo = "info") {
  const toastEl = document.getElementById("appToast");
  if (!toastEl) return;

  const body = toastEl.querySelector(".toast-body");
  body.textContent = mensaje;
  toastEl.className = "toast align-items-center text-white border-0 bg-" + tipo;

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

function esAdministrador(usuario) {
  return (
    usuario &&
    (usuario.correo === "admin@hotel.com" || usuario.correo === "ad@hotel.com")
  );
}

function actualizarEstadoUsuarioNavbar() {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  const registroBtn = document.getElementById("registro-btn");
  const usuarioNav = document.getElementById("usuario-logueado");
  const cerrarSesionNav = document.getElementById("cerrarSesion");

  if (usuarioActivo) {
    if (registroBtn) registroBtn.style.display = "none";
    if (usuarioNav) {
      usuarioNav.style.display = "inline";
      usuarioNav.textContent =
        "Hola, " +
        usuarioActivo.nombre +
        (esAdministrador(usuarioActivo) ? " (Admin)" : "");
    }
    if (cerrarSesionNav) cerrarSesionNav.style.display = "inline";
  } else {
    if (usuarioNav) usuarioNav.style.display = "none";
    if (cerrarSesionNav) cerrarSesionNav.style.display = "none";
    if (registroBtn) registroBtn.style.display = "inline";
  }

  if (cerrarSesionNav) {
    cerrarSesionNav.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      mostrarToast("Has cerrado sesión correctamente.", "info");
      setTimeout(() => (window.location.href = "index.html"), 1000);
    });
  }
}

// ====== tabla de reservas ======
function renderReservas() {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  const tbody = document.querySelector("#tablaReservas tbody");
  const alerta = document.getElementById("alerta");
  const rolActual = document.getElementById("rol-actual");

  const reservas = cargarReservas();

  // si NO hay usuario logueado, no mostramos nada
  if (!usuarioActivo) {
    alerta.textContent = "Debes iniciar sesión para ver las reservas.";
    alerta.classList.remove("d-none");
    tbody.innerHTML = "";
    return;
  }

  let reservasMostrar = [];

  if (esAdministrador(usuarioActivo)) {
    // admin ve todo
    reservasMostrar = reservas;
    rolActual.textContent = "Administrador - viendo todas las reservas";
  } else {
    // usuario normal ve solo sus reservas (por correo)
    reservasMostrar = reservas.filter(
      (r) => r.correo && r.correo === usuarioActivo.correo
    );
    rolActual.textContent = "Usuario - viendo tus reservas";
  }
  rolActual.classList.remove("d-none");

  if (reservasMostrar.length === 0) {
    alerta.textContent = "No hay reservas para mostrar.";
    alerta.classList.remove("d-none");
    tbody.innerHTML = "";
    return;
  } else {
    alerta.classList.add("d-none");
  }

  tbody.innerHTML = "";
  reservasMostrar.forEach((reserva, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${reserva.nombre || "-"}</td>
      <td>${reserva.correo || "-"}</td>
      <td>${reserva.telefono || "-"}</td>
      <td>${reserva.habitacion || "-"}</td>
      <td>${reserva.fechaEntrada || "-"}</td>
      <td>${reserva.fechaSalida || "-"}</td>
      <td>${reserva.personas || "-"}</td>
      <td>${reserva.comentarios || "-"}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-danger eliminar-reserva">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // permitir eliminar siempre
  document.querySelectorAll(".eliminar-reserva").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      if (!confirm("¿Eliminar esta reserva?")) return;

      const reservaAEliminar = reservasMostrar[i];
      const todas = cargarReservas();

      // buscar esa misma reserva en el array original
      const idxOriginal = todas.findIndex(
        (r) =>
          r.nombre === reservaAEliminar.nombre &&
          r.correo === reservaAEliminar.correo &&
          r.fechaEntrada === reservaAEliminar.fechaEntrada &&
          r.fechaSalida === reservaAEliminar.fechaSalida &&
          r.habitacion === reservaAEliminar.habitacion
      );

      if (idxOriginal !== -1) {
        todas.splice(idxOriginal, 1);
        guardarReservas(todas);
        mostrarToast("Reserva eliminada.", "danger");
        renderReservas();
      }
    });
  });
}

// ====== init global ======
document.addEventListener("DOMContentLoaded", () => {
  actualizarEstadoUsuarioNavbar();
  renderReservas();
});

