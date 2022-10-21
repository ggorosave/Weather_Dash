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

// Buttons
var searchBtn = document.querySelector("#submit-search");


// for current day
console.log(dayjs().format("M/D/YYYY"))

// for future days
console.log(dayjs().add(1, "d").format("M/D/YYYY"))

// here

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
    let currentWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=dccaaf9978beaec3114c89bccf494b96"

    fetch(currentWeatherApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                console.log(data);
                var currentDate = dayjs().format("M/D/YYYY");
                var iconHref = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
                var currentTemp = data.main.temp;
                var currentWindSpeed = data.wind.speed;
                var currentHumidity = data.main.humidity;

                console.log("City: " + cityName)
                console.log("Today: " + currentDate);
                console.log("icon: " + iconHref);
                console.log("temperature: " + currentTemp);
                console.log("wind speed: " + currentWindSpeed);
                console.log("humidity: " + currentHumidity);

                // Reveals weathercard
                weatherCard.classList.remove("hidden");

                // Displays data on website
                displayCityName.textContent = cityName;
                displayCurrentDate.textContent = currentDate;
                displayCurrentIcon.setAttribute("src", iconHref);
                displayCurrentTemp.textContent = currentTemp;
                dispalyCurrentWind.textContent = currentWindSpeed;
                displayCurrentHumidity.textContent = currentHumidity;
            })
        }
    })

    // Add functionality to fetch 5 day forecast
}

function fetchGeoCode(geoCodeUrl) {

    fetch(geoCodeUrl).then(function (response) {

        if (response.ok) {
            response.json().then(function (data) {

                // DELETE
                console.log("--Geo Data--");
                console.log(data);
                console.log(data[0].lat);
                console.log(data[0].lon);

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
            });
        };
    });
}

// Gets latitude and longitude of city
function getGeoCode(cityName, countryCode, stateCode) {
    // Checks if search includes a country or state code
    if (!countryCode && !stateCode) {

        // DELETE
        console.log(cityName);

        let geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=61ff8fcb75c80026b172fc1f8cb3672f"

        // Calls function that fetches geocode API
        fetchGeoCode(geoCodeUrl);
        return;
    }

    // Runs if user input a city and a country code only
    if (!stateCode) {

        // DELETE 
        console.log(cityName + ", " + countryCode);

        let geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + countryCode + "&limit=5&appid=61ff8fcb75c80026b172fc1f8cb3672f"

        fetchGeoCode(geoCodeUrl);
        return;
    }

    // Runs if user input city, state, and country

    // DELETE
    console.log(cityName + ", " + stateCode);

    let geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + stateCode + ",US&limit=5&appid=61ff8fcb75c80026b172fc1f8cb3672f"

    fetchGeoCode(geoCodeUrl);
    return;
};

// Gets inputs from search
function searchHandler(event) {
    event.preventDefault();
    var searchArray = searchInput.value.split(",");
    // DELETE
    console.log(searchArray);

    // Checks if the user input a state and/or country code
    if (searchArray.length > 1) {

        // Checks if user put in state and country
        if (searchArray.length > 2) {
            var cityName = searchArray[0].trim();
            var stateCode = searchArray[1].trim();
            var countryCode = searchArray[2].trim();

            console.log("--Three Inputs--");

            // Call getGeoCode
            getGeoCode(cityName, countryCode, stateCode);
            // set values to local storage
            // create button from local storage

            return;
        }



        // Runs if user did not input state
        var cityName = searchArray[0].trim();
        var countryCode = searchArray[1].trim();

        console.log("--Both Inputs--");

        // Call getGeoCode
        getGeoCode(cityName, countryCode);
        // set values to local storage
        // create button from local storage
        return;
    }

    var cityName = searchArray[0].trim();

    console.log("--Only City--");
    // Call getGeoCode
    getGeoCode(cityName);
    // set values to local storage
    // create button from local storage
    return;

};

renderSavedCityBtns();

// Event Listener
searchBtn.addEventListener("click", searchHandler);