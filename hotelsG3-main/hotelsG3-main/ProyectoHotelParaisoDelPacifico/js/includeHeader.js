
document.addEventListener("DOMContentLoaded", async () => {

  const headerContainer = document.createElement("div");
  document.body.prepend(headerContainer);

  try {
    const headerResponse = await fetch("components/header.html");
    headerContainer.innerHTML = await headerResponse.text();
  } catch (error) {
    console.error("Error al cargar el header:", error);
  }

  const footerContainer = document.createElement("div");
  document.body.appendChild(footerContainer);

  try {
    const footerResponse = await fetch("components/footer.html");
    footerContainer.innerHTML = await footerResponse.text();
  } catch (error) {
    console.error("Error al cargar el footer:", error);
  }

  actualizarEstadoUsuario();
});
