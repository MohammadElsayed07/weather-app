/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth()+1)+'.'+ d.getDate()+'.'+ d.getFullYear();

// API key from OpenWeatherMap.org
let apiKey = "fd00ec38e6554fb6612b7bea9baad402";

// Placeholderso for the printed data
let dateData = document.getElementById("date");
let tempData = document.getElementById("temp");
let feelingsData = document.getElementById("content");

// Getting feedback from the button
const generate = document.getElementById("generate");
generate.addEventListener('click', generateURL);


// Creating asynchronous function
async function generateURL() {
    const zipCode = document.getElementById("zip").value;
    const feelings = document.getElementById("feelings").value;

    try {
        if (zipCode) {
            const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=metric`;
            
            getData(url)
                .then(function(data = {})  {
                    postData('/addData', 
                    {
                        date: newDate,
                        temp: data.main.temp,
                        feelings: feelings
                    })
                    .then(updateUI());
                });
        }
        else {
            alert("Enter a zip code");
        }
    } catch (error) {
        console.log(`error: ${error}`)
    }
}

// Creating asynchronous function `getData` that gets the data from api
async function getData(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    } catch (error) {
        // Printing errors if existed
        console.log(`error: ${error}`)
    }
}

// Creating asynchronous function `postData` to post data to the server
async function postData (url = '', data = {}) {
    const res = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    try {
        const data= await res.json();
        return data;
    } catch (error) {
        console.log(`error: ${error}`);
    }
}

// Creating asynchronous function `updateUI` to update the ui with new data
async function updateUI() {

    // getting all data
    const req = await fetch('/all');
    try {
        const projectData = await req.json();

        //Updating UI
        dateData.innerHTML = `Date: ${projectData.date}`;
        tempData.innerHTML = `Temperature: ${projectData.temp}`;
        feelingsData.innerHTML = `I feel: ${projectData.feelings}`;
        
    } catch (error) {
        console.log(`error: ${error}`);
    }
}
