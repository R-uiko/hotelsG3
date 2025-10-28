document.addEventListener("DOMContentLoaded", () => {
  const toastEl = document.getElementById("reservaToast");
  const toast = new bootstrap.Toast(toastEl);

  document.querySelectorAll(".reservar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      toast.show();
    });
  });
});