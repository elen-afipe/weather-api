import  {getErrorText, processWeatherData} from "./api-functions.js" 
import { format } from "date-fns";
import WindSVG from "./assets/icons/wind.svg";
import "./carousel.js"

import SNOW from './assets/weather-icons/SNOW.svg';
import SNOW0 from './assets/weather-icons/SNOW0.svg';
import SNOW1 from './assets/weather-icons/SNOW1.svg';
import TSTORM from './assets/weather-icons/TSTORM.svg';
import TSHOWER0 from './assets/weather-icons/TSHOWER0.svg';
import TSHOWER1 from './assets/weather-icons/TSHOWER1.svg';
import RAIN from './assets/weather-icons/RAIN.svg';
import RAIN0 from './assets/weather-icons/RAIN0.svg';
import RAIN1 from './assets/weather-icons/RAIN1.svg';
import SHOWER0 from './assets/weather-icons/SHOWER0.svg';
import SHOWER1 from './assets/weather-icons/SHOWER1.svg';
import FOG from './assets/weather-icons/FOG.svg';
import FOG0 from './assets/weather-icons/FOG0.svg';
import FOG1 from './assets/weather-icons/FOG1.svg';
import WINDY from './assets/weather-icons/WINDY.svg';
import MCLOUDY from './assets/weather-icons/MCLOUDY.svg';
import MCLOUDY0 from './assets/weather-icons/MCLOUDY0.svg';
import MCLOUDY1 from './assets/weather-icons/MCLOUDY1.svg';
import PCLOUDY0 from './assets/weather-icons/PCLOUDY0.svg';
import PCLOUDY1 from './assets/weather-icons/PCLOUDY1.svg';
import CLEAR0 from './assets/weather-icons/CLEAR0.svg';
import CLEAR1 from './assets/weather-icons/CLEAR1.svg';
import LSNOW0 from './assets/weather-icons/LSNOW0.svg';
import LSNOW1 from './assets/weather-icons/LSNOW1.svg';
import UNKNOWN from './assets/weather-icons/UNKNOWN.svg';

import SNOW_IMG from './assets/photos/snow.jpg';
import SNOW_SHOWERS_DAY from './assets/photos/snow-showers-d.jpg';
import SNOW_SHOWERS_NIGHT from './assets/photos/snow-showers-n.jpg';
import THUNDER_RAIN from './assets/photos/thunder-rain.jpg';
import THUNDER_SHOWERS_DAY from './assets/photos/thunder-showers-d.jpg';
import THUNDER_SHOWERS_NIGHT from './assets/photos/thunder-showers-n.jpg';
import RAIN_IMG from './assets/photos/rain.jpg';
import SHOWERS_DAY from './assets/photos/showers-d.jpg';
import SHOWERS_NIGHT from './assets/photos/showers-n.jpg';
import FOG_IMG from './assets/photos/fog.jpg';
import WIND_IMG from './assets/photos/wind.jpg';
import CLOUDY_IMG from './assets/photos/cloudy.jpg';
import PARTLY_CLOUDY_DAY from './assets/photos/partly-cloudy-d.jpg';
import PARTLY_CLOUDY_NIGHT from './assets/photos/partly-cloudy-n.jpg';
import CLEAR_DAY from './assets/photos/clear-d.jpg';
import CLEAR_NIGHT from './assets/photos/clear-sky-n.jpg';
import DEFAULT_IMG from './assets/photos/cloudy.jpg';


const errorTextDiv = document.querySelector(".error-text")
// search components
const search = document.querySelector(".search");
const searchBtn = document.querySelector(".search.btn");
const form = document.querySelector(".form")

const toggleUnitBtn = document.querySelector(".toggle-btn")
const toggleContainer = document.querySelector(".toggle-container")
// today block
const forecastContainer = document.querySelector(".forecast");
const todayImg = document.querySelector(".today-image");
const todayIcon = document.querySelector(".today-icon")
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

const carousel = document.querySelector(".carousel-items");

const forecastBlock = document.querySelector(".forecast-block");
forecastContainer.classList.add("hidden");

let units = "C";
let data = false;

function formatTemp(temp){
    return Math.round(temp) + "°"
}

function formatTime(timeToFormat){
    const time = timeToFormat;
    return time.slice(0, 5)
}

function getTemp(temp){
    if(units==="C"){
        return formatTemp(temp)
    } else {
        const UStemp = (temp* 9/5) + 32; 
       return formatTemp(UStemp)
    }
}
function getWind(wind){
    if(units==="C"){
        return wind + " km/h";
    } else {
        const USwind = Math.round((wind*0.621371) * 10)/10; 
        return USwind + " mph"
    }
}

