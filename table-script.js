const tableBody = document.querySelector('#weatherTable tbody');
const tableRows = document.querySelectorAll('#weatherTable tbody tr');


const sortTemperaturesAscending = (weatherList) => {
    return [...weatherList].sort((a, b) => a.main.temp - b.main.temp);
};

const filterRainyDays = (weatherList) => {
    return weatherList.filter(entry => 
        entry.weather.some(condition => condition.description.includes('rain'))
    );
};

const findHighestTemperature = (weatherList) => {
    return weatherList.reduce((highest, entry) => 
        entry.main.temp > highest.main.temp ? entry : highest
    );
};

const sortTemperaturesDescending = (weatherList) => {
    return [...weatherList].sort((a, b) => b.main.temp - a.main.temp);
};


document.addEventListener('DOMContentLoaded', function () {
    const apiKey = "8996e98394cc69801433e36603ecdb68";
    
    // Function to extract city from the URL parameters
    function getCityFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('city');
    }

    const city = getCityFromUrl(); // Get the city from the URL

    if (!city) {
        alert('City not provided');
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    // fetch(apiUrl)
    //     .then(response => response.json())
    //     .then(data => {
    //         const weatherList = data.list.slice(0, 10); // Get the first 10 entries
    //         console.log("Weather data entries:", weatherList);

    //         weatherList.forEach(entry => {
    //             const dateTime = entry.dt_txt.split(' ');
    //             const date = dateTime[0];
    //             const time = dateTime[1];
    //             const temp = entry.main.temp;
    //             const weatherDescription = entry.weather[0].description;
    //             const humidity = entry.main.humidity;
    //             const windSpeed = entry.wind.speed;

    //             // Create a new row and populate the table
    //             const row = document.createElement('tr');
    //             row.innerHTML = `
    //                 <td>${date}</td>
    //                 <td>${time}</td>
    //                 <td>${temp.toFixed(1)}</td>
    //                 <td>${weatherDescription}</td>
    //                 <td>${humidity}</td>
    //                 <td>${windSpeed}</td>
    //             `;
    //             tableBody.appendChild(row);
    //         });
    //     })
    //     .catch(error => console.error('Error fetching weather data:', error));
    // Button to sort temperatures in ascending order

    let weatherList = []; // Store weather data globally

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            weatherList = data.list.slice(0, 10); // Get the first 10 entries
            populateTable(weatherList); // Function to populate the table
        })
        .catch(error => console.error('Error fetching weather data:', error));

    const populateTable = (list) => {
        tableBody.innerHTML = ''; // Clear existing rows
        list.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.dt_txt.split(' ')[0]}</td>
                <td>${entry.dt_txt.split(' ')[1]}</td>
                <td>${entry.main.temp.toFixed(1)}</td>
                <td>${entry.weather[0].description}</td>
                <td>${entry.main.humidity}</td>
                <td>${entry.wind.speed}</td>
            `;
            tableBody.appendChild(row);
        });
    };

    document.getElementById('sortAscending').addEventListener('click', () => {
        const sorted = sortTemperaturesAscending(weatherList);
        populateTable(sorted);
    });

    // Button to filter out rainy days
    document.getElementById('filterRainy').addEventListener('click', () => {
        const rainyDays = filterRainyDays(weatherList);
        populateTable(rainyDays);
    });

    // Button to show the highest temperature
    document.getElementById('highestTemp').addEventListener('click', () => {
        const highest = findHighestTemperature(weatherList);
        alert(`Highest Temperature: ${highest.main.temp}°C on ${highest.dt_txt}`);
    });

    // Button to sort temperatures in descending order
    document.getElementById('sortDescending').addEventListener('click', () => {
        const sorted = sortTemperaturesDescending(weatherList);
        populateTable(sorted);
    });
});



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

// New: Function to detect weather-related queries
const detectWeatherQuery = (query) => {
    query = query.toLowerCase();
    if (query.includes("highest temperature")) return "highest_temp";
    if (query.includes("lowest temperature")) return "lowest_temp";
    if (query.includes("wind speed")) return "wind_speed";
    if (query.includes("humidity")) return "humidity";
    return null;
};

// New: Function to search and get weather data from the table
const searchWeatherData = (queryType) => {
    const tableRows = document.querySelectorAll('#weatherTable tbody tr');
    let result = null;
    let date = null;
    let temp = null;
    let windSpeed = null;
    let humidity = null;
    tableRows.forEach(row => {
        const columns = row.querySelectorAll('td');
        date = columns[0].innerText;
        temp = parseFloat(columns[2].innerText);
        windSpeed = parseFloat(columns[5].innerText);
        humidity = parseFloat(columns[4].innerText);
        console.log("Row data:", { date, temp, windSpeed, humidity }); // Log row data

        switch (queryType) {
            case 'highest_temp':
                if (!result || temp > result.value) result = { type: 'Highest Temperature', value: temp, date };
                break;
            case 'lowest_temp':
                if (!result || temp < result.value) result = { type: 'Lowest Temperature', value: temp, date };
                break;
            case 'wind_speed':
                if (!result || windSpeed > result.value) result = { type: 'Highest Wind Speed', value: windSpeed, date };
                break;
            case 'humidity':
                if (!result || humidity > result.value) result = { type: 'Highest Humidity', value: humidity, date };
                break;
                
        }
    });
    
    console.log("Search result:", result); // Log the result
    switch (queryType) {
        case 'highest_temp':
            return result ? `${result.type} is ${result.value}°C on ${result.date}` : "No data available";
            break;
        case 'lowest_temp':
            return result ? `${result.type} is ${result.value}°C on ${result.date}` : "No data available";
            break;
        case 'wind_speed':
            return result ? `${result.type} is ${result.value}m/s on ${result.date}` : "No data available";
            break;
        case 'humidity':
            return result ? `${result.type} is ${result.value}% on ${result.date}` : "No data available";
            break;
            
    }
};


const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");
    const queryType = detectWeatherQuery(userData.message);  
    console.log("Detected query type:", queryType); // Log for debugging

    if (queryType) {
        // Handle weather-related queries
        const weatherResponse = searchWeatherData(queryType);
        console.log("Weather response:", weatherResponse); // Log the response
        messageElement.innerText = weatherResponse;
    } else {
        // Existing logic for non-weather queries using Gemini API
        chatHistory.push({
            role: "user",
            parts: [{
                text: userData.message
            },
            ...(userData.file.data ? [{
                inline_data: userData.file
            }] : [])]
        });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: chatHistory
            })
        };

        try {
            const response = await fetch(BOT_API_URL, requestOptions);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error.message);
            }

            // Extract and display bot response
            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            messageElement.innerText = apiResponseText;
            chatHistory.push({
                role: "model",
                parts: [{
                    text: apiResponseText
                }]
            });
        } catch (error) {
            console.log(error);
            messageElement.innerText = error.message;
            messageElement.style.color = "#ff0000";
        } finally {
            // Remove file
            userData.file = {};
            // Remove thinking indicator
            incomingMessageDiv.classList.remove("thinking");
            // Scroll to the bottom of the chat
            chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
        }
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
    document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
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
