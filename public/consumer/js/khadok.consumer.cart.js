// Toggle checkout panel
function toggleCheckout() {
    const checkoutPanel = document.getElementById("checkoutPanel");
    checkoutPanel.classList.toggle("active");
}

async function fetchCartItems(consumerId) {
    try {
        const response = await fetch(`/consumer/cart/${consumerId}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();

        if (!responseData.success || !Array.isArray(responseData.data)) {
            throw new Error("Invalid response format: Expected an array under 'data' key");
        }

        const cartItems = responseData.data; // Extract cart items
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = ''; // Clear previous items

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            document.getElementById('cart-count').textContent = '0';
            document.getElementById('cart-subtotal').textContent = '0.00';
            return;
        }

        let subtotal = 0;

        cartItems.forEach(item => {
            const itemPrice = item.item_price * item.quantity;
            subtotal += itemPrice;

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
                    <p class="item-price">$${itemPrice.toFixed(2)}</p>
                </div>
                <button class="delete-btn" data-id="${item.item_id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
        updateCartCount(cartItems);
        addEventListeners();
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
}

function addEventListeners() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.removeEventListener('click', handleCartClick);
    cartItemsContainer.addEventListener('click', handleCartClick);
}

function handleCartClick(e) {
    let button = e.target.closest('button');

    if (!button) return;

    const itemId = button.getAttribute('data-id');

    if (button.classList.contains('plus-btn')) {
        updateItemQuantity(itemId, 1);
    } else if (button.classList.contains('minus-btn')) {
        updateItemQuantity(itemId, -1);
    } else if (button.classList.contains('delete-btn')) {
        deleteCartItem(itemId);
    }
}

async function updateItemQuantity(itemId, change) {
    try {
        await fetch(`/consumer/cart/update/${itemId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ change })
        });
        fetchCartItems(localStorage.getItem('consumer_id'));
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

async function deleteCartItem(itemId) {
    try {
        await fetch(`/consumer/cart/delete/${itemId}`, { method: 'DELETE' });
        fetchCartItems(localStorage.getItem('consumer_id'));
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

function updateCartCount(cartItems) {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalCount;
}


