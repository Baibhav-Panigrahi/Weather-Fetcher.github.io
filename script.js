const apiKey = '3588d762202e60c51dfe9b9fb7c82f19';
let map;
let marker;

function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                // Display weather information
                document.getElementById("cityName").textContent = data.name;
                document.getElementById("temperature").textContent = data.main.temp;
                document.getElementById("weather").textContent = data.weather[0].description;
                document.getElementById("humidity").textContent = data.main.humidity;
                document.getElementById("windSpeed").textContent = data.wind.speed;
                document.getElementById("precipitation").textContent = data.rain ? data.rain['1h'] : 0;

                const { lat, lon } = data.coord;

                // Fetch air quality data
                fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(aqData => {
                        const aqi = aqData.list[0].main.aqi;
                        document.getElementById("airQuality").textContent = getAirQualityIndex(aqi);
                    })
                    .catch(error => {
                        console.error("Error fetching air quality data:", error);
                        document.getElementById("airQuality").textContent = "N/A";
                    });

                // Show map with location
                showMap(lat, lon);
            } else {
                alert("City not found. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Could not fetch weather data.");
        });
}

function getAirQualityIndex(aqi) {
    switch (aqi) {
        case 1: return 'Good';
        case 2: return 'Fair';
        case 3: return 'Moderate';
        case 4: return 'Poor';
        case 5: return 'Very Poor';
        default: return 'Unknown';
    }
}

function showMap(latitude, longitude) {
    // Initialize map if it doesn't exist
    if (!map) {
        map = L.map('map').setView([latitude, longitude], 10);

        // Set up the OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    } else {
        // Update map position
        map.setView([latitude, longitude], 10);
    }

    // Place a marker on the map at the specified coordinates
    if (marker) {
        marker.setLatLng([latitude, longitude]);
    } else {
        marker = L.marker([latitude, longitude]).addTo(map);
    }
}
