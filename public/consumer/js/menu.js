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
            console.log("Filters container found:", filtersContainer);

            // Add "All" button first
            const allButton = document.createElement('button');
            allButton.textContent = 'All';
            allButton.addEventListener('click', () => location.reload()); // Refresh the whole page
            filtersContainer.appendChild(allButton);

            // Sort categories alphabetically (case-insensitive)
            const sortedCategories = data.categories.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

            // Create buttons for each category
            sortedCategories.forEach(category => {
                console.log('Adding category:', category);  // Debugging
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
                <i class="fas fa-plus-circle add-to-cart" 
                   style="cursor:pointer; font-size: 24px; color: green;"
                   onclick="addItemToCart(${item.item_id}, '${item.item_name}', ${restaurantId})">
                </i>
            </div>
        `;
        menuItemsContainer.appendChild(itemDiv);
    });
}
// Function to add item to cart
async function addItemToCart(itemId, itemName, restaurantId) {
    try {
        const response = await fetch(`/consumer/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                item_id: itemId,
                item_name: itemName,
                stakeholder_id: restaurantId
            })
        });

        const data = await response.json();
        if (data.success) {
            alert('Item added to cart successfully!');
        } else {
            alert('Failed to add item to cart.');
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
   
});

const restaurantNameElement = document.getElementById("restaurantName");
const restaurantId = localStorage.getItem("selectedRestaurantId");
const restaurantName = localStorage.getItem("selectedRestaurantName");
console.log(restaurantId);
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