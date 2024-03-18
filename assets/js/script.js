var lastSearched = ""
var searchHistory = []
    

var getCityWeather = function(city) {
var callAPI = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=a901c56b8278bcb5eeb5e5b716eb8fbb&units=imperial";

    fetch(callAPI)
       
    .then(function(response) {

        if (response.ok) {response.json().then(function(data) {weatherDisplay(data);});

        } else {alert("Error: " + response.statusText);}})  

        .catch(function(error) {alert("Error connecting to OpenWeather");})
    };

var searchHandler = function(event) {
    
    event.preventDefault();

    var theCity = $("#thecity").val().trim();

    if(theCity) {
        
    getCityWeather(theCity);

    $("#thecity").val("");

    } else {
        alert("Please Enter A City of Choice");
    }
};

var weatherDisplay = function(weatherData) {

    $("#main-city-name").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM-D-YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);
    $("#main-city-temp").text("Temperature: " + weatherData.main.temp.toFixed(1) + "°F");
    $("#main-city-humid").text("Humidity: " + weatherData.main.humidity + "%"); 
    $("#main-city-wind").text("Wind Speeds: " + weatherData.wind.speed.toFixed(1) + " mph");

    fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon="+ weatherData.coord.lon + "&appid=7625ef1742f636a13458c7866275f60a")
    
    .then(function(response) {
            response.json().then(function(data) {

    $("#uv-box").text(data.value);

    if(data.value >= 11) {
        $("#uv-box").css("background-color", "green")
    } else if (data.value < 11 && data.value >= 8) {
        $("#uv-box").css("background-color", "#yellow")
    } else if (data.value < 8 && data.value >= 6) {
        $("#uv-box").css("background-color", "blue")
    } else if (data.value < 6 && data.value >= 3) {
        $("#uv-box").css("background-color", "red")
    } else {
        $("#uv-box").css("background-color", "purple")
    }      
         })
    });

    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=a901c56b8278bcb5eeb5e5b716eb8fbb&units=imperial")

    .then(function(response) {
        response.json().then(function(data) {

    $("#five-day").empty();

    for(i = 7; i <= data.list.length; i += 8){

    var fiveDayCard =`
        <div class="col-md-2 card text-white bg-dark">
            <div class="card-body p-1">
                <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM-DD-YYYY") + `</h5>
                <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">
                <p class="card-text">Temp: ` + data.list[i].main.temp + `</p>
                <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
            </div>
        </div>
        `;

            $("#five-day").append(fiveDayCard);
        }
    })
});

    lastSearched = weatherData.name;

    saveSearchHistory(weatherData.name);
    
};

var saveSearchHistory = function (city) {
    if(!searchHistory.includes(city)){
        searchHistory.push(city);
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>")
    } 

    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));

    localStorage.setItem("lastSearched", JSON.stringify(lastSearched));
    loadSearchHistory();
};

var loadSearchHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    lastSearched = JSON.parse(localStorage.getItem("lastSearched"));
  
    if (!searchHistory) {
        searchHistory = []
    }

    if (!lastSearched) {
        lastSearched = ""
    }

    $("#search-history").empty();

    for(i = 0 ; i < searchHistory.length ;i++) {

        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + searchHistory[i] + "'>" + searchHistory[i] + "</a>");
    }
  };

loadSearchHistory();

if (lastSearched != ""){
    getCityWeather(lastSearched);
}
$("#search-form").submit(searchHandler);
$("#search-history").on("click", function(event){
    var lastCity = $(event.target).closest("a").attr("id");
    getCityWeather(lastCity);
});