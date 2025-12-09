//OpenWeatherMap API key
const apikey = "77f59af834e59529965e4f893472d665";

//fetching weather by city name
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

//selet DOM elements
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon"); 

// async Main function to fetch weather by city
async function checkWeather(city) {
    if (!city)
    {
        
       //function to get current location weather info
      getLocationWeather();
      searchBox.value="";
       return; //call the return to Prevent empty search
}

    try {
        //await pause execution until response arrive
        //fetch() request weather data from OpenWeatherMAP api
        const response = await fetch(apiUrl + city + `&appid=${apikey}`);
        //response.json converts the raw responce into json format
        const data = await response.json();

        //Checks if the API returned a 404 error, which happens when the city name is invalid.
        if (data.cod === "404") {
            alert("City not found"); //Alerts the user and clears the search box. 
            searchBox.value = "";
            return;
        }
        
        //If data is valid, calls updateWeatherCard() to update the UI with weather info. 
        updateWeatherCard(data);

    }
    //Error handling: if the fetch fails (network issues, API down), logs error and shows alert. 
     catch (err)
     {
        console.error("Error fetching weather:", err);
        alert("Failed to fetch weather data.");
    }
}

// Function to update DOM elements based on API data.
function updateWeatherCard(data) {

  document.querySelector(".city").innerHTML = data.name;
   document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
     document.querySelector(".wind").innerHTML = data.wind.speed + " km/h"; 

     console.log(data); //Logs the full API response in console.
   
     // Set weather icon dynamically
    const mainWeather = data.weather[0].main.toLowerCase();

    if (mainWeather.includes("cloud")) weatherIcon.src = "clouds.png";
    else if (mainWeather.includes("drizzle")) weatherIcon.src = "drizzle.png";
    else if (mainWeather.includes("rain")) weatherIcon.src = "rain.png";
    else if (mainWeather.includes("mist")) weatherIcon.src = "mist.png";
    else if (mainWeather.includes("snow")) weatherIcon.src = "snow.png";
    else weatherIcon.src = "default.png"; // fallback
}

//Calls checkWeather() with input value when button is clicked.
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

//Calls checkWeather() when Enter key is pressed in input.
searchBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

// Fetches user location weather automatically when page loads.
window.addEventListener("load", getLocationWeather);

// Geolocation functions
function getLocationWeather() {
    if (navigator.geolocation) //Checks if browser supports geolocation
        {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    //Extracts latitude and longitude from geolocation API
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    //Fetches weather data using coordinates instead of city name. 

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`)
        .then(response => response.json())
        .then(data => updateWeatherCard(data))
        .catch(err => console.error("Error fetching weather:", err));
}

function showError() {
    alert("Please allow location access to get current weather.");
}
