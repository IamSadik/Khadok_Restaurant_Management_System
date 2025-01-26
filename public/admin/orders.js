document.addEventListener("DOMContentLoaded", async () => {
    const apiURL = "http://localhost:3000/admin/consumers";
    const tableBody = document.getElementById("consumers-table");

    // Fetch and populate table data
    const fetchConsumers = async () => {
        try {
            const response = await fetch(apiURL);
            const data = await response.json();

            // Clear the table before adding rows
            tableBody.innerHTML = "";

            // Check if data exists
            if (data.consumers && data.consumers.length > 0) {
                data.consumers.forEach(consumer => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${consumer.consumer_id}</td>
                        <td>${consumer.name}</td>
                        <td>${consumer.email}</td>
                        <td>${consumer.phone_number || "N/A"}</td>
                        <td>
                            <button class="delete-btn" data-id="${consumer.consumer_id}">Delete</button>
                        </td>
                    `;

                    tableBody.appendChild(row);
                });

                // Reattach event listeners to the newly added buttons
                attachDeleteEventListeners();
            } else {
                tableBody.innerHTML = `<tr><td colspan="5">No consumers found.</td></tr>`;
            }
        } catch (error) {
            console.error("Error fetching consumer details:", error);
            tableBody.innerHTML = `<tr><td colspan="5">Failed to fetch data. Please try again later.</td></tr>`;
        }
    };

    // Function to attach event listeners to delete buttons
    const attachDeleteEventListeners = () => {
        const deleteButtons = document.querySelectorAll(".delete-btn");

        deleteButtons.forEach(button => {
            button.removeEventListener("click", handleDelete); // Remove any existing listener
            button.addEventListener("click", handleDelete); // Attach a fresh listener
        });
    };

    // Event handler for deleting a consumer
    const handleDelete = async (event) => {
        const consumerId = event.target.dataset.id;

        if (!consumerId) {
            console.error("Consumer ID not found on button click.");
            return;
        }

        await deleteConsumer(consumerId);
        await fetchConsumers(); // Refresh the table after deletion
    };

    // Function to delete a consumer
    const deleteConsumer = async (consumerId) => {
        const deleteAPI = `${apiURL}/${consumerId}`;
        try {
            const response = await fetch(deleteAPI, { method: "DELETE" });
            if (response.ok) {
                console.log(`Consumer with ID ${consumerId} deleted successfully.`);
            } else {
                console.error(`Failed to delete consumer with ID ${consumerId}.`);
            }
        } catch (error) {
            console.error("Error deleting consumer:", error);
        }
    };

    // Initial data fetch
    await fetchConsumers();
});
