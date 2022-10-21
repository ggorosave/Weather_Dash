// Variables
var searchInput = document.querySelector("#search-bar");
var displayCityName = document.querySelector("#city-name");
var displayCurrentDate = document.querySelector("#current-date");
var displayCurrentIcon = document.querySelector("#current-icon");
var displayCurrentTemp = document.querySelector("#current-temp");
var dispalyCurrentWind = document.querySelector("#current-wind");
var displayCurrentHumidity = document.querySelector("#current-humidity");
var searchedCities = document.querySelector("#searched-cities");
var weatherCard = document.querySelector("#weather-card");
var fiveDayForecast = document.querySelector("#five-day-forecast");
var forecastArticles = document.querySelector("#forecast-articles");

// Buttons
var searchBtn = document.querySelector("#submit-search");

// Loads saved city weather when button is clicked
function loadSavedCity() {
    var savedCityName = this.getAttribute("data-city");

    var cityData = JSON.parse(localStorage.getItem(savedCityName));

    var cityName = cityData.city;
    var latitude = cityData.lat;
    var longitude = cityData.lon;

    getWeatherData(cityName, latitude, longitude);
}


// Makes button when given a city name
function makeCityBtn(cityName) {

    var listEl = document.createElement("li");
    var newCityBtn = document.createElement("button");
    newCityBtn.textContent = cityName;
    newCityBtn.setAttribute("data-city", cityName);
    newCityBtn.setAttribute("class", "searched-city");

    listEl.appendChild(newCityBtn);


    searchedCities.appendChild(listEl);

    newCityBtn.addEventListener("click", loadSavedCity);
    // newCityBtn.onclick = loadSavedCity;
}

// Load buttons from local storage
function renderSavedCityBtns() {

    var savedCitiesArray = JSON.parse(localStorage.getItem("savedCities"));

    if (savedCitiesArray !== null) {
        for (i = 0; i < savedCitiesArray.length; i++) {
            var cityName = savedCitiesArray[i];

            // Calls the makeCityBtn function
            makeCityBtn(cityName);
        }

        return;
    }

    return;
}

// Gets weather data
function getWeatherData(cityName, latitude, longitude) {
    // Current weather API
    let currentWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=dccaaf9978beaec3114c89bccf494b96"

    // Five day forecast API
    let dailyForecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=fa0bb7828ffc93be39bba20ab19112d4"

    fetch(currentWeatherApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                let currentDate = dayjs.unix(data.dt).format("M/D/YYYY");
                let iconHref = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
                let currentTemp = data.main.temp;
                let currentWindSpeed = data.wind.speed;
                let currentHumidity = data.main.humidity;

                // Reveals weathercard
                weatherCard.classList.remove("hidden");

                // Displays data on website
                displayCityName.textContent = cityName;
                displayCurrentDate.textContent = currentDate;
                displayCurrentIcon.setAttribute("src", iconHref);
                displayCurrentTemp.textContent = currentTemp;
                dispalyCurrentWind.textContent = currentWindSpeed;
                displayCurrentHumidity.textContent = currentHumidity;

                return;
            })

            return;
        }
    })

    // Add functionality to fetch 5 day forecast
    fetch(dailyForecastApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                // Reveals forecast
                fiveDayForecast.classList.remove("hidden");

                // Resets five day forecast
                forecastArticles.textContent = " ";


                               
                // Iterates through the data, sets variables for important data, then dynamically displays them on screen
                for (i = 0; i < data.list.length; i += 8) {

                    // Sets variables for imporatant data
                    let newDataDate = dayjs.unix(data.list[i].dt).format("M/D/YYYY");
                    let newDataIcon = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png";
                    let newDataTemp = data.list[i].main.temp;
                    let newDataWind = data.list[i].wind.speed;
                    let newDataHumidity = data.list[i].main.humidity;

                    // Creates new elements
                    let newArticle = document.createElement("article");
                    let newDate = document.createElement("h4");
                    let newImg = document.createElement("img");
                    let newTemp = document.createElement("p");
                    let newWind = document.createElement("p");
                    let newHumid = document.createElement("p");

                    // Sets the content of new elements
                    newDate.textContent = newDataDate;
                    newImg.setAttribute("src", newDataIcon);
                    newTemp.textContent = "Temp: " + newDataTemp + "\u00B0" + "F";
                    newWind.textContent = "Wind: " + newDataWind + "MPH";
                    newHumid.textContent = "Humidity: " + newDataHumidity + "%";

                    // Renders new elements on the screen
                    newArticle.appendChild(newDate);
                    newArticle.appendChild(newImg);
                    newArticle.appendChild(newTemp);
                    newArticle.appendChild(newWind);
                    newArticle.appendChild(newHumid);
                    forecastArticles.appendChild(newArticle);
                }

                return;
            })

            return;
        }
    })
}

