// search.js

// Fetch suggestions dynamically
function fetchSuggestions() {
    const input = document.getElementById("search-input");
    const suggestionsBox = document.getElementById("suggestions");
    const query = input.value.trim();

    if (query.length > 0) {
        fetch(`/search-restaurants?query=${query}`)
            .then(response => response.json())
            .then(data => {
                suggestionsBox.innerHTML = ""; // Clear previous suggestions
                if (data.length > 0) {
                    data.forEach(restaurant => {
                        const suggestion = document.createElement("div");
                        suggestion.classList.add("suggestion-item");
                        suggestion.textContent = restaurant.restaurant_name;
                        suggestion.onclick = () => {
                            window.location.href = `/restaurant-profile?id=${stakeholder.stakeholder_id}`; // Route to the restaurant profile
                        };
                        suggestionsBox.appendChild(suggestion);
                    });
                } else {
                    suggestionsBox.innerHTML = "<div class='no-suggestions'>No matches found</div>";
                }
            })
            .catch(error => console.error("Error fetching suggestions:", error));
    } else {
        suggestionsBox.innerHTML = ""; // Clear suggestions if input is empty
    }
}

// Handle full search submission
function searchRestaurants() {
    const query = document.getElementById("search-input").value.trim();
    if (query) {
        window.location.href = `/search-results?query=${query}`; // Redirect to the search results page
    }
    return false; // Prevent default form submission
}
