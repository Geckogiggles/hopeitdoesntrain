var resultContentEl = document.querySelector("#result-content");
var searchFormEl = document.querySelector("#formCitySearch");
var textInputCity = document.querySelector("#citySearchInput");
var fiveDayForecastEl = document.querySelector("#fiveDayForecast");
var currentForecastEl = document.querySelector("#currentForecastCard");
var searchHistoryListEl = document.querySelector("#searchHistory");

// var geocodeURL= `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=${limit}&appid=${apiKey}`;



var apiKey = '70da03e4a9cd76080662380bedafe8c5';
function handleSearchFormSubmit(event) {
    event.preventDefault();
    // get value from search input
    var searchInput = textInputCity.value;
    // conditional statement to catch user error
    if (searchInput == "") {
        alert("Text has not been filled. Please fill in text area with a city name to search.");
    } else {
        //everytime you click history it won't keep adding to the history
        saveSearchtoLocalStorage(searchInput);

        searchApi(searchInput);
    }
}

function renderCurrentWeather(resultObj) {
    var currentWeatherString = "";
    currentWeatherString += `<div class="card mb-3" style="max-width: 540px;">
    <div class="row g-0">
      <div class="col-md-4">
      <img src="http://openweathermap.org/img/wn/${resultObj.weather[0].icon}@2x.png"class="img-fluid rounded-start" alt="${resultObj.weather[0].description}">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">Current Weather in ${resultObj.name}</h5>
          <ul class="card-text">
            <li>Max Temp: ${resultObj.main.temp_max}°</li>
            <li>Min Temp: ${resultObj.main.temp_min}°</li>
            <li>Wind Speed: ${resultObj.wind.speed}</li>
            <li>Humidity: ${resultObj.main.humidity} %</li>
          </ul>
        </div>
      </div>
    </div>
  </div>`;
    currentForecastEl.innerHTML = currentWeatherString;
}
function getCurrentSearchHistory() {
    var currentSearchHistory = localStorage.getItem('searchHistory')
    if (currentSearchHistory) {
        return JSON.parse(currentSearchHistory)
    }
    return [];
}
function renderHistory() {
    var currentSearchHistory = getCurrentSearchHistory();
    var historyString = "";
    for (let i = 0; i < currentSearchHistory.length; i++) {
        historyString +=
            `<li class="list-group-item">${currentSearchHistory[i]}</li>`;
    }
    searchHistoryListEl.innerHTML = historyString;
}
function renderFiveDayResults(resultObj) {
    var fiveDayForecastString = "";

    for (let i = 0; i < resultObj.list.length; i += 9) {

        fiveDayForecastString += `<div class="card" style="width: 18rem;">
        <img src="http://openweathermap.org/img/wn/${resultObj.list[i].weather[0].icon}@2x.png" class="card-img-top fiveDayImg" alt="${resultObj.list[i].weather[0].description}">
        <div class="card-body">
            <h4 class="card-title">${resultObj.list[i].dt_txt}</h4>
            <h5 class="text-center">${resultObj.list[i].main.temp}</h5>
          <ul class="card-text">
            <li>Max Temp: ${resultObj.list[i].main.temp_max}</li>
            <li>Min Temp: ${resultObj.list[i].main.temp_min}</li>
            <li>Wind Speed: ${resultObj.list[i].wind.speed}</li>
            <li>Humidity: ${resultObj.list[i].main.humidity} %</li>
          </ul>
        </div>
        <div class="card-footer row">
        </div>
      </div>`
    }
    fiveDayForecastEl.innerHTML = fiveDayForecastString;
}

function saveSearchtoLocalStorage(search) {
    var currentSearchHistory = localStorage.getItem("searchHistory");
    if (currentSearchHistory) {
        var currentSearchHistoryArray = JSON.parse(currentSearchHistory)
        currentSearchHistoryArray.push(search);
        localStorage.setItem("searchHistory", JSON.stringify(currentSearchHistoryArray))
    } else {
        localStorage.setItem("searchHistory", JSON.stringify([search]))
    }
}

function searchApi(city) {
    //imperial param is conversion to Farenheit measurement for temperature
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    // var latlonURL= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    // fetch response in JSON format
    fetch(forecastURL).then(function (response) {
        return response.json() //conversion of raw data
    }).then(function (data) {
        renderFiveDayResults(data);
        fetchCurrentWeather(data.city.coord.lat, data.city.coord.lon);
        renderHistory();
    })
}
function fetchCurrentWeather(lat, lon) {

    var coordinatesURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    // fetch response in JSON format
    fetch(coordinatesURL).then(function (response) {
        return response.json() //conversion of raw data
    }).then(function (data) {
        renderCurrentWeather(data);
    })
}
// search form event listener for submit
searchFormEl.addEventListener("submit", handleSearchFormSubmit);
searchHistoryListEl.addEventListener("click", function handleListClick(event) {
    //if the item you click is an li then target that item
    if (event.target.tagName === "LI") {
        searchApi(event.target.textContent);
    }
});
renderHistory();