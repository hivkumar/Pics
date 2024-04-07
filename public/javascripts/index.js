
// name fading
const element = document.querySelector('.textcover h1');

// Set initial opacity to 0
gsap.set(element, { opacity: 0 });

// Create a fade in animation
gsap.to(element, { opacity: 1, duration: 2, delay: 1 });


const elemen = document.querySelectorAll('.textcover p');

// Set initial opacity to 0
gsap.set(elemen, { opacity: 0 });

// Create a fade in animation
gsap.to(elemen, { opacity: 1, duration: 1, delay: 2 });

// login sliding

const elem = document.querySelector('.login');

// Set initial position
gsap.set(elem, { x: 1000 });

// Create a slide in animation
gsap.to(elem, { x: 0, duration: 1, ease: "power4.out", delay: 1 });