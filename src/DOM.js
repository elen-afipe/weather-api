import  {getErrorText, processWeatherData} from "./api-functions.js" 
import { format } from "date-fns";
import WindSVG from "./assets/icons/wind.svg";
import "./carousel.js"

import SNOW from './assets/weather-icons/SNOW.svg';
import TSTORM from './assets/weather-icons/TSTORM.svg';
import TSHOWER0 from './assets/weather-icons/TSHOWER0.svg';
import TSHOWER1 from './assets/weather-icons/TSHOWER1.svg';
import RAIN from './assets/weather-icons/RAIN.svg';
import SHOWER0 from './assets/weather-icons/SHOWER0.svg';
import SHOWER1 from './assets/weather-icons/SHOWER1.svg';
import FOG from './assets/weather-icons/FOG.svg';
import WINDY from './assets/weather-icons/WINDY.svg';
import MCLOUDY from './assets/weather-icons/MCLOUDY.svg';
import PCLOUDY0 from './assets/weather-icons/PCLOUDY0.svg';
import PCLOUDY1 from './assets/weather-icons/PCLOUDY1.svg';
import CLEAR0 from './assets/weather-icons/CLEAR0.svg';
import CLEAR1 from './assets/weather-icons/CLEAR1.svg';
import LSNOW0 from './assets/weather-icons/LSNOW0.svg';
import LSNOW1 from './assets/weather-icons/LSNOW1.svg';
import UNKNOWN from './assets/weather-icons/UNKNOWN.svg';

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

const loading = document.createElement("div");
loading.classList.add("loader");

let units = "C";
let data = false;
let locationToSearch;

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

  async function getWeatherPhoto(iconData) {
    const iconToPhotoMap = {
    'snow': 'snow.jpg',
    'snow-showers-day': 'snow-showers-d.jpg',
    'snow-showers-night': 'snow-showers-n.jpg',
    'thunder-rain': 'thunder-rain.jpg',
    'thunder-showers-day': 'thunder-showers-d.jpg',
    'thunder-showers-night': 'thunder-showers-n.jpg',
    'rain': 'rain.jpg',
    'showers-day': 'showers-d.jpg',
    'showers-night': 'showers-n.jpg',
    'fog': 'fog.jpg',
    'wind': 'wind.jpg',
    'cloudy': 'cloudy.jpg',
    'partly-cloudy-day': 'partly-cloudy-d.jpg',
    'partly-cloudy-night': 'partly-cloudy-n.jpg',
    'clear-day': 'clear-d.jpg',
    'clear-night': 'clear-sky-n.jpg'
    };
    const filePath = iconToPhotoMap[iconData];
    try {
        const module = await import(/* webpackChunkName: "weather-photo" */ `./assets/photos/${filePath}`);
        return module.default;
      } catch (error) {
        console.error(`Failed to load image for ${iconData}:`, error);
        return DEFAULT_IMG; 
      }
    }
  

async function loadTodayData(data){
    const todayData = data.today;
    todayImg.src= await getWeatherPhoto(todayData.icon);
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
    const locationToSearch = getLocation();
    if(locationToSearch!==""){  
        localStorage.setItem("location", locationToSearch);
        errorTextDiv.textContent="";
        errorTextDiv.appendChild(loading)
        data = await processWeatherData(locationToSearch);
        if (data){
        errorTextDiv.removeChild(loading);
        errorTextDiv.textContent = "";
        forecastContainer.classList.remove("hidden");
        await loadTodayData(data);
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

function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        storage &&
        storage.length !== 0
      );
    }
  }

if(storageAvailable("localStorage")){
    locationToSearch = localStorage.getItem("location", locationToSearch);
    if(locationToSearch === null){
        locationToSearch = "london"
        localStorage.setItem("location", locationToSearch);
    }
}else{
    locationToSearch = "london"
}
data = await processWeatherData(locationToSearch);
        errorTextDiv.appendChild(loading)
        if (data){
        errorTextDiv.removeChild(loading);
        errorTextDiv.textContent = "";
        forecastContainer.classList.remove("hidden");
        await loadTodayData(data);
        loadHourlyData(data);
        loadForecast(data);
        } else {
            const errorText = getErrorText();
            forecastContainer.classList.add("hidden");
            errorTextDiv.textContent = errorText
        }