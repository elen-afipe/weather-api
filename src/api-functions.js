import dataToReturn from './example.json' assert { type: "json" };
import {format} from "date-fns"
import { getLocation } from './DOM.js';
const linkPart = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'
const keyPart = '?unitGroup=metric&key=3T6PD9Z93CTPRSXWNXQA9QAA3&include=days,hours'
let errorText;

function getErrorText (){
    return errorText;
}

// async function getWeatherData(location){
//     try{
//             const locationPart = location
//             console.log(locationPart)
//             const url = linkPart+locationPart+keyPart
//             console.log(url)
//         const response = await fetch(url, {mode: 'cors'});
//         if (!response.ok) {
//             throw new Error(response.status);
//         }
//         const responseData = await response.json();
//         console.log(responseData)
//         return responseData;
//     } catch (error){
//         if (Number(error.message)===401){
//             errorText = `Oops! There is a problem with the API key, account or subscription`
//             console.log(`Oops! There is a problem with the API key, account or subscription`)
//         } else if(Number(error.message)<429){
//             errorText = `Looks like no weather found for this location(`
//             console.log(`Looks like no weather found for this location(`)
//         } else if(Number(error.message)===429){
//             errorText = `Looks like someone exceeded all limits for the search`
//             console.log(`Looks like someone exceeded all limits for the search`)
//         } else{
//             errorText = `Oops! There is a problem with the API provider`
//             console.log(`Oops! There is a problem with the API provider`)
//         }
//             return false
//     }
// }


async function getWeatherData() {
   return dataToReturn;
}

function processToday(weatherData){
    const days = weatherData.days;
    const todayData = days[1];
    const todayObj = {
       date: todayData.datetime,
       temp : todayData.temp,
       maxTemp : todayData.tempmax,
       minTemp : todayData.tempmin,
       tempFeel : todayData.feelslike,
       windSpeed : todayData.windspeed,
       icon : todayData.icon,
       description: todayData.description,
       pressure: todayData.pressure,
       uvindex: todayData.uvindex,
       sunrise: todayData.sunrise,
       sunset: todayData.sunset
    }
    return todayObj
}
function processHours(weatherData){
    const todayDateTime = new Date();
    const timeNow = format(todayDateTime, 'HH:mm:ss');
    const todayHours = weatherData.days[1].hours
    console.log(todayHours)
    const tomorrowHours = weatherData.days[2].hours
    const hours = []
        todayHours.forEach(hour =>{
        if(hour.datetime.slice(0,2) >= timeNow.slice(0,2)){
        const hourObj = {
           date: weatherData.days[1].datetime,
           time : hour.datetime,
           icon : hour.icon,
           temp : hour.temp 
        } 
        hours.push(hourObj)
    }
        })
        tomorrowHours.forEach(hour =>{
            const hourObj = {
               date: weatherData.days[2].datetime,
               time : hour.datetime,
               icon : hour.icon,
               temp : hour.temp 
            } 
            hours.push(hourObj)
            })
        return hours  
}

function processForecast(weatherData){
    const days = weatherData.days.splice(1);
    console.log(days)
    const forecast = [];
    days.forEach(day => {
        const dayObj = {
        date : day.datetime,
        maxTemp : day.tempmax,
        minTemp : day.tempmin,
        windSpeed : day.windspeed,
        icon : day.icon
        }
        forecast.push(dayObj)
      });
    return forecast
}
async function processWeatherData(locationToSearch){
    // const weatherData = await getWeatherData(locationToSearch);
    const weatherData = await getWeatherData();
    console.log(weatherData)
    if(weatherData){
        const address = weatherData.resolvedAddress;
        console.log(address)
        const today = processToday(weatherData);
        console.log(today)
        const hours = processHours(weatherData);
        console.log(hours)
        const forecast = processForecast(weatherData); 
        console.log(forecast)
        const weather = {
            address, today, hours, forecast
        }
        return weather;
    } else{
        return false
    }
}
export {getErrorText, processWeatherData}
