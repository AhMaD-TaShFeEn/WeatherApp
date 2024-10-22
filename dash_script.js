
//WEATHER IMPLEMENTATION

const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");

const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "8996e98394cc69801433e36603ecdb68"; //API key for OpenWeatherApp API

let tempBarChartInstance = null;
let doughnutChartInstance = null;
let lineChartInstance = null;

function renderCharts(fiveDaysForecast) {
    // Prepare data for charts
    const temperatureData = fiveDaysForecast.map(forecast => (forecast.main.temp - 273.15).toFixed(2)); // Convert to °C
    const weatherConditionCounts = { sunny: 0, cloudy: 0, rainy: 0, snowy: 0 };

    // Count weather conditions for the doughnut chart
    fiveDaysForecast.forEach(forecast => {
        const description = forecast.weather[0].description.toLowerCase();
        if (description.includes('clear') || description.includes('sunny')) {
            weatherConditionCounts.sunny++;
        } else if (description.includes('cloud')) {
            weatherConditionCounts.cloudy++;
        } else if (description.includes('rain')) {
            weatherConditionCounts.rainy++;
        } else if (description.includes('snow')) {
            weatherConditionCounts.snowy++;
        }
    });

    // Prepare data for the doughnut chart
    const weatherConditionData = [
        weatherConditionCounts.sunny,
        weatherConditionCounts.cloudy,
        weatherConditionCounts.rainy,
        weatherConditionCounts.snowy
    ];

    // Destroy previous instances of the charts if they exist
    if (tempBarChartInstance) {
        tempBarChartInstance.destroy();
    }
    if (doughnutChartInstance) {
        doughnutChartInstance.destroy();
    }
    if (lineChartInstance) {
        lineChartInstance.destroy();
    }

    // Creating a Vertical Bar Chart for Temperatures
    const ctx1 = document.getElementById('tempBarChart').getContext('2d');
    tempBarChartInstance = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatureData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // Keeps chart aspect ratio
            animation: {
                delay: 500,  // Delay the animation by 500ms
                duration: 1500,  // Animation duration
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Creating a Doughnut Chart for Weather Conditions
    const ctx2 = document.getElementById('weatherDoughnutChart').getContext('2d');
    doughnutChartInstance = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ["Sunny", "Cloudy", "Rainy", "Snowy"],
            datasets: [{
                label: 'Weather Conditions',
                data: weatherConditionData,
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // Keeps chart aspect ratio
            animation: {
                delay: 500,  // Delay the animation by 500ms
                duration: 1500,  // Animation duration
            }
        }
    });

    // Creating a Line Chart for Temperature Changes
    const ctx3 = document.getElementById('tempLineChart').getContext('2d');
    lineChartInstance = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatureData,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // Keeps chart aspect ratio
            animation: {
                easing: 'easeInBounce',  // Smooth "drop" effect
                duration: 1500,  // Duration of the drop effect
                onProgress(animation) {
                    const chartInstance = animation.chart;
                    const ctx = chartInstance.ctx;
                    ctx.save();
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                    ctx.shadowBlur = 20;
                    ctx.restore();
                },
            }
        }
    });
}



// const createWeatherCard = (cityName, weatherItem, index) => {
//     if(index === 0){ // For Main Card
//         return `<div class="details"> 
//                     <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
//                     <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
//                     <h4>Wind: ${weatherItem.wind.speed}m/s</h4>  
//                     <h4>Humidity: ${weatherItem.main.humidity}%</h4>  
//                 </div>
//                 <div class="icon">
//                     <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon"> 
//                     <h4>${weatherItem.weather[0].description}</h4>
//                 </div>`
//         ;
//     }
//     else{ // For 5 Day Forecast
//         return `<li class="card">
//                     <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
//                     <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon"> 
//                     <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
//                     <h4>Wind: ${weatherItem.wind.speed}m/s</h4>  
//                     <h4>Humidity: ${weatherItem.main.humidity}%</h4>
//                 </li>`
//         ;
//     }
// }


// const getWeatherDetails = (cityName, lat, lon) => {
//     const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

