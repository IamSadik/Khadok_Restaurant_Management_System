window.onload = async () => {
    await loadPageData(); // Run both fetch functions in parallel
};
async function loadPageData() {
    const stakeholderId = localStorage.getItem("selectedRestaurantId");
    const consumerId = localStorage.getItem('consumer_id');

    if (!stakeholderId) {
        alert("No restaurant selected!");
        return;
    }

    if (!consumerId) {
        console.error('Consumer ID not found in localStorage');
        return;
    }

    try {
        // Fetch data simultaneously
        const [locationData, consumerData] = await Promise.all([
            fetchStakeholderLocation(stakeholderId),
            fetchConsumerDetails(consumerId),
            fetchCartItems(consumerId)
        ]);

        // Display data
        displayLocation(locationData);

        if (consumerData && consumerData.success) {
            document.getElementById('consumer-name').textContent = consumerData.consumer.name;
            document.getElementById('consumer-email').textContent = consumerData.consumer.email;
            document.getElementById('consumer-phone').textContent = consumerData.consumer.phone_number;
        } else {
            console.error('Failed to fetch consumer details');
        }
    } catch (error) {
        console.error('Error loading page data:', error);
    }
}
async function fetchStakeholderLocation(stakeholderId) {
    try {
        const response = await fetch(`/api/stakeholder/get-stakeholder-location/${stakeholderId}`);
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error("Failed to fetch location data:", data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching location data:", error);
        return null;
    }
}

function displayLocation(locationData) {
    const locationDetails = document.getElementById('locationDetails');

    if (locationData) {
        locationDetails.innerHTML = `
            <p><strong>Area:</strong> ${locationData.area}</p>
            <p><strong>Address:</strong> ${locationData.address}</p>
        `;
    } else {
        locationDetails.innerHTML = `<p>No location data found.</p>`;
    }
}

async function fetchConsumerDetails(consumerId) {
    console.log(`Consumer ID: ${consumerId}`);  // Debug log

    try {
        const response = await fetch(`/consumer/details/${consumerId}`);
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            console.error('Failed to fetch consumer details:', data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching consumer details:', error);
        return null;
    }
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



document.getElementById('place-pickup-btn').addEventListener('click', async () => {
    const consumerId = localStorage.getItem('consumer_id');
    const stakeholderId = localStorage.getItem('selectedRestaurantId');
    const totalAmount = document.getElementById('cart-subtotal').textContent;

    if (!consumerId || !stakeholderId || totalAmount === "0.00") {
        alert("Invalid details or empty cart. Please check your order.");
        return;
    }

    const requestData = {
        consumer_id: consumerId,
        total_amount: parseFloat(totalAmount),
        stakeholder_id: stakeholderId
    };

    try {
        const response = await fetch('/api/order/pickup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
            alert("Pick-up order placed successfully!");
            localStorage.removeItem('cart');  // Clear cart from localStorage if needed
            window.location.href = 'menu.html';  // Redirect to confirmation page
        } else {
            throw new Error(responseData.message || 'Failed to place pick-up order.');
        }
    } catch (error) {
        console.error('Error placing pick-up order:', error);
        alert('Error processing your request. Please try again.');
    }
});