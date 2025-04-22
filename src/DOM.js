import  {getErrorText, processWeatherData} from "./api-functions.js" 
import { format } from "date-fns";

const errorTextDiv = document.querySelector(".error-text")
// search components
const search = document.querySelector(".search");
const searchBtn = document.querySelector(".search.btn");
const form = document.querySelector(".form")
// today block
const location = document.querySelector(".location");
const todayTemp = document.querySelector(".temp-now");
const todayTempMax = document.querySelector(".temp-max");
const todayTempMin = document.querySelector(".temp-min");
const todayTempFeel = document.querySelector(".temp-feel");
const todayDescription = document.querySelector(".description");
const todayWind = document.querySelector(".wind");
const todayUV = document.querySelector(".uv");
const pressure = document.querySelector(".pressure");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
// hourly forecast
const carouselFrame = document.querySelector(".today-carousel");
const carousel = document.querySelector(".carousel-items");
const prevBtn = document.querySelector(".prev.btn");
const nextBtn = document.querySelector(".next.btn");

const forecastBlock = document.querySelector(".forecast-block");

function formatTime(timeToFormat){
    const time = timeToFormat;
    return time.slice(0, 5)
}

function loadTodayData(data){
    const todayData = data.today;
    const locationData = data.address;
    location.textContent=locationData;
    todayTemp.textContent =  todayData.temp;
    todayTempMax.textContent =  todayData.maxTemp;
    todayTempMin.textContent =  todayData.minTemp;
    todayTempFeel.textContent =  todayData.tempFeel;
    todayDescription.textContent =  todayData.description;
    todayWind.textContent =  todayData.windSpeed;
    todayUV.textContent =  todayData.uvindex;
    pressure.textContent = todayData.pressure;
    sunrise.textContent = formatTime(todayData.sunrise);
    sunset.textContent = formatTime(todayData.sunset);
}
function loadHourlyData(data){
    const hoursData = data.hours;
    console.log(hoursData)
    hoursData.forEach(hour =>{
        const hourBlock = document.createElement("div");
        hourBlock.classList.add("hour-block");
        const hourP = document.createElement("p");
        hourP.classList.add("hour");
        hourP.textContent = formatTime(hour.time);
        const hourIcon = document.createElement("img");
        hourIcon.classList.add("hour-icon", "svg");
        // hourIcon.src= hour.icon;
        const hourTemp = document.createElement("p");
        hourTemp.classList.add("hour");
        hourTemp.textContent = hour.temp;
        hourBlock.append(hourP, hourIcon, hourTemp)
        carousel.append(hourBlock)
    })
}
function loadForecast(data){
    const forecast = data.forecast;
    forecast.forEach(day=>{
        const dayRow = document.createElement("div");
        dayRow.classList.add("day-row");
        const dayContainer = document.createElement("div");
        dayContainer.classList.add("day-container");
        const dayName = document.createElement("span");
        dayName.classList.add("day-name");
        dayName.textContent = format(day.date, "E")+", ";
        const dayDate = document.createElement("span");
        dayDate.classList.add("day-date");
        dayDate.textContent = format(day.date, "dd.MM");
        dayContainer.append(dayName, dayDate)
        const windContainer = document.createElement("div");
        windContainer.classList.add("wind-container");
        const windIcon = document.createElement("img");
        windIcon.classList.add("wind-icon", "svg");
        //  windIcon.src= hour.icon;
        const wind = document.createElement("p");
        wind.classList.add("wind-speed");
        wind.textContent = day.windSpeed;
        windContainer.append(windIcon, wind)
        const weatherIcon = document.createElement("img");
        weatherIcon.classList.add("weather-icon", "svg");
        //  weatherIcon.src= day.icon;
        const tempContainer = document.createElement("div");
        tempContainer.classList.add("temp-container");
        const maxTemp = document.createElement("p");
        maxTemp.classList.add("day-temp");
        maxTemp.textContent = day.maxTemp;
        const minTemp = document.createElement("p");
        minTemp.classList.add("day-temp");
        minTemp.textContent = day.minTemp;
        tempContainer.append(minTemp, maxTemp)
        dayRow.append(dayContainer, windContainer, tempContainer)
        forecastBlock.append(dayRow)
    })
}

function getLocation(){
    return search.value.toLowerCase();
}

async function processClick(){
    const locationToSearch = true;
    // const locationToSearch = getLocation();
    if(locationToSearch!==""){  
        console.log(locationToSearch)
        const data = await processWeatherData(locationToSearch);
        if (data){
        console.log(data)
        errorTextDiv.textContent = "";
        loadTodayData(data);
        loadHourlyData(data);
        loadForecast(data);
        } else {
            const errorText = getErrorText();
            errorTextDiv.textContent = errorText
        }
    } 
}


form.addEventListener("submit", function(event) {
    event.preventDefault();
    processClick();
});
searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
        processClick();
    });

export {getLocation}