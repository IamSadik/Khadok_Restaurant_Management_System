// menu.js

document.addEventListener("DOMContentLoaded", function () {
    const menuItemsContainer = document.getElementById("menu-items-container");
    const menuForm = document.getElementById("menu-form");
    const menuIdInput = document.getElementById("menu-id");
    const formTitle = document.getElementById("form-title");

    // Function to fetch the logged-in stakeholder's ID from session
    const getStakeholderId = async () => {
        try {
            const response = await fetch('/auth/stakeholder-id', {
                credentials: 'include' // Ensures cookies are sent with the request
            });
            if (!response.ok) throw new Error('Failed to fetch stakeholder ID');
    
            const data = await response.json();
            console.log("Fetched stakeholder ID:", data.stakeholder_id);
            return data.stakeholder_id;
        } catch (error) {
            console.error('Error fetching stakeholder ID:', error);
            return null;
        }
    };


    // Function to fetch the menu items for the logged-in stakeholder
    const fetchMenuItems = async () => {
        const stakeholderId = await getStakeholderId();
        if (!stakeholderId) return;

        try {
            const response = await fetch(`/api/menu?stakeholder_id=${stakeholderId}`);
            const menuItems = await response.json();
            displayMenuItems(menuItems);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    // Function to display the menu items in the UI
    const displayMenuItems = (menuItems) => {
        menuItemsContainer.innerHTML = ''; // Clear the current menu items

        if (menuItems.length === 0) {
            menuItemsContainer.innerHTML = '<p>No menu items available</p>';
            return;
        }

        menuItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('menu-item');
            itemDiv.innerHTML = `
                <h3>${item.item_name}</h3>
                <p>Category: ${item.category}</p>
                <p>Price: $${item.item_price}</p>
                <p>Description: ${item.description}</p>
                <img src="/uploads/${item.item_picture}" alt="${item.item_name}" width="100">
                <button onclick="deleteMenuItem(${item.menu_id})">Delete</button>
                <button onclick="editMenuItem(${item.menu_id}, '${item.item_name}', '${item.category}', ${item.item_price}, '${item.description}', '${item.item_picture}')">Edit</button>
            `;
            menuItemsContainer.appendChild(itemDiv);
        });
    };

    // Function to delete a menu item
    const deleteMenuItem = async (menuId) => {
        try {
            const response = await fetch(`/api/menu/${menuId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            alert(data.message);
            fetchMenuItems(); // Refresh the menu list
        } catch (error) {
            console.error('Error deleting menu item:', error);
        }
    };

    // Function to edit a menu item
    const editMenuItem = (menuId, itemName, category, price, description, itemPicture) => {
        menuIdInput.value = menuId;
        document.getElementById("item-name").value = itemName;
        document.getElementById("category").value = category;
        document.getElementById("price").value = price;
        document.getElementById("description").value = description;
        formTitle.innerText = 'Edit Menu Item';
    };

    

// Function to handle adding or updating a menu item
menuForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        // Fetch stakeholder ID directly
        const stakeholderResponse = await fetch('/auth/stakeholder-id');
        if (!stakeholderResponse.ok) {
            throw new Error('Failed to fetch stakeholder ID');
        }

        const stakeholderData = await stakeholderResponse.json();
        const stakeholderId = stakeholderData.stakeholder_id;

        if (!stakeholderId) {
            alert('Stakeholder ID not found. Please try again.');
            return;
        }

        const formData = new FormData(menuForm);
        formData.append('stakeholder_id', stakeholderId); // Append stakeholder_id to form data

        const menuId = menuIdInput.value;

        let response;
        if (menuId) {
            // Update menu item
            response = await fetch(`/api/menu/${menuId}`, {
                method: 'PUT',
                body: formData
            });
        } else {
            // Add new menu item
            response = await fetch('/api/menu', {
                method: 'POST',
                body: formData
            });
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to save menu item');
        }

        alert(data.message);
        fetchMenuItems(); // Refresh the menu list
        menuForm.reset(); // Reset the form
        menuIdInput.value = ''; // Clear the menu ID
        formTitle.innerText = 'Add New Menu Item'; // Reset form title
    } catch (error) {
        console.error('Error saving menu item:', error);
        alert('Error: ' + error.message);
    }
});

    

    // Initial fetch of the menu items
    fetchMenuItems();
});


