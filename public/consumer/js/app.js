async function loginConsumer(email, password) {
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('session_id', result.session_id); // Store session ID
            alert('Login successful!');
            window.location.href = '/consumer/khadok.consumer.dashboard.html'; // Redirect to dashboard
        } else {
            alert(result.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred during login');
    }
}


document.getElementById('logoutButton')?.addEventListener('click', async () => {
    const session_id = localStorage.getItem('session_id');
   
        window.location.href = '/login.html';
        return;
    
    
});



document.addEventListener("DOMContentLoaded", async () => {
    const restaurantsContainer = document.getElementById("restaurants-container");

    const fetchRestaurants = async (sortBy = "relevance") => {
        try {
            const response = await fetch(`/api/restaurants?sortBy=${sortBy}`);
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                restaurantsContainer.innerHTML = "";
                data.data.forEach((restaurant) => {
                    console.log("Restaurant Data:", restaurant); // Debugging

                    const card = document.createElement("div");
                    card.classList.add("restaurant-card");
                    card.setAttribute("data-id", restaurant.stakeholder_id); // Add stakeholder ID
                    card.setAttribute("data-name", restaurant.restaurant_name); // Add restaurant name

                    const name = document.createElement("h3");
                    name.textContent = restaurant.restaurant_name;

                    const ratings = document.createElement("p");
                    ratings.textContent = restaurant.ratings
                        ? `Ratings: ${restaurant.ratings}`
                        : "No ratings yet";

                    card.appendChild(name);
                    card.appendChild(ratings);
                    restaurantsContainer.appendChild(card);

                    // Add click event listener to the card
                    card.addEventListener("click", () => {
                        const restaurantId = card.getAttribute("data-id");
                        const restaurantName = card.getAttribute("data-name");

                        console.log("Restaurant Clicked ID:", restaurantId); // Debugging
                        console.log("Restaurant Clicked Name:", restaurantName); // Debugging

                        // Save to localStorage
                        localStorage.setItem("selectedRestaurantId", restaurantId);
                        localStorage.setItem("selectedRestaurantName", restaurantName);

                        // Navigate to the menu page
                        window.location.href = "menu.html";
                    });
                });
            } else {
                restaurantsContainer.innerHTML = "<p>No restaurants available.</p>";
            }
        } catch (error) {
            console.error("Error fetching restaurants:", error);
            restaurantsContainer.innerHTML =
                "<p>Error loading restaurants. Please try again later.</p>";
        }
    };

    // Fetch restaurants on initial load
    fetchRestaurants();

    // Add sorting functionality
    const radioButtons = document.querySelectorAll('input[name="sort-option"]');
    radioButtons.forEach((radio) => {
        radio.addEventListener("change", (event) => {
            const sortBy = event.target.value;
            fetchRestaurants(sortBy);
        });
    });
});



document.querySelectorAll(".restaurant-card").forEach((card) => {
    card.addEventListener("click", () => {
        const restaurantId = card.getAttribute("data-id");
        const restaurantName = card.getAttribute("data-name");

        // Save to localStorage
        localStorage.setItem("selectedRestaurantId", restaurantId);
        localStorage.setItem("selectedRestaurantName", restaurantName);

        // Navigate to the menu page
        window.location.href = "menu.html";
    });
});


document.addEventListener("DOMContentLoaded", async () => {
    const dineInContainer = document.getElementById("dinein-restaurants-container");

    const fetchDineInRestaurants = async (sortBy = "relevance") => {
        try {
            const response = await fetch(`/api/restaurants?sortBy=${sortBy}`);
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                dineInContainer.innerHTML = "";
                data.data.forEach((restaurant) => {
                    console.log("Dine In Restaurant Data:", restaurant); // Debugging

                    const card = document.createElement("div");
                    card.classList.add("restaurant-card");
                    card.setAttribute("data-id", restaurant.stakeholder_id);
                    card.setAttribute("data-name", restaurant.restaurant_name);

                    const name = document.createElement("h3");
                    name.textContent = restaurant.restaurant_name;

                    const ratings = document.createElement("p");
                    ratings.textContent = restaurant.ratings
                        ? `Ratings: ${restaurant.ratings}`
                        : "No ratings yet";

                    card.appendChild(name);
                    card.appendChild(ratings);
                    dineInContainer.appendChild(card);

                    // Add click event listener to the card
                    card.addEventListener("click", () => {
                        const restaurantId = card.getAttribute("data-id");
                        const restaurantName = card.getAttribute("data-name");

                        console.log("Dine In Restaurant Clicked ID:", restaurantId);
                        console.log("Dine In Restaurant Clicked Name:", restaurantName);

                        // Save to localStorage
                        localStorage.setItem("selectedDineInRestaurantId", restaurantId);
                        localStorage.setItem("selectedDineInRestaurantName", restaurantName);

                        // Navigate to the dine-in page
                        window.location.href = "dine_in.html";
                    });
                });
            } else {
                dineInContainer.innerHTML = "<p>No restaurants available for dine-in.</p>";
            }
        } catch (error) {
            console.error("Error fetching dine-in restaurants:", error);
            dineInContainer.innerHTML =
                "<p>Error loading dine-in restaurants. Please try again later.</p>";
        }
    };

    // Fetch dine-in restaurants on initial load
    fetchDineInRestaurants();

    // Add sorting functionality for dine-in
    const dineInRadioButtons = document.querySelectorAll('input[name="dinein-sort-option"]');
    dineInRadioButtons.forEach((radio) => {
        radio.addEventListener("change", (event) => {
            const sortBy = event.target.value;
            fetchDineInRestaurants(sortBy);
        });
    });
});
