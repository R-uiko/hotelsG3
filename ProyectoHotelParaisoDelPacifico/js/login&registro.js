(() => { 
  'use strict';
  
  const STORAGE_KEY = "usuarios";
  const $ = (sel) => document.querySelector(sel);

  // Función mejorada para cargar usuarios
  function cargarUsuarios() {
    try {
      const usuariosStorage = localStorage.getItem(STORAGE_KEY);
      console.log(" Datos crudos de localStorage:", usuariosStorage);
      
      if (!usuariosStorage) {
        console.log(" No hay usuarios registrados, creando array vacío");
        return [];
      }
      
      const usuarios = JSON.parse(usuariosStorage);
      console.log(" Usuarios parseados:", usuarios);
      return Array.isArray(usuarios) ? usuarios : [];
      
    } catch (error) {
      console.error(" Error crítico cargando usuarios:", error);
      return [];
    }
  }

  // Función mejorada para guardar usuarios
  function guardarUsuarios(usuarios) {
    try {
      if (!Array.isArray(usuarios)) {
        throw new Error("usuarios no es un array");
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
      console.log(" Usuarios guardados exitosamente:", usuarios);
      
      // Verificación
      const verificacion = cargarUsuarios();
      console.log(" Verificación - Usuarios después de guardar:", verificacion);
      
    } catch (error) {
      console.error(" Error guardando usuarios:", error);
    }
  }

  // Sistema de Toast mejorado
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

  // Validación de contraseña 
  function validarPasswordSegura(password) {
    console.log(" Validando contraseña:", password);
    
    if (password.length < 8) {
      return { valida: false, mensaje: "Mínimo 8 caracteres" };
    }
    
    return { valida: true, mensaje: "Contraseña válida" };
  }

  // LOGIN - Con prevención completa
  const loginForm = $("#login");
  if (loginForm) {
    console.log(" Formulario de login encontrado");
    
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation(); // Previene propagación
      console.log(" Procesando login...");
      
      const correo = $("#correo").value.trim();
      const password = $("#password").value.trim();

      console.log(" Correo ingresado:", correo);
      console.log(" Contraseña ingresada:", password.replace(/./g, '*'));

      // Validación básica
      if (!correo || !password) {
        console.log(" Campos vacíos detectados");
        mostrarToast("Completa todos los campos", "warning");
        return false; // Return false adicional
      }

      // Cargar usuarios
      const usuarios = cargarUsuarios();
      console.log(" Usuarios cargados para login:", usuarios);

      // Buscar usuario
      const usuarioValido = usuarios.find(u => {
        const coincide = u.correo === correo && u.password === password;
        console.log(` Comparando: ${u.correo} === ${correo} && ${u.password} === ${password} → ${coincide}`);
        return coincide;
      });

      if (usuarioValido) {
        console.log(" Login exitoso:", usuarioValido);
        mostrarToast(`Bienvenido ${usuarioValido.nombre}`, "success");
        
        // Guardar sesión
        try {
          localStorage.setItem("usuarioActivo", JSON.stringify(usuarioValido));
          console.log(" Sesión guardada en usuarioActivo");
          
          // Redirección forzada
          setTimeout(() => {
            console.log(" Redirigiendo a index.html...");
            window.location.href = "index.html";
          }, 1000);
          
        } catch (error) {
          console.error("Error guardando sesión:", error);
          mostrarToast("Error al guardar sesión", "danger");
        }
        
      } else {
        console.log("Login fallido - Credenciales incorrectas");
        console.log("Correo buscado:", correo);
        console.log("Usuarios disponibles:", usuarios.map(u => u.correo));
        mostrarToast("Correo o contraseña incorrectos", "danger");
      }
      
      return false; // Previene envío tradicional
    });
  } else {
    console.log("Formulario de login NO encontrado");
  }

  // REGISTRO - Con prevención completa
  const registerForm = $("#registerForm");
  if (registerForm) {
    console.log(" Formulario de registro encontrado");
    
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation(); // Previene propagación
      console.log("Procesando registro...");
      
      const nombre = $("#nombre").value.trim();
      const correo = $("#correo").value.trim();
      const password = $("#password").value.trim();
      const confirmar = $("#confirmar").value.trim();

      console.log(" Datos de registro:", { nombre, correo, password: password.replace(/./g, '*') });

      // Validaciones
      if (!nombre || !correo || !password || !confirmar) {
        mostrarToast("Todos los campos son obligatorios", "warning");
        return false;
      }

      if (password !== confirmar) {
        mostrarToast("Las contraseñas no coinciden", "warning");
        return false;
      }

      const validacion = validarPasswordSegura(password);
      if (!validacion.valida) {
        mostrarToast(validacion.mensaje, "warning");
        return false;
      }

      let usuarios = cargarUsuarios();
      
      // Verificar si el correo ya existe
      if (usuarios.some(u => u.correo === correo)) {
        mostrarToast("Este correo ya está registrado", "danger");
        return false;
      }

      // Registrar nuevo usuario
      const nuevoUsuario = { nombre, correo, password };
      usuarios.push(nuevoUsuario);
      guardarUsuarios(usuarios);

      console.log("Usuario registrado:", nuevoUsuario);
      mostrarToast("Registro exitoso. Redirigiendo...", "success");

      setTimeout(() => {
        console.log(" Redirigiendo a login.html...");
        window.location.href = "login.html";
      }, 2000);
      
      return false; // Previene envío tradicional
    });
  }

  // CERRAR SESIÓN
  const cerrarSesionBtn = $("#cerrarSesion");
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Cerrando sesión...");
      localStorage.removeItem("usuarioActivo");
      mostrarToast("Sesión cerrada", "info");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    });
  }

  // INICIALIZACIÓN
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Aplicación inicializada");
    console.log("Página actual:", window.location.pathname);
    
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo") || "null");
    console.log("Estado de sesión:", usuarioActivo ? "Logueado" : "No logueado");
    
    if (usuarioActivo) {
      console.log(" Usuario activo:", usuarioActivo.nombre);
    }
  });

})();