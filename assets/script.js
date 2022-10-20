// Variables
var searchInput = document.querySelector("#search-bar");

// Buttons
var searchBtn = document.querySelector("#submit-search");

// for current day
console.log(dayjs().format("M/D/YYYY"))

// for future days
console.log(dayjs().add(1, "d").format("M/D/YYYY"))

// Gets weather data
function getWeatherData(latitude, longitude) {
    let currentWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=dccaaf9978beaec3114c89bccf494b96"

    fetch(currentWeatherApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                console.log(data);
                var currentDate = dayjs().format("M/D/YYYY");
                var iconHref = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
                var temp = data.main.temp;
                var windSpeed = data.wind.speed;
                var humidity = data.main.humidity;

                console.log("Today: " + currentDate);
                console.log("icon: " + iconHref);
                console.log("temperature: " + temp);
                console.log("wind speed: " + windSpeed);
                console.log("humidity: " + humidity);

                // START HERE
                // Add functionality to display data on website
                // Add functionality to save data to local storage
            })
        }
    })

    // Add functionality to fetch 5 day forecast
}

function fetchGeoCode(geoCodeUrl) {

    fetch(geoCodeUrl).then(function (response) {

        if (response.ok) {
            response.json().then(function (data) {

                // Sets latitude can longitude
                console.log(data[0].lat);
                console.log(data[0].lon);
                var latitude = data[0].lat;
                var longitude = data[0].lon;

                // Calls getWeatherData
                getWeatherData(latitude, longitude);
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


// Event Listener
searchBtn.addEventListener("click", searchHandler);