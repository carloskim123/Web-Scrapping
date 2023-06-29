/*
Run: npm i axios cheerio

before running the code
*/

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Send a GET request to the website
axios.get('https://forecast.weather.gov/MapClick.php?lat=34.09976000000006&lon=-118.33197499999994')
  .then((response) => {
    // Create a cheerio object to parse the HTML content
    const $ = cheerio.load(response.data);

    // Find the section containing the seven-day forecast
    const week = $('#seven-day-forecast-body');

    // Find all the forecast items within the week section
    const items = week.find('.tombstone-container');

    // Extract the period names, short descriptions, and temperatures from each forecast item
    const periodNames = items.find('.period-name').map((index, element) => $(element).text()).get();
    const shortDescriptions = items.find('.short-desc').map((index, element) => $(element).text()).get();
    const temperatures = items.find('.temp').map((index, element) => $(element).text()).get();

    // Create an array of objects to store the extracted data
    const weatherStuff = periodNames.map((period, index) => ({
      period,
      short_descriptions: shortDescriptions[index],
      temperatures: temperatures[index]
    }));

    // Convert the array of objects to JSON
    const weatherStuffJSON = JSON.stringify(weatherStuff);

    // Save the JSON to a file
    fs.writeFileSync('result.json', weatherStuffJSON);

    // Display the JSON
    console.log(weatherStuffJSON);
  })
  .catch((error) => {
    console.log(error);
  });
