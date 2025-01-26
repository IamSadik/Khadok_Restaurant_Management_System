
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
