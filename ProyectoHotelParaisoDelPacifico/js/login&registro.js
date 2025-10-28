(() => {
  const STORAGE_KEY = "usuarios";
  const $ = (sel) => document.querySelector(sel);

  function cargarUsuarios() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
      return [];
    }
  }

  function guardarUsuarios(usuarios) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
  }

  const toastEl = $("#appToast");
  let toast;
  if (toastEl) toast = new bootstrap.Toast(toastEl);

  function mostrarToast(mensaje, tipo = "info") {
    if (!toastEl) return;
    const body = toastEl.querySelector(".toast-body");
    body.textContent = mensaje;
    toastEl.className = `toast align-items-center text-white border-0 bg-${tipo}`;
    toast.show();
  }

  const loginForm = $("#login");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const correo = $("#correo").value.trim();
      const password = $("#password").value.trim();

      const usuarios = cargarUsuarios();
      const usuarioValido = usuarios.find(
        (u) => u.correo === correo && u.password === password
      );

      if (usuarioValido) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioValido));
        mostrarToast(`Bienvenido ${usuarioValido.nombre}`, "success");
        setTimeout(() => (window.location.href = "index.html"), 1500);
      } else {
        mostrarToast("Correo o contraseña incorrectos.", "danger");
      }
    });
  }


/*
   
  function inicializarToast() {
    const toastEl = $("#appToast");
    if (toastEl && typeof bootstrap !== 'undefined') {
      return new bootstrap.Toast(toastEl);
    }
    return null;
  }

  const toast = inicializarToast();

  function mostrarToast(mensaje, tipo = "info") {
    console.log(` Toast [${tipo}]:`, mensaje);
    
    if (toast) {
      const body = $("#appToast .toast-body");
      if (body) {
        body.textContent = mensaje;
        $("#appToast").className = `toast align-items-center text-white border-0 bg-${tipo}`;
        toast.show();
      }
    } else {
      // Fallback si Bootstrap no está disponible
      alert(mensaje);
    }
  }
*/ 

  const registroForm = $("#registerForm");
  if (registroForm) {
    registroForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = $("#nombre").value.trim();
      const correo = $("#correo").value.trim();
      const password = $("#password").value.trim();
      const confirmar = $("#confirmar").value.trim();

      if (password !== confirmar) {
        mostrarToast("Las contraseñas no coinciden.", "warning");
        return;
      }

      let usuarios = cargarUsuarios();
      const existe = usuarios.find((u) => u.correo === correo);
      if (existe) {
        mostrarToast("Este correo ya está registrado.", "danger");
        return;
      }

      usuarios.push({ nombre, correo, password });
      guardarUsuarios(usuarios);
      mostrarToast("Registro exitoso. Ahora puedes iniciar sesión.", "success");

      setTimeout(() => (window.location.href = "login.html"), 2500);
    });
  }

  const cerrarSesionBtn = $("#cerrarSesion");
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      mostrarToast("Has cerrado sesión correctamente.", "info");
      setTimeout(() => (window.location.href = "index.html"), 1500);
    });
  }

  function actualizarEstadoUsuario() {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    const registroBtn = document.getElementById("registro-btn");
    const usuarioNav = document.getElementById("usuario-logueado");
    const cerrarSesionNav = document.getElementById("cerrarSesion");

    if (usuarioActivo) {
      if (registroBtn) registroBtn.style.display = "none";
      if (usuarioNav) {
        usuarioNav.style.display = "inline";
        usuarioNav.textContent = `Hola, ${usuarioActivo.nombre}`;
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
        alert("Has cerrado sesión correctamente.");
        window.location.href = "index.html";
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {

    actualizarEstadoUsuario();
  });

  window.actualizarEstadoUsuario = actualizarEstadoUsuario;
})();
