document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get("admin") === "true";
  const addBtn = document.getElementById("addRestaurantBtn");
  const saveBtn = document.getElementById("saveRestaurantBtn");
  const form = document.getElementById("addRestaurantForm");
  const cardsContainer = document.getElementById("cards-container");

  // Mostrar botones admin si aplica
  if (isAdmin) {
    document.querySelectorAll(".admin-buttons").forEach((div) => div.classList.remove("d-none"));
    addBtn.classList.remove("d-none");
  }

  // Eventos de reserva
  document.querySelectorAll(".reservar-btn").forEach((btn) => {
    btn.addEventListener("click", () => showReserveModal());
  });

  // Menú modal dinámico
  document.querySelectorAll(".menu-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.dataset.title;
      const info = btn.dataset.info;
      showMenuModal(title, info);
    });
  });

  // Guardar nuevo restaurante
  let restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
  renderRestaurants();

  saveBtn.addEventListener("click", () => {
    const title = document.getElementById("newTitle").value.trim();
    const description = document.getElementById("newDescription").value.trim();
    const info = document.getElementById("newInfo").value.trim();
    const imageFile = document.getElementById("newImage").files[0];

    if (!title || !description || !info || !imageFile) {
      alert("Completa todos los campos.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newRestaurant = {
        id: Date.now(),
        title,
        description,
        info,
        image: e.target.result,
      };
      restaurants.push(newRestaurant);
      localStorage.setItem("restaurants", JSON.stringify(restaurants));
      renderRestaurants();
      form.reset();
      bootstrap.Modal.getInstance(document.getElementById("addRestaurantModal")).hide();
    };
    reader.readAsDataURL(imageFile);
  });

  // Renderizar restaurantes
  function renderRestaurants() {
    cardsContainer.querySelectorAll(".dynamic-card").forEach((c) => c.remove());

    restaurants.forEach((r) => {
      const col = document.createElement("div");
      col.classList.add("col-md-4", "dynamic-card");
      col.innerHTML = `
        <div class="card activity-card">
          <img src="${r.image}" class="card-img-top" alt="${r.title}">
          <div class="card-body">
            <h5 class="card-title">${r.title}</h5>
            <p class="card-text">${r.description}</p>
            <button class="btn btn-outline-success me-2 menu-btn" data-title="${r.title}" data-info="${r.info}">Ver menú</button>
            <button class="btn btn-primary reservar-btn">Reservar</button>
            <div class="admin-buttons mt-3 ${isAdmin ? "" : "d-none"}">
              <button class="btn btn-warning btn-sm me-2 editar-btn" data-id="${r.id}">Editar</button>
              <button class="btn btn-danger btn-sm eliminar-btn" data-id="${r.id}">Eliminar</button>
            </div>
          </div>
        </div>`;
      cardsContainer.appendChild(col);
    });

    // Reasignar eventos
    document.querySelectorAll(".menu-btn").forEach((b) =>
      b.addEventListener("click", () => showMenuModal(b.dataset.title, b.dataset.info))
    );
    document.querySelectorAll(".reservar-btn").forEach((b) =>
      b.addEventListener("click", showReserveModal)
    );
    document.querySelectorAll(".eliminar-btn").forEach((b) =>
      b.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        if (confirm("¿Eliminar este restaurante?")) {
          restaurants = restaurants.filter((x) => x.id !== id);
          localStorage.setItem("restaurants", JSON.stringify(restaurants));
          renderRestaurants();
        }
      })
    );
  }

  // Modal de menú dinámico
  function showMenuModal(title, info) {
    const modalHTML = `
      <div class="modal fade" id="menuModalDynamic" tabindex="-1">
        <div class="modal-dialog"><div class="modal-content">
          <div class="modal-header bg-success text-white"><h5 class="modal-title">${title}</h5></div>
          <div class="modal-body">${info}</div>
          <div class="modal-footer"><button class="btn btn-success" data-bs-dismiss="modal">Cerrar</button></div>
        </div></div>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    const modalEl = document.getElementById("menuModalDynamic");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    modalEl.addEventListener("hidden.bs.modal", () => modalEl.remove());
  }

  // Modal de reserva con dropdown
  function showReserveModal() {
    const modalHTML = `
      <div class="modal fade" id="reserveModalDynamic" tabindex="-1">
        <div class="modal-dialog"><div class="modal-content">
          <div class="modal-header bg-success text-white"><h5 class="modal-title">Reservar mesa</h5></div>
          <div class="modal-body">
            <p>Selecciona la cantidad de personas:</p>
            <select class="form-select" id="personasSelect">
              <option>1 persona</option><option>2 personas</option><option>3 personas</option>
              <option>4 personas</option><option>5 personas</option><option>6 personas</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-success" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-success" id="confirmReserva" data-bs-dismiss="modal">Aceptar</button>
          </div>
        </div></div>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modalEl = document.getElementById("reserveModalDynamic");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.querySelector("#confirmReserva").addEventListener("click", () => {
      const toast = new bootstrap.Toast(document.getElementById("reservaToast"));
      toast.show();
    });

    modalEl.addEventListener("hidden.bs.modal", () => modalEl.remove());
  }
});