//     fetch(WEATHER_API_URL)
//         .then(response => response.json())
//         .then(data => {
//             // console.log(data);
//             //Filter the forecast to get only one forecast per day
//             const uniqueForecastDays = [];
//             const fiveDaysForecast = data.list.filter(forecast => {
//                 const forecastDate = new Date (forecast.dt_txt).getDate();
//                 if(!uniqueForecastDays.includes(forecastDate)){
//                     return uniqueForecastDays.push(forecastDate);      
//                 }
//             });

//             //clearing previous weather data
//             cityInput.value = "";
//             weatherCardsDiv.innerHTML = "";
//             currentWeatherDiv.innerHTML = "";
            
//             // console.log(fiveDaysForecast);
//             //Display the forecast details
//             // Creating weather cards and adding them to DOM
//             fiveDaysForecast.forEach((weatherItem, index)=> {
//                 if(index === 0){
//                     currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
//                 }
//                 else{
//                     weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
//                 }
//             });
//             // Render charts after the forecast data is displayed
//             renderCharts(fiveDaysForecast);
//         })
//     .catch((error) => {
//         alert("Error occurred while fetching weather forecast!");
//         console.error("Error:", error);
//     });
// }

const createWeatherCard = (cityName, weatherItem, index) => {
    // Determine the background image based on weather condition
    const description = weatherItem.weather[0].description.toLowerCase();
    let backgroundUrl = "";

    if (description.includes('clear') || description.includes('sunny')) {
        backgroundUrl = "url('sunny-bg.jpg')";
    } else if (description.includes('cloud')) {
        backgroundUrl = "url('cloudy-bg.jpeg')";
    } else if (description.includes('rain')) {
        backgroundUrl = "url('rainy-bg.jpeg')";
    } else if (description.includes('snow')) {
        backgroundUrl = "url('snowy-bg.jpg')";
    }

    if (index === 0) { // For Main Card
        return `<div class="details" style="background-image: ${backgroundUrl};"> 
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed}m/s</h4>  
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>  
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon"> 
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else { // For 5 Day Forecast
        return `<li class="card" style="background-image: ${backgroundUrl};">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon"> 
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed}m/s</h4>  
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`;
    }
};


const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            // Filter the forecast to get only one forecast per day
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            // Clear previous weather data
            cityInput.value = "";
            weatherCardsDiv.innerHTML = "";
            currentWeatherDiv.innerHTML = "";
            
            // Show the forecast title when forecast data is available
            const forecastTitle = document.getElementById("forecastTitle");
            if (fiveDaysForecast.length > 0) {
                forecastTitle.style.display = "block";  // Show the title
            }

            // Get current weather condition
            const currentWeather = fiveDaysForecast[0].weather[0].description.toLowerCase();
            setBackground(currentWeather);

            // Display the forecast details
            fiveDaysForecast.forEach((weatherItem, index) => {
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                } else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                }
            });
            // Render charts after the forecast data is displayed
            renderCharts(fiveDaysForecast);
        })
        .catch((error) => {
            alert("Error occurred while fetching weather forecast!");
            console.error("Error:", error);
        });
}

const setBackground = (weatherCondition) => {
    const conditions = {
        sunny: "url('sunny-bg.jpg')",
        cloudy: "url('cloudy-bg.jpeg')",
        rainy: "url('rainy-bg.jpeg')",
        snowy: "url('snowy-bg.jpg')",
    };

    let backgroundUrl = "url('default-bg.jpg')"; // Default background
    if (weatherCondition.includes("clear") || weatherCondition.includes("sunny")) {
        backgroundUrl = conditions.sunny;
    } else if (weatherCondition.includes("cloud")) {
        backgroundUrl = conditions.cloudy;
    } else if (weatherCondition.includes("rain")) {
        backgroundUrl = conditions.rainy;
    } else if (weatherCondition.includes("snow")) {
        backgroundUrl = conditions.snowy;
    }

    currentWeatherDiv.style.backgroundImage = backgroundUrl;
    currentWeatherDiv.style.backgroundSize = "cover"; // Cover the div
    currentWeatherDiv.style.backgroundPosition = "center"; // Center the image
};


const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) {
        alert("Please enter a city name");
        return;
    }
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`;
    
    fetch(GEOCODING_API_URL)
        .then(response => response.json())
        .then(data => {
            if(!data.length){
                return alert(`No coordinates found for ${cityName}`);
            }
            console.log(data);
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch((error) => {
            alert("Error occurred while fetching coordinates!");
            console.error("Error:", error);
        });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            console.log(position);
            const { latitude, longitude } = position.coords; //Get coordinates of user location
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
            
            // Get city Name from the acquired coordinates using reverse geocoding api
            fetch(REVERSE_GEOCODING_URL)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
            .catch((error) => {
                alert("Error occurred while fetching the city!");
                console.error("Error:", error);
            });
        },
        error => {
            if(error.code === error.PERMISSION_DENIED){ //Show alert if user denied permission
                alert("Please allow location access to get your coordinates!");
            }
            alert("Error occurred while fetching user coordinates!");
            console.error("Error:", error);
        }
    );
}

searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
locationButton.addEventListener("click", getUserCoordinates);



//BOT IMPLEMENTATION

const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");


//API setup
const BOT_API_KEY = "AIzaSyAOwLeP4bwAaZTUV9xM878eflxAOnBCTAM";
const BOT_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${BOT_API_KEY}`;

const userData ={
    message: null,
    file: {
        data: null,
        mime_type: null
    }
};

const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

//Create message element
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

//Generate bot response using Gemini API
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");
    chatHistory.push({
        role: "user",
        parts:[{
            text: userData.message
        }, 
        ...(userData.file.data ? [{
            inline_data: userData.file
        }] : [] )]
    });
    //API request options
    const requestOptions ={
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: chatHistory
        })
    }
    try{
        const response = await fetch(BOT_API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok){ 
            throw new Error(data.error.message);
        }
        console.log(data);

        // Extract and Display bot response
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiResponseText;
        chatHistory.push({
            role: "model",
            parts:[{
                text: apiResponseText}]
    });
    }catch(error){
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    }finally{
        //Remove File
        userData.file = {};
        //Remove thinking indicator
        incomingMessageDiv.classList.remove("thinking");
        //Scroll to the bottom of the chat
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }
};

//Handling outgoing user messages
const handleOutgoingMessage = (e) => {
    e.preventDefault();

    userData.message = messageInput.value.trim();
    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-upload");
    messageInput.dispatchEvent(new Event("input"));

    //Create and display user message
    const messageContent = `<div class="message-text"></div>${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class ="attachment" />` : ""}`;
    
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").innerText = userData.message;
    chatBody.appendChild(outgoingMessageDiv);

    //Scroll to the bottom of the chat
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    //Simulate bot response with thinking indicator after a delay
    setTimeout(() => {
        const messageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;
    
    const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv);
    //Scroll to the bottom of the chat
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    generateBotResponse(incomingMessageDiv);
    }, 600);

};

//Handling EnterKey press for sending messages
messageInput.addEventListener("keydown", (e) =>{
    const userMessage = e.target.value.trim();
    if(e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768 ){
        handleOutgoingMessage(e);
    }
});

//Adjust Input field height dynamically 
messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector("chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

//Handling file input change
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if(!file){
        return;
    }
    console.log(file)
    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-upload");
        const base64String = e.target.result.split(",")[1];

        //Store file data in userData
        userData.file = {
            data: base64String,
            mime_type: file.type
        }

        console.log(userData);
        fileInput.value = "";
    }

    reader.readAsDataURL(file);

});

//Handling file cancel button click
fileCancelButton.addEventListener("click", () => {
    fileUploadWrapper.classList.remove("file-upload");
    userData.file = {};
    fileInput.value = "";
});

// Initializing Emoji Picker
const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const {selectionStart: start, selectionEnd: end} = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },
    onClickOutside: (e) => {
        if(e.target.id === "emoji-picker"){
            document.body.classList.toggle("show-emoji-picker");
        }
        else{
            document.body.classList.remove("show-emoji-picker");
        }
    }
});

//Handling send message button click
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));

//Handling file upload
document.querySelector("#file-upload").addEventListener("click",() => fileInput.click());

//Handling emoji picker
document.querySelector(".chat-form").appendChild(picker);

//Handling chatbot toggler
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

//Handling chatbot close button
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));