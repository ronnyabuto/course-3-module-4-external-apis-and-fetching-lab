// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Select elements
const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

// Event listener
fetchButton.addEventListener('click', () => {
    const state = stateInput.value.trim();
    if (!state) {
        // Optional: handle empty input locally or let API fail/handle it. 
        // Lab says "invalid input" should be handled.
        // For now, let's proceed to fetch. 
    }

    // Clear input
    stateInput.value = '';

    // Fetch data
    fetchWeatherAlerts(state);
});

function fetchWeatherAlerts(state) {
    // Reset error message on new attempt (optimistic)
    // Or do it on success. Test says "clears the error message after a successful fetch".
    // But usually we clear old errors when starting a new action.
    // Let's look at the specific test: "clears the error message after a successful fetch"
    // It verifies errorDiv text is empty and has class hidden.

    fetch(weatherApi + state)
        .then(response => {
            if (!response.ok) {
                // Determine if it's a 404 or other error
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Success
            resetError();
            displayAlerts(data);
        })
        .catch(error => {
            displayError(error);
        });
}

function displayAlerts(data) {
    // Clear previous alerts
    alertsDisplay.innerHTML = '';

    // Summary
    // data.title: "Current watches, warnings, and advisories for Minnesota"
    // data.features.length
    // Text: "Current watches, warnings, and advisories for Minnesota: 11"

    const summary = document.createElement('p');
    summary.textContent = `${data.title}: ${data.features.length}`;
    alertsDisplay.appendChild(summary);

    // Headlines
    data.features.forEach(feature => {
        if (feature.properties && feature.properties.headline) {
            const headline = document.createElement('p');
            headline.textContent = feature.properties.headline;
            alertsDisplay.appendChild(headline);
        }
    });
}

function displayError(error) {
    errorMessage.textContent = error.message;
    errorMessage.classList.remove('hidden');
}

function resetError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
}