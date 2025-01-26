document.addEventListener("DOMContentLoaded", async () => {
    const orderList = document.getElementById("order-list");
    const orderInfo = document.getElementById("order-info");

    const stakeholderId = localStorage.getItem("stakeholder_id");

    if (!stakeholderId) {
        orderList.innerHTML = "<p>Please log in to view your orders.</p>";
        return;
    }

    // Fetch orders with default filter ("all")
    async function fetchOrders(statusFilter = "all") {
        try {
            const response = await fetch(`/api/order?stakeholder_id=${stakeholderId}&status=${statusFilter}`);
            const data = await response.json();
    
            console.log('Orders Data:', data); // Log data to see what is returned
    
            if (data.success) {
                renderOrders(data.orders);
            } else {
                orderList.innerHTML = "<p>No orders found.</p>";
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            orderList.innerHTML = "<p>Failed to fetch orders. Try again later.</p>";
        }
    }
    
    // Fetch pickups with default filter ("all")
    async function fetchPickups(statusFilter = "all") {
        try {
            const response = await fetch(`/api/order/pickups?stakeholder_id=${stakeholderId}&status=${statusFilter}`);
            const data = await response.json();
    
            console.log('Pickups Data:', data); // Log data to see what is returned
    
            if (data.success) {
                renderPickups(data.pickups);
            } else {
                orderList.innerHTML = "<p>No pickups found.</p>";
            }
        } catch (error) {
            console.error("Error fetching pickups:", error);
            orderList.innerHTML = "<p>Failed to fetch pickups. Try again later.</p>";
        }
    }
    
    // Render orders in the order list
    function renderOrders(orders) {
        orderList.innerHTML = ""; // Clear existing content

        if (orders.length === 0) {
            orderList.innerHTML = "<p>No orders available.</p>";
            return;
        }

        orders.forEach(order => {
            const orderItem = document.createElement("div");
            orderItem.classList.add("order-item");
            orderItem.innerHTML = `
                <p><strong>Order ID:</strong> ${order.order_id}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Total Amount:</strong> $${order.total_amount}</p>
            `;
            orderItem.addEventListener("click", () => showOrderDetails(order));
            orderList.appendChild(orderItem);
        });
    }

    // Render pickups in the order list
    function renderPickups(pickups) {
        orderList.innerHTML = ""; // Clear existing content

        if (pickups.length === 0) {
            orderList.innerHTML = "<p>No pickups available.</p>";
            return;
        }

        pickups.forEach(pickup => {
            const pickupItem = document.createElement("div");
            pickupItem.classList.add("order-item");
            pickupItem.innerHTML = `
                <p><strong>Pickup Date:</strong> ${new Date(pickup.pickup_date).toLocaleString()}</p>
                <p><strong>Status:</strong> ${pickup.status}</p>
                <p><strong>Total Amount:</strong> $${pickup.total_amount}</p>
            `;
            pickupItem.addEventListener("click", () => showPickupDetails(pickup));
            orderList.appendChild(pickupItem);
        });
    }

    // Show order details when an order is clicked
    function showOrderDetails(order) {
        orderInfo.innerHTML = `
            <p><strong>Order ID:</strong> ${order.order_id}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total Amount:</strong> $${order.total_amount}</p>
        `;
    }

    // Show pickup details when a pickup is clicked
    function showPickupDetails(pickup) {
        orderInfo.innerHTML = `
            <p><strong>Pickup Date:</strong> ${new Date(pickup.pickup_date).toLocaleString()}</p>
            <p><strong>Status:</strong> ${pickup.status}</p>
            <p><strong>Total Amount:</strong> $${pickup.total_amount}</p>
        `;
    }

    // Filter button click events
    document.getElementById("all-filter").addEventListener("click", () => fetchOrders("all"));
    document.getElementById("active-filter").addEventListener("click", () => fetchOrders("pending"));
    document.getElementById("completed-filter").addEventListener("click", () => fetchOrders("complete"));

    document.getElementById("pickup-all-filter").addEventListener("click", () => fetchPickups("all"));
    document.getElementById("pickup-active-filter").addEventListener("click", () => fetchPickups("pending"));
    document.getElementById("pickup-completed-filter").addEventListener("click", () => fetchPickups("complete"));

    // Initial fetch on page load with "all" filters for both orders and pickups
    fetchOrders("all");
    fetchPickups("all");
});
