// API Configuration
const API_KEY = "095076a0ef92439d076f3d9d87b2a8f5";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// DOM Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const displayDiv = document.getElementById("display-weather");
const loadingDiv = document.getElementById("loading");
const recentList = document.getElementById("recent-list");

// Weather icons mapping
const weatherIcons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Smoke': '🌫️',
    'Haze': '🌫️',
    'Dust': '🌫️',
    'Fog': '🌫️',
    'Sand': '🌫️',
    'Ash': '🌫️',
    'Squall': '💨',
    'Tornado': '🌪️'
};

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
    loadRecentSearches();
    
    // Add event listeners
    searchBtn.addEventListener("click", handleSearch);
    cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    });
});

// Main search function
async function handleSearch() {
    const city = cityInput.value.trim();
    
    if (city === "") {
        showError("Please enter a city name.");
        return;
    }
    
    showLoading(true);
    hideDisplay();
    
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeather(weatherData);
        saveToRecentSearches(city);
        cityInput.value = "";
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Fetch weather data from API
async function fetchWeatherData(city) {
    const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("City not found. Please check the spelling and try again.");
        } else if (response.status === 401) {
            throw new Error("API key error. Please check your API configuration.");
        } else {
            throw new Error("Failed to fetch weather data. Please try again.");
        }
    }
    
    return await response.json();
}

// Display weather information
function displayWeather(data) {
    const weatherIcon = weatherIcons[data.weather[0].main] || '🌤️';
    const feelsLike = Math.round(data.main.feels_like);
    const temperature = Math.round(data.main.temp);
    
    const weatherHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        
        <div class="weather-condition">
            <span class="weather-icon">${weatherIcon}</span>
            <span>${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}</span>
        </div>
        
        <div class="weather-info">
            <div class="weather-item temperature">
                <div class="label">Temperature</div>
                <div class="value">${temperature}°C</div>
                <div class="label">Feels like ${feelsLike}°C</div>
            </div>
            
            <div class="weather-item">
                <div class="label">Humidity</div>
                <div class="value">${data.main.humidity}%</div>
            </div>
            
            <div class="weather-item">
                <div class="label">Wind Speed</div>
                <div class="value">${data.wind.speed} m/s</div>
            </div>
            
    `;
    
    displayDiv.innerHTML = weatherHTML;
    displayDiv.classList.remove('error');
    displayDiv.classList.add('active');
}

// Show error message
function showError(message) {
    displayDiv.innerHTML = `<p>${message}</p>`;
    displayDiv.classList.add('error');
    displayDiv.classList.add('active');
}

// Show/hide loading animation
function showLoading(show) {
    if (show) {
        loadingDiv.classList.add('active');
    } else {
        loadingDiv.classList.remove('active');
    }
}

// Hide weather display
function hideDisplay() {
    displayDiv.classList.remove('active');
}

// Save city to recent searches
function saveToRecentSearches(city) {
    let recentSearches = JSON.parse(localStorage.getItem('recentWeatherSearches')) || [];
    
    // Remove if already exists
    recentSearches = recentSearches.filter(search => 
        search.toLowerCase() !== city.toLowerCase()
    );
    
    // Add to beginning
    recentSearches.unshift(city);
    
    // Keep only last 5 searches
    recentSearches = recentSearches.slice(0, 5);
    
    localStorage.setItem('recentWeatherSearches', JSON.stringify(recentSearches));
    loadRecentSearches();
}

// Load and display recent searches
function loadRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem('recentWeatherSearches')) || [];
    
    if (recentSearches.length === 0) {
        document.querySelector('.recent-searches').style.display = 'none';
        return;
    }
    
    document.querySelector('.recent-searches').style.display = 'block';
    
    recentList.innerHTML = recentSearches.map(city => 
        `<span class="recent-item" onclick="searchRecentCity('${city}')">${city}</span>`
    ).join('');
}

// Search from recent cities
function searchRecentCity(city) {
    cityInput.value = city;
    handleSearch();
}

// Clear recent searches (optional feature)
function clearRecentSearches() {
    localStorage.removeItem('recentWeatherSearches');
    loadRecentSearches();
}