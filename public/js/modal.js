document.addEventListener("DOMContentLoaded", () => {
    const openModalButtons = document.querySelectorAll(".open-modal");
    const closeModalButtons = document.querySelectorAll(".close-modal");
    const modals = document.querySelectorAll(".modal");

    // Open modal logic
    openModalButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-modal");
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = "flex";
            }
        });
    });

    // Close modal logic
    closeModalButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal");
            if (modal) {
                modal.style.display = "none";
            }
        });
    });

    // Close modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
        modals.forEach((modal) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    });
});

// Function to display the success popup
function showSuccessPopup() {
    const successPopup = document.getElementById("successPopup");
    if (successPopup) {
        successPopup.style.display = "flex";

        // Close the popup and active modal automatically after 3 seconds
        setTimeout(() => {
            successPopup.style.display = "none";

            // Close the active modal if it exists
            const activeModal = document.querySelector(".modal[style='display: flex;']");
            if (activeModal) {
                activeModal.style.display = "none";
            }
        }, 3000);
    }
}

// Modify the form submission handling script
document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll(".modal form");

    forms.forEach((form) => {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission behavior

            const formData = new FormData(this);

            fetch(this.getAttribute("action") || "consumer_signup.php", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.text())
                .then((data) => {
                    if (data.includes("Sign-up successful")) {
                        showSuccessPopup(); // Show the success popup
                        this.reset(); // Clear form inputs
                    } else {
                        alert("Sign-up failed. Please try again."); // Error handling
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("An unexpected error occurred. Please try again.");
                });
        });
    });
});