function fetchGeoCode(geoCodeUrl) {

    fetch(geoCodeUrl).then(function (response) {

        if (response.ok) {
            response.json().then(function (data) {

                // Sets cityName latitude can longitude
                var cityName = data[0].name;
                var latitude = data[0].lat;
                var longitude = data[0].lon;

                // Saves info to local storage
                var saveCity = {
                    city: cityName,
                    lat: latitude,
                    lon: longitude,
                }

                // Saves to local storage under city name for the renderSavedCityBtns function
                localStorage.setItem(cityName, JSON.stringify(saveCity));

                // Looks for savedCities in local storage and makes it a variable
                var savedCitiesArray = JSON.parse(localStorage.getItem("savedCities"));

                // If savedCities is not there, then it is created
                if (savedCitiesArray === null) {
                    savedCitiesArray = [];
                    savedCitiesArray.push(cityName);
                    localStorage.setItem("savedCities", JSON.stringify(savedCitiesArray));
                } else {
                    // If saved cities does exist, the new city name is pushed into the array and it is loaded back into local storage
                    savedCitiesArray.push(cityName);
                    localStorage.setItem("savedCities", JSON.stringify(savedCitiesArray));
                }

                //Calls the makeCityBtn function 
                makeCityBtn(cityName);

                // Calls getWeatherData
                getWeatherData(cityName, latitude, longitude);
                return;
            });
        };
    });
}

// Gets latitude and longitude of city
function getGeoCode(cityName, countryCode, stateCode) {
    // Checks if search includes a country or state code
    if (!countryCode && !stateCode) {

        let geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=61ff8fcb75c80026b172fc1f8cb3672f"

        // Calls function that fetches geocode API
        fetchGeoCode(geoCodeUrl);
        return;
    }

    // Runs if user input a city and a country code only
    if (!stateCode) {

        let geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + countryCode + "&limit=5&appid=61ff8fcb75c80026b172fc1f8cb3672f"

        fetchGeoCode(geoCodeUrl);
        return;
    }

    // Runs if user input city, state, and country
    let geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + stateCode + ",US&limit=5&appid=61ff8fcb75c80026b172fc1f8cb3672f"

    fetchGeoCode(geoCodeUrl);
    return;
};

// Gets inputs from search
function searchHandler(event) {
    event.preventDefault();
    var searchArray = searchInput.value.split(",");

    // Checks if the user input a state and/or country code
    if (searchArray.length > 1) {

        // Checks if user put in state and country
        if (searchArray.length > 2) {
            var cityName = searchArray[0].trim();
            var stateCode = searchArray[1].trim();
            var countryCode = searchArray[2].trim();


            // Call getGeoCode
            getGeoCode(cityName, countryCode, stateCode);
            return;
        }



        // Runs if user did not input state
        var cityName = searchArray[0].trim();
        var countryCode = searchArray[1].trim();

        // Call getGeoCode
        getGeoCode(cityName, countryCode);

        return;
    }

    var cityName = searchArray[0].trim();

    // Call getGeoCode
    getGeoCode(cityName);
    return;

};

renderSavedCityBtns();

// Event Listener
searchBtn.addEventListener("click", searchHandler); 