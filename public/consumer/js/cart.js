document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartPopup = document.getElementById('cart-popup');
    const cartItemsContainer = document.getElementById('cart-items');
    

    // Toggle cart popup
    cartIcon.addEventListener('click', () => {
        cartPopup.classList.toggle('show');
        if (cartPopup.classList.contains('show')) {
            fetchCartItems();
        }
    });

    // Fetch cart items from API
    async function fetchCartItems() {
        try {
            const response = await fetch(`/cart/${consumerId}`);
            const cartItems = await response.json();

            cartItemsContainer.innerHTML = ''; // Clear previous items

            if (cartItems.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
                return;
            }

            cartItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="item-details">
                        <p class="item-name">${item.item_name}</p>
                        <div class="quantity-controls">
                            <button class="minus-btn" data-id="${item.id}">-</button>
                            <input type="text" class="quantity" value="${item.quantity}" readonly>
                            <button class="plus-btn" data-id="${item.id}">+</button>
                        </div>
                        <p class="item-price">৳${item.item_price * item.quantity}</p>
                        <button class="delete-btn" data-id="${item.id}">&times;</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });

            addEventListeners();
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }

    // Handle quantity increase and decrease
    function addEventListeners() {
        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const itemId = e.target.getAttribute('data-id');
                updateQuantity(itemId, 1);
            });
        });

        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const itemId = e.target.getAttribute('data-id');
                const quantityInput = e.target.nextElementSibling;
                if (parseInt(quantityInput.value) > 1) {
                    updateQuantity(itemId, -1);
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const itemId = e.target.getAttribute('data-id');
                deleteCartItem(itemId);
            });
        });
    }

    // Update item quantity
    async function updateQuantity(itemId, change) {
        try {
            await fetch(`/cart/update/${itemId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ change })
            });
            fetchCartItems(); // Refresh cart items
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    }

    // Delete cart item
    async function deleteCartItem(itemId) {
        try {
            await fetch(`/cart/delete/${itemId}`, { method: 'DELETE' });
            fetchCartItems(); // Refresh cart items
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }
});
