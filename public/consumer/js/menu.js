 // Function to fetch the logged-in consumer's ID from session
 const getConsumerId = async () => {
    try {
        const response = await fetch('/auth/consumer-id', {
            credentials: 'include' // Ensures cookies are sent with the request
        });
        if (!response.ok) throw new Error('Failed to fetch consumer ID');

        const data = await response.json();
        console.log("Fetched consumer ID:", data.consumer_id);
        return data.consumer_id;
    } catch (error) {
        console.error('Error fetching consumer ID:', error);
        return null;
    }
};
async function fetchConsumerId() {
    try {
        const response = await fetch('/auth/consumer-id'); // Updated to use session
        const data = await response.json();

        if (data.success) {
            console.log('Logged-in consumer ID:', data.consumer_id);
        } else {
            console.error('Error fetching consumer ID:', data.message);
        }
    } catch (error) {
        console.error('Error fetching consumer ID:', error);
    }
}


// Fetch all menu items for the selected restaurant
const fetchMenuItems = async () => {
   

    try {
        const response = await fetch(`/api/menu?stakeholder_id=${restaurantId}`);
        const menuItems = await response.json();
        displayMenuItems(menuItems);
    } catch (error) {
        console.error('Error fetching menu items:', error);
    }
};
// Function to fetch categories and display them as filter buttons
async function fetchCategories(restaurantId) {
    try {
        const response = await fetch(`/menu/categories/${restaurantId}`);
        const data = await response.json();

        if (data.success) {
            const filtersContainer = document.getElementById('category-filters');
            filtersContainer.innerHTML = ''; // Clear existing buttons
            

            // Add "All" button first
            const allButton = document.createElement('button');
            allButton.textContent = 'All';
            allButton.addEventListener('click', () => location.reload()); // Refresh the whole page
            filtersContainer.appendChild(allButton);

            // Sort categories alphabetically (case-insensitive)
            const sortedCategories = data.categories.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

            // Create buttons for each category
            sortedCategories.forEach(category => {
               
                const button = document.createElement('button');
                button.textContent = category;
                button.addEventListener('click', () => filterMenuByCategory(category,restaurantId));
                filtersContainer.appendChild(button);
            });
        } else {
            console.error('No categories found or invalid data format.');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}


// Fetch menu items by category for the selected restaurant
async function filterMenuByCategory(category, restaurantId) {
    try {
        const response = await fetch(`/menu/items/${restaurantId}/${category}`);
        const data = await response.json();

        if (data.success) {
            menuItemsContainer.innerHTML = ''; // Clear the current menu items

            if (data.menuItems.length === 0) {
                menuItemsContainer.innerHTML = '<p>No menu items available in this category</p>';
                return;
            }

            data.menuItems.forEach((item) => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('menu-item');
                itemDiv.innerHTML = `
                    <div class="menu-item-image" style="background-image: url('/uploads/${item.item_picture}');">
                        <div class="menu-item-description">${item.description}</div>
                    </div>
                    <div class="menu-item-details">
                        <h3>${item.item_name}</h3>
                        <p>Category: ${item.category}</p>
                        <p>Price: $${item.item_price}</p>
                    </div>
                `;
                menuItemsContainer.appendChild(itemDiv);
            });
        } else {
            menuItemsContainer.innerHTML = '<p>Failed to fetch items for this category</p>';
        }
    } catch (error) {
        console.error('Error filtering menu:', error);
        menuItemsContainer.innerHTML = '<p>Error fetching menu items. Please try again later.</p>';
    }
}



// Display menu items in the UI
function displayMenuItems(menuItems) {
    const menuItemsContainer = document.getElementById('menu-items-container');
    menuItemsContainer.innerHTML = ''; // Clear the current menu items

    if (menuItems.length === 0) {
        menuItemsContainer.innerHTML = '<p>No menu items available</p>';
        return;
    }

    menuItems.forEach((item) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('menu-item');
        itemDiv.innerHTML = `
            <div class="menu-item-image" style="background-image: url('/uploads/${item.item_picture}');">
                <div class="menu-item-description">${item.description}</div>
            </div>
            <div class="menu-item-details">
                <h3>${item.item_name}</h3>
                <p>Category: ${item.category}</p>
                <p>Price: $${item.item_price}</p>
                <p hidden> ${item.menu_id}</p>
                <i class="fas fa-plus-circle add-to-cart" 
                   style="cursor:pointer; font-size: 24px; color: green;"
                   onclick="addItemToCart(${item.menu_id}, '${item.item_name}', ${restaurantId}, ${item.item_price})"
>
                </i>
            </div>
        `;
        menuItemsContainer.appendChild(itemDiv);
    });

}
// Function to add item to cart
async function addItemToCart(itemId, itemName, restaurantId, itemPrice) {
    try {
        const response = await fetch(`/consumer/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                item_id: itemId,
                item_name: itemName,
                stakeholder_id: restaurantId,
                item_price: itemPrice
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            alert('Item added to cart successfully!');
            location.reload();
        } else {
            alert('Failed to add item to cart: ' + data.message);
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        alert('An error occurred. Please try again later.');
    }
}



// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    const restaurantId = localStorage.getItem("selectedRestaurantId");
    
    if (!restaurantId) {
        console.error('No stakeholder_id found in localStorage');
        return;
    }

    
    fetchMenuItems(restaurantId);
    fetchCategories(restaurantId);
    fetchConsumerId();
   

   
});

const restaurantNameElement = document.getElementById("restaurantName");
const restaurantId = localStorage.getItem("selectedRestaurantId");
const restaurantName = localStorage.getItem("selectedRestaurantName");
const consumerId = localStorage.getItem("consumer_id");
 // Menu Items Horizontal Scroll
 const menuLeftBtn = document.getElementById('menu-scroll-left');
 const menuRightBtn = document.getElementById('menu-scroll-right');
 const menuItemsContainer = document.getElementById('menu-items-container');
 menuLeftBtn.addEventListener('click', () => {
     menuItemsContainer.scrollBy({ left: -300, behavior: 'smooth' });
 });
 menuRightBtn.addEventListener('click', () => {
     menuItemsContainer.scrollBy({ left: 300, behavior: 'smooth' });
 });





 //cart section
 document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartPopup = document.getElementById('cart-popup');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');

    // Toggle cart popup
    cartIcon.addEventListener('click', () => {
        cartPopup.classList.toggle('show');  // Ensure CSS matches this class
        if (cartPopup.classList.contains('show')) {
            fetchCartItems();
        }
    });
    const socket = io();

    // Automatically fetch cart items when the page loads
    fetchCartItems();
    async function fetchCartItems() {
        try {
            const response = await fetch(`/consumer/cart/${consumerId}`);
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
    
            const responseData = await response.json();
            
    
            // Extract the array from the response object
            if (!responseData.success || !Array.isArray(responseData.data)) {
                throw new Error("Invalid response format: Expected an array under 'data' key");
            }
    
            const cartItems = responseData.data; // Extract actual cart items
    
            cartItemsContainer.innerHTML = ''; // Clear previous items
    
            if (cartItems.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
                cartCount.textContent = '0';
                return;
            }
    
            cartItems.forEach(item => {
                const itemElement = document.createElement('li');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="item-details">
                        <p class="item-name">${item.item_name}</p>
                        <div class="quantity-controls">
                            <button class="minus-btn" data-id="${item.item_id}">-</button>
                            <input type="text" class="quantity" value="${item.quantity}" readonly>
                            <button class="plus-btn" data-id="${item.item_id}">+</button>
                        </div>
                        <p class="item-price">$${item.item_price * item.quantity}</p>
                    </div>
                    <button class="delete-btn" data-id="${item.item_id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
          
            
            updateCartCount(cartItems);
    
            addEventListeners();
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }
    // Listen for real-time cart updates
    socket.on(`cart-update-${consumerId}`, (data) => {
        cartCount.textContent = data.cartCount;
    });
    
    

    // Add event listeners for dynamic buttons
   
    function addEventListeners() {
        const cartItemsContainer = document.getElementById('cart-items');

        // Remove any existing event listener to prevent duplicate bindings
        cartItemsContainer.removeEventListener('click', handleCartClick);
        cartItemsContainer.addEventListener('click', handleCartClick);
    }

    // Handle cart item button clicks
    function handleCartClick(e) {
        let button = e.target;

        // Ensure we're getting the correct button element (handle clicks on inner elements like icons)
        if (!button.matches('button')) {
            button = button.closest('button');  
        }

        if (!button) return;  // Ensure a button was clicked

        const itemId = button.getAttribute('data-id');  // Get data-id correctly

        if (!itemId || itemId === "undefined") {
            console.error('Error: itemId is undefined or invalid', itemId);
            return;
        }

        if (button.classList.contains('plus-btn')) {
            updateItemQuantity(itemId, 1);  // Increase by 1
        } 
        else if (button.classList.contains('minus-btn')) {
            updateItemQuantity(itemId, -1);  // Decrease by 1
        } 
        else if (button.classList.contains('delete-btn')) {
            deleteCartItem(itemId);
        }
    }

    // Update item quantity
    async function updateItemQuantity(itemId, change) {
        if (!itemId || itemId === "undefined") {
            console.error('Error: itemId is undefined or invalid', itemId);
            return;
        }
        try {
            console.log(`Updating item: ${itemId} with change: ${change}`);
            const response = await fetch(`/consumer/cart/update/${itemId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ change: parseInt(change, 10) })  // Ensure integer value
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            fetchCartItems(); // Refresh cart items
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    }

    
    
    // Delete cart item
    async function deleteCartItem(itemId) {
        try {
            await fetch(`/consumer/cart/delete/${itemId}`, { method: 'DELETE' });
            fetchCartItems(); // Refresh cart items
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }
   // Update the cart item count in the cart icon
    function updateCartCount(cartItems) {
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = totalCount;
    }


});











document.addEventListener('DOMContentLoaded', function () {
    const checkoutDeliveryBtn = document.getElementById('checkout-delivery-btn');
    const checkoutPickupBtn = document.getElementById('checkout-pickup-btn');
    const cartItemsContainer = document.getElementById('cart-items');

    // Function to check if the cart is empty
    function updateCheckoutButtons() {
        const cartItems = cartItemsContainer.children;
        if (cartItems.length === 0) {
            checkoutDeliveryBtn.onclick = () => alert('Add items to cart first');
            checkoutPickupBtn.onclick = () => alert('Add items to cart first');
            checkoutDeliveryBtn.classList.add('disabled');
            checkoutPickupBtn.classList.add('disabled');
        } else {
            checkoutDeliveryBtn.onclick = () => window.location.href = 'delivery.html';
            checkoutPickupBtn.onclick = () => window.location.href = 'pickup.html';
            checkoutDeliveryBtn.classList.remove('disabled');
            checkoutPickupBtn.classList.remove('disabled');
        }
    }

    // Observe cart changes dynamically
    const observer = new MutationObserver(updateCheckoutButtons);
    observer.observe(cartItemsContainer, { childList: true });

    // Initial button check
    updateCheckoutButtons();
});
