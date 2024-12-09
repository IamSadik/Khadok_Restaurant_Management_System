// public/js/login_script.js
const container = document.getElementById('container');
const registerBtn = document.getElementById('register'); // Matches the "Stakeholder" button
const loginBtn = document.getElementById('login'); // Matches the "Go Back" button
const stakeholderForm = document.querySelector('.sign-up'); // Matches the Stakeholder form container
const riderForm = document.querySelector('.rider-container'); // Matches the Rider form container

// Show Stakeholder form and hide Rider form
registerBtn.addEventListener('click', () => {
    stakeholderForm.style.display = 'block';
    
    container.classList.add("active");
});



// Go back to the original form
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});



