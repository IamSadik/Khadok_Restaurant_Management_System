document.addEventListener("DOMContentLoaded", async () => {
    const apiURL = "http://localhost:3000/admin/stakeholders";
    const tableBody = document.getElementById("stakeholders-table");

    // Fetch and populate table data
    const fetchStakeholders = async () => {
        try {
            const response = await fetch(apiURL);
            const data = await response.json();

            // Clear the table before adding rows
            tableBody.innerHTML = "";

            // Check if data exists
            if (data.stakeholders && data.stakeholders.length > 0) {
                data.stakeholders.forEach(stakeholder => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${stakeholder.stakeholder_id}</td>
                        <td>${stakeholder.name}</td>
                        <td>${stakeholder.email}</td>
                        <td>${stakeholder.area || "N/A"}</td>
                        <td>${stakeholder.restaurant_name || "N/A"}</td>
                        <td>${stakeholder.ratings || "N/A"}</td>
                        <td>
                            <button class="delete-btn" data-id="${stakeholder.stakeholder_id}">Delete</button>
                        </td>
                    `;

                    tableBody.appendChild(row);
                });

                // Add event listeners to delete buttons
                document.querySelectorAll(".delete-btn").forEach(button => {
                    button.addEventListener("click", async (event) => {
                        const stakeholderId = event.target.dataset.id;
                        await deleteStakeholder(stakeholderId);
                        await fetchStakeholders(); // Refresh the table after deletion
                    });
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="7">No stakeholders found.</td></tr>`;
            }
        } catch (error) {
            console.error("Error fetching stakeholder details:", error);
            tableBody.innerHTML = `<tr><td colspan="7">Failed to fetch data. Please try again later.</td></tr>`;
        }
    };

    // Function to delete a stakeholder
    const deleteStakeholder = async (stakeholderId) => {
        const deleteAPI = `${apiURL}/${stakeholderId}`;
        try {
            const response = await fetch(deleteAPI, { method: "DELETE" });
            if (response.ok) {
                console.log(`Stakeholder with ID ${stakeholderId} deleted successfully.`);
            } else {
                console.error(`Failed to delete stakeholder with ID ${stakeholderId}.`);
            }
        } catch (error) {
            console.error("Error deleting stakeholder:", error);
        }
    };

    // Initial data fetch
    await fetchStakeholders();
});
