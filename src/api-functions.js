import { format } from "date-fns";
const linkPart =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
const keyPart =
  "?unitGroup=metric&iconSet=icons2&key=3T6PD9Z93CTPRSXWNXQA9QAA3&include=days,hours";
let errorText;

function getErrorText() {
  return errorText;
}

async function getWeatherData(location) {
  try {
    const locationPart = location;
    const url = linkPart + locationPart + keyPart;
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error(response.status);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (Number(error.message) === 401) {
      errorText = `Oops! There is a problem with the API key, account or subscription`;
    } else if (Number(error.message) < 429) {
      errorText = `Looks like no weather was found for this location(`;
    } else if (Number(error.message) === 429) {
      errorText = `Looks like someone exceeded all limits for the search`;
    } else {
      errorText = `Oops! There is a problem with the API provider`;
    }
    return false;
  }
}

function processToday(weatherData) {
  const days = weatherData.days;
  const todayData = days[1];
  const todayObj = {
    date: todayData.datetime,
    temp: todayData.temp,
    maxTemp: todayData.tempmax,
    minTemp: todayData.tempmin,
    tempFeel: todayData.feelslike,
    windSpeed: todayData.windspeed,
    icon: todayData.icon,
    description: todayData.description,
    pressure: todayData.pressure,
    uvindex: todayData.uvindex,
    sunrise: todayData.sunrise,
    sunset: todayData.sunset,
  };
  return todayObj;
}
function processHours(weatherData) {
  const todayDateTime = new Date();
  const timeNow = format(todayDateTime, "HH:mm:ss");
  const todayHours = weatherData.days[1].hours;
  const tomorrowHours = weatherData.days[2].hours;
  const hours = [];
  todayHours.forEach((hour) => {
    if (hour.datetime.slice(0, 2) >= timeNow.slice(0, 2)) {
      const hourObj = {
        date: weatherData.days[1].datetime,
        time: hour.datetime,
        icon: hour.icon,
        temp: hour.temp,
      };
      hours.push(hourObj);
    }
  });
  tomorrowHours.forEach((hour) => {
    const hourObj = {
      date: weatherData.days[2].datetime,
      time: hour.datetime,
      icon: hour.icon,
      temp: hour.temp,
    };
    hours.push(hourObj);
  });
  return hours;
}

function processForecast(weatherData) {
  const days = weatherData.days.splice(1);
  const forecast = [];
  days.forEach((day) => {
    const dayObj = {
      date: day.datetime,
      icon: day.icon,
      maxTemp: day.tempmax,
      minTemp: day.tempmin,
      windSpeed: day.windspeed,
    };
    forecast.push(dayObj);
  });
  return forecast;
}
async function processWeatherData(locationToSearch) {
  const weatherData = await getWeatherData(locationToSearch);
  if (weatherData) {
    const address = weatherData.resolvedAddress;
    const today = processToday(weatherData);
    const hours = processHours(weatherData);
    const forecast = processForecast(weatherData);
    const weather = {
      address,
      today,
      hours,
      forecast,
    };
    return weather;
  } else {
    return false;
  }
}
export { getErrorText, processWeatherData };
