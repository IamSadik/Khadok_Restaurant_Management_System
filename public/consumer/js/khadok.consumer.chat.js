document.addEventListener("DOMContentLoaded", () => {
    const contacts = [
        { id: 1, name: "Rider John", type: "rider", avatar: "../images/default-user.png" },
        { id: 2, name: "Stakeholder Jane", type: "stakeholder", avatar: "../images/default-user.png" },
    ];

    const contactList = document.querySelector(".chat-contacts");
    const chatMessages = document.getElementById("chat-messages");
    const contactName = document.getElementById("contact-name");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-btn");
    const hideChatBtn = document.getElementById('hide-chat');
    const chatPlaceholderIcon = document.getElementById('chat-placeholder-icon');
    const chatMain = document.querySelector('.chat-main');
    const contactButtons = document.querySelectorAll('.chat-contact');  // Assuming these are your contact buttons

    // Hide Chat functionality
    hideChatBtn.addEventListener('click', () => {
        chatMain.classList.remove('active');
        chatPlaceholderIcon.classList.add('visible');
    });

    // Show chat on clicking placeholder icon
    chatPlaceholderIcon.addEventListener('click', () => {
        chatMain.classList.add('active');
        chatPlaceholderIcon.classList.remove('visible');
    });

    // Hide icon when a contact is clicked
    contactButtons.forEach(contact => {
        contact.addEventListener('click', () => {
            // Hide the placeholder icon when a contact is selected
            chatPlaceholderIcon.classList.remove('visible');
        });
    });



    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    
            // Add active class to the clicked button
            this.classList.add('active');
        });
    });
    
    document.querySelectorAll('.contact').forEach((contact) => {
        contact.addEventListener('click', function () {
            // Hide all chat panels before showing the selected one
            const chatPanels = document.querySelectorAll('.chat-panel');
            chatPanels.forEach((panel) => panel.classList.remove('active'));
    
            // Display the chat panel associated with the selected contact
            const targetPanelId = this.getAttribute('data-target');
            const targetPanel = document.getElementById(targetPanelId);
    
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
    function loadContacts(type) {
        contactList.innerHTML = "";
        contacts
            .filter((contact) => contact.type === type)
            .forEach((contact) => {
                const contactItem = document.createElement("div");
                contactItem.classList.add("chat-contact");
                contactItem.innerHTML = `
                    <img src="${contact.avatar}" alt="Avatar">
                    <span>${contact.name}</span>
                `;
                contactItem.addEventListener("click", () => loadChat(contact));
                contactList.appendChild(contactItem);
            });
    }

    function loadChat(contact) {
        contactName.textContent = contact.name;
        chatMessages.innerHTML = "";
        messageInput.disabled = false;
        sendButton.disabled = false;
    }

    // Initial load
    document.getElementById("rider-filter").addEventListener("click", () => loadContacts("rider"));
    document.getElementById("stakeholder-filter").addEventListener("click", () => loadContacts("stakeholder"));
    loadContacts("rider");
});
