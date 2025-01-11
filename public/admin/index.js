const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
})


Orders.forEach(order => {
    const tr = document.createElement('tr');
    const trContent = `
        <td>${order.productName}</td>
        <td>${order.productNumber}</td>
        <td>${order.paymentStatus}</td>
        <td class="${order.status === 'Declined' ? 'danger' : order.status === 'Pending' ? 'warning' : 'primary'}">${order.status}</td>
        <td class="primary">Details</td>
    `;
    tr.innerHTML = trContent;
    document.querySelector('table tbody').appendChild(tr);
});
document.getElementById("category").addEventListener("change", function () {
    const selectedCategory = this.value;
    console.log("Selected Category:", selectedCategory);
  
    // You can add logic here to dynamically show/hide fields based on the selected category.
    if (selectedCategory === "rating") {
      alert("You selected Rating!");
    } else if (selectedCategory === "name") {
      alert("You selected Name!");
    } else if (selectedCategory === "restaurantName") {
      alert("You selected Restaurant Name!");
    }
  });
  document.getElementById("profile-id").textContent = "New Stakeholder ID";
document.getElementById("profile-name").textContent = "New Name";
document.getElementById("profile-email").textContent = "new.email@example.com";
document.getElementById("profile-restaurant").textContent = "New Restaurant";
document.getElementById("profile-ratings").textContent = "4 Stars";
document.getElementById("profile-area").textContent = "New Area";
