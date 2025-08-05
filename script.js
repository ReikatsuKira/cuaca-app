const API_KEY = '286dfbb9453c59882c0fb92aec87d8b5';

document.addEventListener('DOMContentLoaded', () => {
  getCurrentLocationWeather();

  const form = document.getElementById('search-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = document.getElementById('city-input').value.trim();
    if (city !== '') {
      fetchWeatherByCity(city);
    }
  });
});

function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude, 'weather-now');
      },
      (error) => {
        document.getElementById('weather-now').innerText = 'Gagal mengambil lokasi.';
        console.error(error);
      }
    );
  } else {
    document.getElementById('weather-now').innerText = 'Geolocation tidak didukung oleh browser.';
  }
}

function fetchWeatherByCoordinates(lat, lon, elementId) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    .then((res) => res.json())
    .then((data) => {
      displayWeather(data, elementId);
    })
    .catch((err) => {
      console.error(err);
      document.getElementById(elementId).innerText = 'Gagal memuat data cuaca.';
    });
}

function fetchWeatherByCity(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === 200) {
        displayWeather(data, 'city-weather');
      } else {
        document.getElementById('city-weather').innerText = 'Kota tidak ditemukan.';
      }
    })
    .catch((err) => {
      console.error(err);
      document.getElementById('city-weather').innerText = 'Gagal memuat data cuaca.';
    });
}

function displayWeather(data, elementId) {
  const tempC = data.main.temp;
  const tempF = (tempC * 9/5 + 32).toFixed(2);
  const weather = data.weather[0].description;
  const city = data.name;
  const icon = data.weather[0].icon;

  const html = `
    <h3>${city}</h3>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon cuaca">
    <p>${weather}</p>
    <p>Suhu: ${tempC}°C / ${tempF}°F</p>
  `;

  document.getElementById(elementId).innerHTML = html;
}
