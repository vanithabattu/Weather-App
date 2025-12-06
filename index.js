const apikey = "77f59af834e59529965e4f893472d665";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon"); 

// Main function to fetch weather by city
async function checkWeather(city) {
    if (!city)
    {
      getLocationWeather();
      searchBox.value="";
       return; // Prevent empty search
}

    try {
        const response = await fetch(apiUrl + city + `&appid=${apikey}`);
        const data = await response.json();

        if (data.cod === "404") {
            alert("City not found");
            searchBox.value = "";
            return;
        }

        updateWeatherCard(data);

    } catch (err) {
        console.error("Error fetching weather:", err);
        alert("Failed to fetch weather data.");
    }
}

// Update weather card
function updateWeatherCard(data) {

  document.querySelector(".city").innerHTML = data.name;
   document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
     document.querySelector(".wind").innerHTML = data.wind.speed + " km/h"; 

console.log(data);
    // Set weather icon dynamically
    const mainWeather = data.weather[0].main.toLowerCase();

    if (mainWeather.includes("cloud")) weatherIcon.src = "clouds.png";
    else if (mainWeather.includes("drizzle")) weatherIcon.src = "drizzle.png";
    else if (mainWeather.includes("rain")) weatherIcon.src = "rain.png";
    else if (mainWeather.includes("mist")) weatherIcon.src = "mist.png";
    else if (mainWeather.includes("snow")) weatherIcon.src = "snow.png";
    else weatherIcon.src = "default.png"; // fallback
}

// Event listener for search button
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

// Auto-location weather on page load
window.addEventListener("load", getLocationWeather);

// Geolocation functions
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`)
        .then(response => response.json())
        .then(data => updateWeatherCard(data))
        .catch(err => console.error("Error fetching weather:", err));
}

function showError() {
    alert("Please allow location access to get current weather.");
}
