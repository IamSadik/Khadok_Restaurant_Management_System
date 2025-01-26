document.addEventListener("DOMContentLoaded", async () => {
    const orderList = document.getElementById("order-list");
    const orderInfo = document.getElementById("order-info");

    const consumerId = localStorage.getItem("consumer_id");

    if (!consumerId) {
        orderList.innerHTML = "<p>Please log in to view your orders.</p>";
        return;
    }

    // Fetch orders from the API
    async function fetchOrders(statusFilter = "all") {
        try {
            const response = await fetch(`/api/order/pickup?consumer_id=${consumerId}&status=${statusFilter}`);
            const data = await response.json();

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

    // Render orders in the order list
    function renderOrders(orders) {
        orderList.innerHTML = "";

        if (orders.length === 0) {
            orderList.innerHTML = "<p>No orders available.</p>";
            return;
        }

        orders.forEach(order => {
            const orderItem = document.createElement("div");
            orderItem.classList.add("order-item");
            orderItem.innerHTML = `
                <p><strong>Pickup Date:</strong> ${new Date(order.pickup_date).toLocaleString()}</p>
            `;
            orderItem.addEventListener("click", () => showOrderDetails(order));
            orderList.appendChild(orderItem);
        });
    }

    // Show order details when an order is clicked
    function showOrderDetails(order) {
        orderInfo.innerHTML = `
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total Amount:</strong> $${order.total_amount}</p>
        `;
    }

    // Filter button click events
    document.getElementById("all-filter").addEventListener("click", () => fetchOrders("all"));
    document.getElementById("active-filter").addEventListener("click", () => fetchOrders("pending"));
    document.getElementById("completed-filter").addEventListener("click", () => fetchOrders("complete"));

    // Initial fetch on page load
    fetchOrders();
});

document.addEventListener("DOMContentLoaded", async function () {
    // Load all reservations initially
    fetchReservations("all");

    // Filter button event listeners
    document.getElementById("all-reservation-filter").addEventListener("click", () => fetchReservations("all"));
    document.getElementById("upcoming-reservation-filter").addEventListener("click", () => fetchReservations("upcoming"));
    document.getElementById("past-reservation-filter").addEventListener("click", () => fetchReservations("past"));

    // Handle filter button click and toggle active state
    function handleFilterButtonClick(e) {
        document.querySelectorAll(".reservation-filter-btn").forEach(button => {
            button.classList.remove("active");
        });
        e.target.classList.add("active");
        fetchReservations(e.target.dataset.filter);
    }

    // Fetch reservations based on filter type
    async function fetchReservations(filterType = "all") {
        const consumerId = localStorage.getItem("consumer_id");
        if (!consumerId) {
            console.error("Consumer ID not found in local storage.");
            return;
        }
    
        try {
            const response = await fetch(`/api/reservation/reservation?filter=${filterType}&consumer_id=${consumerId}`);
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Invalid response format, expected JSON");
            }
    
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
                    </div>
                `;
    
                reservationItem.addEventListener("click", () => showReservationDetails(res));
                reservationList.appendChild(reservationItem);
            });
        } catch (error) {
            console.error("Error fetching reservations:", error);
            document.getElementById("reservation-list").innerHTML = "<p>Failed to load reservations.</p>";
        }
    }
    

    // Show reservation details
    function showReservationDetails(reservation) {
        const reservationInfo = document.getElementById("reservation-info");
        reservationInfo.innerHTML = `
            <h4>Reservation Details</h4>
            <p><strong>Table Size:</strong> ${reservation.table_size}</p>
            <p><strong>Quantity:</strong> ${reservation.quantity}</p>
            <p><strong>Date:</strong> ${reservation.booking_date}</p>
            <p><strong>Time:</strong> ${reservation.booking_time}</p>
            <p><strong>Status:</strong> ${reservation.status}</p>
            <p><strong>Message:</strong> ${reservation.message}</p>
        `;
    }

    // Event listeners for filter buttons
    document.querySelectorAll(".reservation-filter-btn").forEach(button => {
        button.addEventListener("click", handleFilterButtonClick);
    });
    document.addEventListener("DOMContentLoaded", () => {
        const defaultFilterButton = document.querySelector(".reservation-filter-btn[data-filter='all']");
        if (defaultFilterButton) {
            defaultFilterButton.classList.add("active");
            fetchReservations("all");
        } else {
            console.error("Filter button not found in DOM.");
        }
    });
});
