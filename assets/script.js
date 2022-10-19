// Variables
var searchInput = document.querySelector("#search-bar");

// Buttons
var searchBtn = document.querySelector("#submit-search");

// Example of split
var string = "Tucson, AZ"
var stringArray = string.split(",");
console.log(stringArray);

// Gets latitude and longitude of city
function getGeoCode(cityName, countryCode, stateCode) {
    // Checks if search includes a country or state code
    if (!countryCode && !stateCode) {

        let geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=61ff8fcb75c80026b172fc1f8cb3672f"

        fetch(geoCodeUrl).then(function (response) {

            // console.log(response.json());
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(cityName);

                    console.log(data);
                    console.log(data[0].lat);
                    console.log(data[0].lon);
                });
            };
        });

        return;
    }

    // Runs if user input a city and a country code only
    if (!stateCode) {

        let geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + countryCode + "&limit=5&appid=61ff8fcb75c80026b172fc1f8cb3672f"

        fetch(geoCodeUrl).then(function (response) {

            // console.log(response.json());
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(cityName + ", " + countryCode);
                    console.log(data);
                    console.log(data[0].lat);
                    console.log(data[0].lon);

                    return;
                });
            };
        });

        return;
    }

    // Runs if user input city, state, and country
    let geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + stateCode + ",US&limit=5&appid=61ff8fcb75c80026b172fc1f8cb3672f"

    fetch(geoCodeUrl).then(function (response) {

        // console.log(response.json());
        if (response.ok) {
            response.json().then(function (data) {
                console.log(cityName + ", " + stateCode);
                console.log(data);
                console.log(data[0].lat);
                console.log(data[0].lon);

                return;
            });
        };
    });

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