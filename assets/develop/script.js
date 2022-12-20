var resultContentEl = document.querySelector("#result-content");
var searchFormEl = document.querySelector("#formCitySearch");
var textInputCity = document.querySelector("#citySearchInput");
var fiveDayForecastEl = document.querySelector("#fiveDayForecast");
var currentForecastEl = document.querySelector("#currentForecastCard");

// var geocodeURL= `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=${limit}&appid=${apiKey}`;



var apiKey = '70da03e4a9cd76080662380bedafe8c5';
function getWeatherData() { }
function handleSearchFormSubmit(event) {
    event.preventDefault();
    // get value from search input
    var searchInput = textInputCity.value;
    console.log(searchInput);
    // conditional statement to catch user error
    if (searchInput == "") {
        alert("Text has not been filled. Please fill in text area with a city name to search.");
    } else{
        searchApi(searchInput);
    }
}
// search form event listener for submit
searchFormEl.addEventListener("submit", handleSearchFormSubmit);
function getParams() {
    // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
    var query = document.querySelector("#search-input").value;
    var format = document.querySelector("#format-input").value;
    // Get the query value

    //pass the query and format values to the searchApi function
    searchApi(query, format);
}
function renderCurrentWeather(resultObj){
    console.log(resultObj);
    var currentWeatherString = "";
        currentWeatherString += `<div class="card mb-3" style="max-width: 540px;">
    <div class="row g-0">
      <div class="col-md-4">
      <img src="http://openweathermap.org/img/wn/${resultObj.weather[0].icon}@2x.png"class="img-fluid rounded-start" alt="${resultObj.weather.icon}">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">Current Weather in ${resultObj.name}</h5>
          <ul class="card-text">
            <li>Max Temp: ${resultObj.main.temp_max}</li>
            <li>Min Temp: ${resultObj.main.temp_min}</li>
            <li>Wind Speed: ${resultObj.wind.speed}</li>
            <li>Humidity: ${resultObj.main.humidity} %</li>
          </ul>
        </div>
      </div>
    </div>
  </div>`;
  currentForecastEl.innerHTML = currentWeatherString;
}
function renderFiveDayResults(resultObj) {
    console.log(resultObj);
    var fiveDayForecastString = "";

    for (let i = 0; i < resultObj.list.length; i+=9) {

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
          <small class="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>`
    }
    console.log(fiveDayForecastString);
    fiveDayForecastEl.innerHTML = fiveDayForecastString;
    // TODO: create a link button to 'Read More'

    // TODO: append the elements to the card body `<div>`

    // TODO: append the card body to the full results `<div>`
}

function searchApi(city) {
    //imperial param is conversion to Farenheit measurement for temperature
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    // var latlonURL= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    // fetch response in JSON format
    fetch(forecastURL).then(function (response) {
        return response.json() //conversion of raw data
    }).then(function (data) {
        console.log(data);
        renderFiveDayResults(data);
        fetchCurrentWeather(data.city.coord.lat,data.city.coord.lon)
    })
}
function fetchCurrentWeather(lat, lon){    

    var coordinatesURL= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    // fetch response in JSON format
    fetch(coordinatesURL).then(function (response) {
        return response.json() //conversion of raw data
    }).then(function (data) {
        console.log(data);
        renderCurrentWeather(data);
    })

}

