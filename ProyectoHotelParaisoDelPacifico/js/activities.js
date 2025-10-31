document.addEventListener("DOMContentLoaded", () => {
  // Detectar si el usuario es admin desde la URL (?admin=true)
  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.get("admin") === "true";

  const cardsContainer = document.getElementById("cards-container");
  const addActivityBtn = document.getElementById("addActivityBtn");
  const saveActivityBtn = document.getElementById("saveActivityBtn");
  const addActivityForm = document.getElementById("addActivityForm");

  // Mostrar u ocultar controles de admin
  if (isAdmin) {
    document.querySelectorAll(".admin-buttons").forEach((div) => div.classList.remove("d-none"));
    addActivityBtn.classList.remove("d-none");
  } else {
    document.querySelectorAll(".admin-buttons").forEach((div) => div.classList.add("d-none"));
    addActivityBtn.classList.add("d-none");
  }

  // Cargar actividades guardadas
  let activities = JSON.parse(localStorage.getItem("activities")) || [];
  renderActivities();

  // === AGREGAR NUEVA ACTIVIDAD ===
  saveActivityBtn.addEventListener("click", () => {
    const title = document.getElementById("newTitle").value.trim();
    const description = document.getElementById("newDescription").value.trim();
    const info = document.getElementById("newInfo").value.trim();
    const imageFile = document.getElementById("newImage").files[0];

    if (!title || !description || !info || !imageFile) {
      showToast("Completa todos los campos antes de guardar.", "bg-warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newActivity = {
        id: Date.now(),
        title,
        description,
        info,
        image: e.target.result,
      };
      activities.push(newActivity);
      localStorage.setItem("activities", JSON.stringify(activities));
      renderActivities();
      addActivityForm.reset();
      const modal = bootstrap.Modal.getInstance(document.getElementById("addActivityModal"));
      modal.hide();
      showToast("Actividad agregada correctamente.", "bg-success");
    };
    reader.readAsDataURL(imageFile);
  });

  // === RENDERIZAR ACTIVIDADES ===
  function renderActivities() {
    // Eliminar tarjetas anteriores dinámicas
    cardsContainer.querySelectorAll(".dynamic-card").forEach((c) => c.remove());

    activities.forEach((activity) => {
      const col = document.createElement("div");
      col.classList.add("col-md-4", "dynamic-card");
      col.innerHTML = `
        <div class="card activity-card">
          <img src="${activity.image}" class="card-img-top" alt="${activity.title}" />
          <div class="card-body">
            <h5 class="card-title">${activity.title}</h5>
            <p class="card-text">${activity.description}</p>
            <button class="btn btn-outline-success me-2 info-btn" data-id="${activity.id}">Más información</button>
            <button class="btn btn-primary reserve-btn" data-id="${activity.id}">Reservar</button>
            <div class="admin-buttons mt-3 ${isAdmin ? "" : "d-none"}">
              <button class="btn btn-warning btn-sm me-2 editar-btn" data-id="${activity.id}">Editar</button>
              <button class="btn btn-danger btn-sm eliminar-btn" data-id="${activity.id}">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      cardsContainer.appendChild(col);
    });

    // Activar eventos
    addInfoEvent();
    addDeleteEvent();
    addEditEvent();
    addReserveEvent();
    addReserveEventToStaticCards();
  }

  // === "MÁS INFORMACIÓN" ===
  function addInfoEvent() {
    document.querySelectorAll(".info-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const activity = activities.find((a) => a.id === id);
        if (activity) showInfoModal(activity);
      });
    });
  }

  function showInfoModal(activity) {
    const modalHTML = `
      <div class="modal fade" id="infoModalDynamic" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title">${activity.title}</h5>
            </div>
            <div class="modal-body">
              <p>${activity.info}</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-success" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    const modalEl = document.getElementById("infoModalDynamic");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    modalEl.addEventListener("hidden.bs.modal", () => modalEl.remove());
  }

  // === RESERVAR ===
  function addReserveEvent() {
    document.querySelectorAll(".reserve-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const activity = activities.find((a) => a.id === id);
        if (activity) showReserveModal(activity.title);
      });
    });
  }

  // Reservar en las 3 primeras tarjetas estáticas del HTML
  function addReserveEventToStaticCards() {
    document.querySelectorAll('[data-bs-target^="#reserveModal"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const title = btn.closest(".card-body").querySelector(".card-title").textContent;
        showReserveModal(title);
      });
    });
  }

  function showReserveModal(title) {
    const modalHTML = `
      <div class="modal fade" id="reserveModalDynamic" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">Reservar: ${title}</h5>
            </div>
            <div class="modal-body">
              <label class="form-label">¿Para cuántas personas?</label>
              <select id="numPersons" class="form-select mb-3">
                <option value="1">1 persona</option>
                <option value="2">2 personas</option>
                <option value="3">3 personas</option>
                <option value="4">4 personas</option>
                <option value="5">5 personas</option>
              </select>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button id="confirmReserveBtn" class="btn btn-primary">Confirmar Reserva</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modalEl = document.getElementById("reserveModalDynamic");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    document.getElementById("confirmReserveBtn").addEventListener("click", () => {
      const persons = document.getElementById("numPersons").value;
      showToast(`Reserva confirmada para ${persons} persona(s) en "${title}".`, "bg-success");
      modal.hide();
    });

    modalEl.addEventListener("hidden.bs.modal", () => modalEl.remove());
  }

  // === ELIMINAR ===
  function addDeleteEvent() {
    document.querySelectorAll(".eliminar-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        if (confirm("¿Seguro que deseas eliminar esta actividad?")) {
          activities = activities.filter((a) => a.id !== id);
          localStorage.setItem("activities", JSON.stringify(activities));
          renderActivities();
          showToast("Actividad eliminada.", "bg-danger");
        }
      });
    });
  }

  // === EDITAR ===
  function addEditEvent() {
    document.querySelectorAll(".editar-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const activity = activities.find((a) => a.id === id);
        if (!activity) return;

        document.getElementById("newTitle").value = activity.title;
        document.getElementById("newDescription").value = activity.description;
        document.getElementById("newInfo").value = activity.info;
        document.getElementById("newImage").value = "";

        const modal = new bootstrap.Modal(document.getElementById("addActivityModal"));
        modal.show();

        saveActivityBtn.onclick = () => {
          const title = document.getElementById("newTitle").value.trim();
          const description = document.getElementById("newDescription").value.trim();
          const info = document.getElementById("newInfo").value.trim();
          const imageFile = document.getElementById("newImage").files[0];

          if (!title || !description || !info) {
            showToast("Completa todos los campos antes de guardar.", "bg-warning");
            return;
          }

          const updateActivity = (imageData) => {
            activity.title = title;
            activity.description = description;
            activity.info = info;
            if (imageData) activity.image = imageData;
            localStorage.setItem("activities", JSON.stringify(activities));
            renderActivities();
            modal.hide();
            showToast("✏️ Actividad actualizada.", "bg-info");
          };

          if (imageFile) {
            const reader = new FileReader();
            reader.onload = (ev) => updateActivity(ev.target.result);
            reader.readAsDataURL(imageFile);
          } else {
            updateActivity(null);
          }
        };
      });
    });
  }

  // === TOAST GENERAL ===
  function showToast(message, colorClass = "bg-primary") {
    // Si no existe el contenedor, crearlo
    if (!document.getElementById("toastContainer")) {
      const container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container position-fixed bottom-0 end-0 p-3";
      document.body.appendChild(container);
    }

    const toastHTML = `
      <div class="toast align-items-center text-white ${colorClass} border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `;

    const container = document.getElementById("toastContainer");
    container.insertAdjacentHTML("beforeend", toastHTML);

    const toastEl = container.lastElementChild;
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();

    toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
  }
});