function getWeatherIcon(iconData) {
    const iconMap = {
      "snow": SNOW,
      "snow-showers-day": LSNOW1,
      "snow-showers-night": LSNOW0,
      "thunder-rain": TSTORM,
      "thunder-showers-day": TSHOWER1,
      "thunder-showers-night": TSHOWER0,
      "rain": RAIN,
      "showers-day": SHOWER1,
      "showers-night": SHOWER0,
      "fog": FOG,
      "wind": WINDY,
      "cloudy": MCLOUDY,
      "partly-cloudy-day": PCLOUDY1,
      "partly-cloudy-night": PCLOUDY0,
      "clear-day": CLEAR1,
      "clear-night": CLEAR0
    };
    return iconMap[iconData] || UNKNOWN;
  }

  function getWeatherPhotoPath(iconData) {
    const iconToPhotoMap = {
      'snow': SNOW_IMG,
      'snow-showers-day': SNOW_SHOWERS_DAY,
      'snow-showers-night': SNOW_SHOWERS_NIGHT,
      'thunder-rain': THUNDER_RAIN,
      'thunder-showers-day': THUNDER_SHOWERS_DAY,
      'thunder-showers-night': THUNDER_SHOWERS_NIGHT,
      'rain': RAIN_IMG,
      'showers-day': SHOWERS_DAY,
      'showers-night': SHOWERS_NIGHT,
      'fog': FOG_IMG,
      'wind': WIND_IMG,
      'cloudy': CLOUDY_IMG,
      'partly-cloudy-day': PARTLY_CLOUDY_DAY,
      'partly-cloudy-night': PARTLY_CLOUDY_NIGHT,
      'clear-day': CLEAR_DAY,
      'clear-night': CLEAR_NIGHT
    };
    return iconToPhotoMap[iconData] || DEFAULT_IMG;
  }
  

function loadTodayData(data){
    const todayData = data.today;
    todayImg.src=getWeatherPhotoPath(todayData.icon);
    todayIcon.src=getWeatherIcon(todayData.icon);
    const locationData = data.address;
    location.textContent=locationData;
    todayTemp.textContent =  getTemp(todayData.temp);
    todayTempMax.textContent =  getTemp(todayData.maxTemp);
    todayTempMin.textContent =  getTemp(todayData.minTemp);
    todayTempFeel.textContent =  getTemp(todayData.tempFeel)+".";
    todayDescription.textContent =  todayData.description;
    todayWind.textContent =  getWind(todayData.windSpeed);
    todayUV.textContent =  todayData.uvindex;
    pressure.textContent = todayData.pressure + " mb";
    sunrise.textContent = formatTime(todayData.sunrise);
    sunset.textContent = formatTime(todayData.sunset);
}
function loadHourlyData(data){
    const hoursData = data.hours;
    carousel.innerHTML="";
    console.log(hoursData)
    hoursData.forEach(hour =>{
        const hourBlock = document.createElement("div");
        hourBlock.classList.add("hour-block");
        const hourP = document.createElement("p");
        hourP.classList.add("hour");
        hourP.textContent = formatTime(hour.time);
        const hourIcon = document.createElement("img");
        hourIcon.classList.add("hour-icon", "svg");
        hourIcon.src=getWeatherIcon(hour.icon);
        const hourTemp = document.createElement("p");
        hourTemp.classList.add("hour-temp");
        hourTemp.textContent = getTemp(hour.temp);
        hourBlock.append(hourP, hourIcon, hourTemp)
        carousel.append(hourBlock)
    })
}
function loadForecast(data){
    const forecast = data.forecast;
    forecastBlock.innerHTML = "";
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
        windIcon.src= WindSVG;
        const wind = document.createElement("p");
        wind.classList.add("wind-speed");
        wind.textContent = getWind(day.windSpeed);
        windContainer.append(windIcon, wind)
        const weatherIcon = document.createElement("img");
        weatherIcon.classList.add("weather-icon", "svg");
         weatherIcon.src= getWeatherIcon(day.icon);
        const tempContainer = document.createElement("div");
        tempContainer.classList.add("temp-container");
        const maxTemp = document.createElement("p");
        maxTemp.classList.add("day-temp");
        maxTemp.textContent = getTemp(day.maxTemp);
        const minTemp = document.createElement("p");
        minTemp.classList.add("day-temp");
        minTemp.textContent = getTemp(day.minTemp);
        tempContainer.append(maxTemp, minTemp)
        dayRow.append(dayContainer, weatherIcon, tempContainer, windContainer)
        forecastBlock.append(dayRow)
    })
}

function changeUnits(){
    units = (units === "C") ? "F" : "C"
}

function updateUnitValues(data){
    if (data){
    errorTextDiv.textContent = "";
    loadTodayData(data);
    loadHourlyData(data);
    loadForecast(data);
    } else {
        const errorText = getErrorText();
        forecastContainer.classList.add("hidden");
        errorTextDiv.textContent = errorText
    }
}


function getLocation(){
    return search.value.toLowerCase();
}

async function processClick(){
    // const locationToSearch = true;
    const locationToSearch = getLocation();
    if(locationToSearch!==""){  
        console.log(locationToSearch)
        data = await processWeatherData(locationToSearch);
        if (data){
        console.log(data)
        errorTextDiv.textContent = "";
        forecastContainer.classList.remove("hidden");
        loadTodayData(data);
        loadHourlyData(data);
        loadForecast(data);
        } else {
            const errorText = getErrorText();
            forecastContainer.classList.add("hidden");
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

toggleContainer.addEventListener("click", ()=>{
    toggleUnitBtn.classList.toggle('active')
    changeUnits();
    updateUnitValues(data);
}) 
export {getLocation}