// Main function to handle the country search
async function searchCountry() {
    const countryName = document.getElementById("searchInput").value.trim();
    if (!countryName) {
        alert("Please enter a country name.");
        return;
    }

    try {
        // Fetch country details
        const countryData = await fetchCountryData(countryName);

        if (countryData) {
            // Fetch historical details
            const history = await fetchCountryHistory(countryData.name.common);

            // Display country details and history
            displayCountryData(countryData, history);
        } else {
            alert("Country not found. Please check the name and try again.");
        }
    } catch (error) {
        console.error("Error fetching country data:", error);
        alert("Unable to fetch country data. Please try again later.");
    }
}

// Function to fetch country data from REST Countries API
async function fetchCountryData(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data[0]; // Return the first match
    } catch (error) {
        console.error("Error fetching country data:", error);
        return null;
    }
}

// Function to fetch historical details using Wikipedia API
async function fetchCountryHistory(countryName) {
    const wikiApiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${countryName}`;
    try {
        const response = await fetch(wikiApiUrl);
        const data = await response.json();

        if (data.extract) {
            return data.extract; // Return the historical summary
        } else {
            return "No historical details available for this country.";
        }
    } catch (error) {
        console.error("Error fetching historical data:", error);
        return "Unable to fetch historical details. Please try again later.";
    }
}

// Function to display country details and historical data
function displayCountryData(country, history) {
    const countryDataContainer = document.getElementById("countryData");
    countryDataContainer.innerHTML = ""; // Clear previous results

    const countryCard = document.createElement("div");
    countryCard.classList.add("col-md-4", "mb-4"); // Bootstrap grid for responsive design
    countryCard.innerHTML = `
        <div class="card">
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="card-img">
            <div class="card-body">
                <h5 class="card-title">${country.name.common}</h5>
                <p class="card-text"><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                <p class="card-text"><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <div class="country-history">
                    <strong>Details:</strong>
                    <p>${history}</p>
                </div>
                <button type="button" class="btn btn-outline-success" onclick="toggleWeatherCard('${country.name.common}', this)">View Weather</button>
                <div class="weather-card-container" id="weather-${country.name.common}" style="display: none;"></div>
            </div>
        </div>
    `;
    countryDataContainer.appendChild(countryCard);
}


// Toggle weather card visibility
function toggleWeatherCard(countryName, button) {
    const weatherContainer = document.getElementById(`weather-${countryName}`);
    
    // Toggle the visibility of the weather card
    if (weatherContainer.style.display === "none") {
        weatherContainer.style.display = "block";
        fetchWeatherData(countryName, weatherContainer);
        button.textContent = "Hide Weather"; // Change button text to hide
    } else {
        weatherContainer.style.display = "none";
        button.textContent = "View Weather"; // Change button text to view
    }
}

// Function to fetch weather data using OpenWeather API
async function fetchWeatherData(countryName, weatherContainer) {
    const apiKey = "ce679a1ad825a00de28a88542ecabd43";
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${countryName}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(weatherApiUrl);
        const weatherData = await response.json();

        if (weatherData.main) {
            displayWeatherCard(weatherData, weatherContainer);
        } else {
            alert("Weather data not available for this country.");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Unable to fetch weather data. Please try again later.");
    }
}

// Function to display weather details inside the country card
function displayWeatherCard(weatherData, weatherContainer) {
    weatherContainer.innerHTML = ''; // Clear previous weather details

    const weatherCard = document.createElement('div');
    weatherCard.classList.add('weather-card');
    weatherCard.innerHTML = `
        <div class="weather-display">
            <h2>${weatherData.main.temp}°C</h2>
            <p>${weatherData.weather[0].description}</p>
        </div>
        <div class="weather-forecast">
            <div>
                <p>Monday</p>
                <p>${weatherData.main.temp_max}°C Cloudy</p>
            </div>
            <div>
                <p>Tuesday</p>
                <p>${weatherData.main.temp_min}°C Rainy</p>
            </div>
        </div>
    `;
    weatherContainer.appendChild(weatherCard);
}

