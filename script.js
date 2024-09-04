const maxLocations = 7; // Maximum number of locations allowed
let currentLocationCount = 0; // Counter for added locations

// Get the user's location
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    fetchWeatherData(latitude, longitude);
  },
  (error) => {
    console.error('Error getting location:', error);
    displayWeatherInfo('Unable to get location');
  }
);

// Fetch weather data from OpenWeatherMap API
function fetchWeatherData(latitude, longitude) {
  const apiKey = '6084b872d00a3f72dbec3969489236a2'; // Replace with your actual API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const { name, weather, main, wind } = data;
      const { description, icon } = weather[0];
      const { temp, humidity } = main;
      const { speed } = wind;

      const weatherInfo = `
        <div class="weather-card">
          <h2 class="city-name">${name}</h2>
          <img class="weather-icon" src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
          <p class="weather-description">${description}</p>
          <p class="temperature">Temperature: <span class="temp-value">${temp}</span>°C</p>
          <p class="humidity">Humidity: <span class="humidity-value">${humidity}</span>%</p>
          <p class="wind-speed">Wind Speed: <span class="wind-speed-value">${speed}</span> m/s</p>
          <button class="delete-button">Delete</button>
        </div>
      `;

      displayWeatherInfo(weatherInfo);
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
      showWarningMessage('Location not found. Please try a different city or region!');
    });
}

// Display weather information
function displayWeatherInfo(info) {
  const weatherCardsContainer = document.querySelector('.weather-cards');
  weatherCardsContainer.innerHTML += info; // Add new weather info

  // Add event listener to delete buttons
  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', deleteWeatherCard);
  });

  currentLocationCount++; // Increment the count of locations
}

// Delete weather card
function deleteWeatherCard(event) {
  const card = event.target.closest('.weather-card');
  const weatherCards = document.querySelectorAll('.weather-card');

  if (weatherCards.length === 1) {
    showDeleteWarningMessage();
  } else {
    card.remove();
    currentLocationCount--; // Decrement the count of locations
  }
}

// Show warning message
function showWarningMessage(message) {
  const warningMessage = document.getElementById("warningMessage");
  warningMessage.innerText = message;
  warningMessage.style.display = "block";
  setTimeout(() => {
    warningMessage.style.display = "none";
  }, 3000);
}

// Show delete warning message
function showDeleteWarningMessage() {
  const deleteWarningMessage = document.getElementById("deleteWarningMessage");
  deleteWarningMessage.style.display = "block";
  setTimeout(() => {
    deleteWarningMessage.style.display = "none";
  }, 5000);
}

// Modal functionality
const modal = document.getElementById("locationModal");
const addLocationButton = document.querySelector(".add-location-button");
const closeButton = document.querySelector(".close-button");
const okButton = document.querySelector(".ok-button");
const cancelButton = document.querySelector(".cancel-button");
const locationInput = document.getElementById("locationInput");
const limitWarningMessage = document.getElementById("limitWarningMessage");

// Open modal on button click
addLocationButton.onclick = function() {
  if (currentLocationCount < maxLocations) {
    modal.style.display = "block";
  } else {
    limitWarningMessage.style.display = "block";
    setTimeout(() => {
      limitWarningMessage.style.display = "none";
    }, 5000);
  }
}

// Close modal when the user clicks on <span> (x)
closeButton.onclick = function() {
  modal.style.display = "none";
}

// Close modal when the user clicks the Ok button
okButton.onclick = function() {
  const location = locationInput.value.trim();
  if (location) {
    fetchWeatherDataByLocation(location);
    modal.style.display = "none";
    locationInput.value = '';
  } else {
    showWarningMessage('Please enter a location.');
  }
}

// Refresh input field and keep modal open when Cancel button is clicked
cancelButton.onclick = function() {
  locationInput.value = '';
}

// Close modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

// Fetch weather data by location
function fetchWeatherDataByLocation(location) {
  const apiKey = '6084b872d00a3f72dbec3969489236a2'; // Replace with your actual API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const { name, weather, main, wind } = data;
      const { description, icon } = weather[0];
      const { temp, humidity } = main;
      const { speed } = wind;

      const weatherInfo = `
        <div class="weather-card">
          <h2 class="city-name">${name}</h2>
          <img class="weather-icon" src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
          <p class="weather-description">${description}</p>
          <p class="temperature">Temperature: <span class="temp-value">${temp}</span>°C</p>
          <p class="humidity">Humidity: <span class="humidity-value">${humidity}</span>%</p>
          <p class="wind-speed">Wind Speed: <span class="wind-speed-value">${speed}</span> m/s</p>
          <button class="delete-button">Delete</button>
        </div>
      `;

      displayWeatherInfo(weatherInfo);
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
      showWarningMessage('Location not found. Please try a different city or region!');
    });
}