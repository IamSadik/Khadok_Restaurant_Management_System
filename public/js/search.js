     // Function to fetch suggestions as the user types
     async function fetchSuggestions() {
        const searchQuery = document.getElementById('search-input').value.trim();
        const suggestionsBox = document.getElementById('suggestions');
        
        // Clear the suggestions box if search query is empty
        if (!searchQuery) {
            suggestionsBox.innerHTML = '';
            return;
        }
    
        try {
            // Send request to the backend to fetch search results
            const response = await fetch(`/api/search-restaurants?query=${searchQuery}`);
            const suggestions = await response.json();
    
            // Display suggestions in the suggestion box
            suggestionsBox.innerHTML = suggestions.map(restaurant => {
                return `<div class="suggestion-item">${restaurant.restaurant_name}</div>`;
            }).join('');
    
            // Add event listeners to the suggestion items (optional, for selecting suggestions)
            const suggestionItems = document.querySelectorAll('.suggestion-item');
            suggestionItems.forEach(item => {
                item.addEventListener('click', () => {
                    document.getElementById('search-input').value = item.textContent;  // Fill the input with selected suggestion
                    suggestionsBox.innerHTML = '';  // Clear suggestions
                });
            });
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }
    
    // Prevent form submission on Enter key
    function searchRestaurants() {
        const searchQuery = document.getElementById('search-input').value.trim();
        if (searchQuery) {
            window.location.href = `/search-results?query=${searchQuery}`;  // Redirect to a results page or perform another action
        }
        return false;  // Prevent form submission
    }
    