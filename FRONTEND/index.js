let slides = document.querySelectorAll(".slide");
let dotsContainer = document.querySelector(".dots");
let index = 0;
let interval;
// Crear puntos
slides.forEach((_, i) => {
  let dot = document.createElement("span");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => {
    index = i;
    showSlide(index);
    resetInterval();
  });
  dotsContainer.appendChild(dot);
});
let dots = document.querySelectorAll(".dot");
function showSlide(i) {
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));
  slides[i].classList.add("active");
  dots[i].classList.add("active");
}
function nextSlide() {
  index = (index + 1) % slides.length;
  showSlide(index);
}
function prevSlide() {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
}
function resetInterval() {
  clearInterval(interval);
  interval = setInterval(nextSlide, 5000);
}
document.querySelector(".right").addEventListener("click", () => {
  nextSlide();
  resetInterval();
});
document.querySelector(".left").addEventListener("click", () => {
  prevSlide();
  resetInterval();
});
// autoplay
interval = setInterval(nextSlide, 5000);
// Modal
const modal = document.getElementById("modal-registro");
// Obtener la colección de todos los enlaces con la clase 'modal'
const enlaces = document.querySelectorAll(".Modal");
// Obtener el elemento que cierra el modal
const span = document.getElementsByClassName("close")[0];
// Recorrer la colección de enlaces y agregar un evento 'onclick' a cada uno
enlaces.forEach(function(enlace) {
  enlace.onclick = function(event) {
    // Previene el comportamiento por defecto del enlace (evita que recargue la página)
    event.preventDefault();
    modal.style.display = "block";
  }
});
// Cuando el usuario hace clic en <span> (x), cerrar el modal
span.onclick = function() {
  modal.style.display = "none";
}
// Cuando el usuario hace clic fuera del modal, cerrarlo
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}