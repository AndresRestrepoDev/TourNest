let slides = document.querySelectorAll(".slide");
let dotsContainer = document.querySelector(".dots");
let index = 0;
let interval;

// Create dots for the slider
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

// Show the selected slide and update dots
function showSlide(i) {
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));
  slides[i].classList.add("active");
  dots[i].classList.add("active");
}

// Show next slide
function nextSlide() {
  index = (index + 1) % slides.length;
  showSlide(index);
}

// Show previous slide
function prevSlide() {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
}

// Reset autoplay interval
function resetInterval() {
  clearInterval(interval);
  interval = setInterval(nextSlide, 5000);
}

// Next button event
document.querySelector(".right").addEventListener("click", () => {
  nextSlide();
  resetInterval();
});

// Previous button event
document.querySelector(".left").addEventListener("click", () => {
  prevSlide();
  resetInterval();
});

// Autoplay
interval = setInterval(nextSlide, 5000);

// Modal
const modal = document.getElementById("modal-registro");

// Get all links with the class 'Modal'
const enlaces = document.querySelectorAll(".Modal");

// Get the element that closes the modal
const span = document.getElementsByClassName("close")[0];

// Add click event to each link to open the modal
enlaces.forEach(function(enlace) {
  enlace.onclick = function(event) {
    // Prevent default link behavior (avoid page reload)
    event.preventDefault();
    modal.style.display = "block";
  }
});

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks outside the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}