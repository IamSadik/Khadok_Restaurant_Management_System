const toggleBtn = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');

// Default collapsed state
sidebar.classList.add('collapsed');
mainContent.classList.add('collapsed');

toggleBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
        sidebar.classList.add('expanded');
        mainContent.classList.remove('collapsed');
        mainContent.classList.add('expanded');
    } else {
        sidebar.classList.remove('expanded');
        sidebar.classList.add('collapsed');
        mainContent.classList.remove('expanded');
        mainContent.classList.add('collapsed');
    }
});
