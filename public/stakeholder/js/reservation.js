document.addEventListener("DOMContentLoaded", async function () {
    // Load all reservations initially
    fetchReservations("all");

    // Filter button event listeners
    document.getElementById("all-reservation-filter").addEventListener("click", () => fetchReservations("all"));
    document.getElementById("upcoming-reservation-filter").addEventListener("click", () => fetchReservations("upcoming"));
    document.getElementById("past-reservation-filter").addEventListener("click", () => fetchReservations("past"));

    // Function to handle the filter button click and toggle active state
function handleFilterButtonClick(e) {
    // Get all filter buttons
    const filterButtons = document.querySelectorAll(".reservation-filter-btn");

    // Remove the 'active' class from all buttons
    filterButtons.forEach(button => {
        button.classList.remove("active");
    });

    // Add the 'active' class to the clicked button
    e.target.classList.add("active");

    // Fetch and display reservations based on the selected filter
    fetchReservations(e.target.dataset.filter);
}

// Fetch reservations based on the filter type
async function fetchReservations(filterType = "all") {
    try {
        const response = await fetch(`/api/order/reservations?filter=${filterType}`);
        const reservations = await response.json();

        const reservationList = document.getElementById("reservation-list");
        reservationList.innerHTML = "";

        if (reservations.length === 0) {
            reservationList.innerHTML = "<p>No reservations found.</p>";
            return;
        }

        reservations.forEach(res => {
            const reservationItem = document.createElement("div");
            reservationItem.classList.add("reservation-item");
            reservationItem.innerHTML = `
                <div class="reservation-summary">
                    <h4>${res.message}</h4>
                    <p><i class="fas fa-calendar"></i> ${res.booking_date} at <i class="fas fa-clock"></i> ${res.booking_time}</p>
                    <p>Status: <span class="${res.status.toLowerCase()}">${res.status}</span></p>
                    ${res.status.toLowerCase() === "pending" ? 
                        `<button class="change-complete-btn" data-id="${res.dine_in_id}"><i class="fas fa-check-circle"></i> Change to Complete</button>` : ''}
                </div>
            `;

            reservationItem.addEventListener("click", () => showReservationDetails(res));
            reservationList.appendChild(reservationItem);

            // Add event listener for the "Change to Complete" button
            const changeBtn = reservationItem.querySelector(".change-complete-btn");
            if (changeBtn) {
                changeBtn.addEventListener("click", async (e) => {
                    e.stopPropagation();
                    const dineInId = e.target.getAttribute("data-id");

                    // Call the function to change the status and update the availability
                    await changeReservationToComplete(dineInId, res);
                });
            }
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
    }
}

// Set up event listeners for filter buttons
document.querySelectorAll(".reservation-filter-btn").forEach(button => {
    button.addEventListener("click", handleFilterButtonClick);
});

// Initially trigger the fetch with "all" filter when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const defaultFilterButton = document.querySelector(".reservation-filter-btn[data-filter='all']");
    if (defaultFilterButton) {
        defaultFilterButton.classList.add("active");
        fetchReservations("all");
    }
});

async function changeReservationToComplete(dineInId, reservation) {
    try {
        const stakeholderId = await getStakeholderId();  // Get the stakeholder ID
        
        // Ensure consumer_id exists in localStorage
        const consumerId = localStorage.getItem("consumer_id");
        if (!consumerId) {
            throw new Error("Consumer ID not found in localStorage.");
        }

        // Ensure table_size is treated as a string to match ENUM column
        const tableSize = reservation.table_size.toString(); 
        const quantity = reservation.quantity;  

        // Step 1: Update the status in the dine_in table to "complete"
        const updateStatusResponse = await fetch('/api/order/update-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dine_in_id: dineInId,
                stakeholder_id: stakeholderId,
                consumer_id: consumerId,
                table_size: tableSize,  // Sent as string
                quantity: quantity
            })
        });

        if (!updateStatusResponse.ok) {
            const errorData = await updateStatusResponse.json();
            throw new Error(`Failed to update status: ${errorData.error || updateStatusResponse.statusText}`);
        }

        // Step 2: Update the "bookable" count in the interior table
        const updateInteriorResponse = await fetch('/api/order/update-interior', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                stakeholder_id: stakeholderId,
                table_size: tableSize,  // Sent as string
                quantity: quantity
            })
        });

        if (!updateInteriorResponse.ok) {
            const errorData = await updateInteriorResponse.json();
            throw new Error(`Failed to update interior table: ${errorData.error || updateInteriorResponse.statusText}`);
        }

        alert("Reservation status changed to complete.");
        fetchReservations("all");  // Refresh the reservation list
    } catch (error) {
        console.error("Error changing reservation status:", error.message);
        alert("An error occurred while changing the reservation status.");
    }
}


    function showReservationDetails(reservation) {
        const detailsContainer = document.getElementById("reservation-info");
        detailsContainer.innerHTML = `
            <h4><i class="fas fa-info-circle"></i> Reservation Details</h4>
            <p><i class="fas fa-chair"></i> <strong>Table Size:</strong> ${reservation.table_size}-seater</p>
            <p><i class="fas fa-users"></i> <strong>Quantity:</strong> ${reservation.quantity}</p>
            <p><i class="fas fa-calendar-alt"></i> <strong>Date:</strong> ${reservation.booking_date}</p>
            <p><i class="fas fa-clock"></i> <strong>Time:</strong> ${reservation.booking_time}</p>
            <p><i class="fas fa-comment"></i> <strong>Message:</strong> ${reservation.message || "No message provided"}</p>
        `;
    }

    async function getStakeholderId() {
        try {
            const response = await fetch('/auth/stakeholder-id', {
                credentials: 'include' // Ensures cookies are sent with the request
            });
            if (!response.ok) throw new Error('Failed to fetch stakeholder ID');

            const data = await response.json();
            return data.stakeholder_id;
        } catch (error) {
            console.error('Error fetching stakeholder ID:', error);
            return null;
        }
    }
});
