document.addEventListener('DOMContentLoaded', () => {
    const stakeholderId = 1; // Example stakeholder ID
    const menuList = document.getElementById('menu-list');
    const menuForm = document.getElementById('menu-form');

    // Fetch and display existing menu items
    const fetchMenu = async () => {
        const response = await fetch(`/api/menu?stakeholder_id=${stakeholderId}`);
        const menuItems = await response.json();

        menuList.innerHTML = menuItems
            .map(item => `<li>${item.item_name} - $${item.item_price}</li>`)
            .join('');
    };

    // Add a new menu item
    menuForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(menuForm);
        formData.append('stakeholder_id', stakeholderId);

        await fetch('/api/menu', {
            method: 'POST',
            body: formData,
        });

        menuForm.reset();
        fetchMenu();
    });

    fetchMenu();
});
