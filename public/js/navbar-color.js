const navbar = document.querySelector('header nav ul');
const navbarLinks = document.querySelectorAll('header nav ul li a');

// Function to get the pixel color behind the navbar
function getPixelColorUnderNavbar() {
    const image = document.querySelector('img'); // Ensure correct selector
    if (!image || !(image instanceof HTMLImageElement)) {
        console.error('Invalid image for CanvasRenderingContext2D');
        return;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0); // Safe to execute
}


// Adjust navbar text color dynamically
function adjustNavbarColor() {
    const [r, g, b] = getPixelColorUnderNavbar();
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    const textColor = brightness > 125 ? 'black' : 'white';

    // Apply the color to the navbar links
    navbarLinks.forEach(link => {
        link.style.transition = 'color 0.5s ease'; // Smooth transition
        link.style.color = textColor;
    });
}

// Listen for scroll events
window.addEventListener('scroll', adjustNavbarColor);

// Adjust color on initial page load
adjustNavbarColor();
