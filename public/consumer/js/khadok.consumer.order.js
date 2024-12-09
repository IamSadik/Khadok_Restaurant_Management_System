document.addEventListener("DOMContentLoaded", () => {
    // Elements for Orders
    const orderList = document.getElementById("order-list");
    const orderInfo = document.getElementById("order-info");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Elements for Reservations
    const reservationList = document.getElementById("reservation-list");
    const reservationInfo = document.getElementById("reservation-info");
    const reservationFilterButtons = document.querySelectorAll(".reservation-filter-btn");

    // Demo Orders Data
    const orders = [
        { id: 1, status: "active", title: "Pizza Order", description: "Your pizza order is being prepared." },
        { id: 2, status: "completed", title: "Burger Order", description: "Your burger order was delivered successfully." },
        { id: 3, status: "active", title: "Pasta Order", description: "Your pasta order is being prepared." },
        { id: 4, status: "completed", title: "Sushi Order", description: "Your sushi order was delivered successfully." },
        { id: 5, status: "completed", title: "Sandwich Order", description: "Your sandwich order was delivered successfully." },
        { id: 6, status: "active", title: "Taco Order", description: "Your taco order is being prepared." },
        { id: 7, status: "active", title: "Salad Order", description: "Your salad order is being prepared." },
    ];

    // Demo Reservations Data
    const reservations = [
        { id: 1, status: "upcoming", title: "Dinner Reservation", description: "Table for 2 at 7 PM." },
        { id: 2, status: "past", title: "Lunch Reservation", description: "Table for 4 at 1 PM." },
        { id: 3, status: "upcoming", title: "Birthday Party Reservation", description: "Private hall reservation for 20 guests." },
        { id: 4, status: "past", title: "Anniversary Dinner", description: "Table for 2 at 8 PM." },
        { id: 5, status: "past", title: "Wedding Dinner", description: "Table for 2 at 8 PM." },
        { id: 6, status: "past", title: "Wedding Dinner", description: "Table for 2 at 8 PM." },
        { id: 7, status: "past", title: "Wedding Dinner", description: "Table for 2 at 8 PM." }
    ];

    // Function to render orders based on filter
    const renderOrders = (status) => {
        orderList.innerHTML = ""; // Clear current orders
        const filteredOrders = status === "all" ? orders : orders.filter(order => order.status === status);

        filteredOrders.forEach(order => {
            const orderItem = document.createElement("div");
            orderItem.classList.add("order-item");
            orderItem.dataset.id = order.id;
            orderItem.innerHTML = `
                ${order.title}
                <span class="order-status ${order.status}">${order.status}</span>
            `;
            orderList.appendChild(orderItem);
        });

        addOrderClickHandlers(); // Rebind click events
    };

    // Function to handle order item click
    const addOrderClickHandlers = () => {
        const orderItems = document.querySelectorAll(".order-item");
        orderItems.forEach(item => {
            item.addEventListener("click", (e) => {
                const orderId = e.currentTarget.dataset.id;
                const order = orders.find(o => o.id === parseInt(orderId));

                orderInfo.innerHTML = `
                    <h5>${order.title}</h5>
                    <p>${order.description}</p>
                `;
            });
        });
    };

    // Function to render reservations based on filter
    const renderReservations = (status) => {
        reservationList.innerHTML = ""; // Clear current reservations
        const filteredReservations = status === "all" ? reservations : reservations.filter(res => res.status === status);

        filteredReservations.forEach(reservation => {
            const reservationItem = document.createElement("div");
            reservationItem.classList.add("reservation-item");
            reservationItem.dataset.id = reservation.id;
            reservationItem.innerHTML = `
                ${reservation.title}
                <span class="reservation-status ${reservation.status}">${reservation.status}</span>
            `;
            reservationList.appendChild(reservationItem);
        });

        addReservationClickHandlers(); // Rebind click events
    };

    // Function to handle reservation item click
    const addReservationClickHandlers = () => {
        const reservationItems = document.querySelectorAll(".reservation-item");
        reservationItems.forEach(item => {
            item.addEventListener("click", (e) => {
                const reservationId = e.currentTarget.dataset.id;
                const reservation = reservations.find(r => r.id === parseInt(reservationId));

                reservationInfo.innerHTML = `
                    <h5>${reservation.title}</h5>
                    <p>${reservation.description}</p>
                `;
            });
        });
    };

    // Filter button functionality for orders
    filterButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");
            const filter = e.target.id.split("-")[0];
            renderOrders(filter);
        });
    });

    // Filter button functionality for reservations
    reservationFilterButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            reservationFilterButtons.forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");
            const filter = e.target.id.split("-")[0];
            renderReservations(filter);
        });
    });

    // Initial render
    renderOrders("all");
    renderReservations("all");
});
