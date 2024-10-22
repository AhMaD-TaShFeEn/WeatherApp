Weather Dashboard
Description
The Weather Dashboard is a responsive web application designed to provide users with current weather data, a 5-day forecast, and visual weather trends through interactive charts. It supports both city-based weather searches and location-based weather retrieval, offering a seamless and visually appealing interface for checking weather conditions.

Features
City-based Weather Search: Input any city to retrieve the current weather conditions, including temperature, wind speed, and humidity.
Location-based Weather Search: Use your current location to automatically fetch weather data.
5-day Weather Forecast: View the weather forecast for the next 5 days, including daily temperature, wind speed, and humidity levels.
Charts for Data Visualization:
Bar Chart: Displays the temperature forecast over the next 5 days.
Doughnut Chart: Visualizes the percentage distribution of different weather conditions.
Line Chart: Tracks the temperature changes over time.
Technologies Used
HTML5: Provides the structure for the weather app, including forms for user input and areas for displaying weather data.
CSS3: Enhances the visual appeal and layout, making the app responsive and user-friendly.
JavaScript: Handles user interactions, API requests, and chart generation.
Chart.js: Powers the creation of charts to represent weather data.
OpenWeatherMap API: Fetches live weather data for the current weather and forecast.
How to Use
Search for a City: Enter a city name (e.g., Islamabad, Riyadh, London) in the input field and click the Search button. The weather information and forecast will be displayed.
Use Current Location: Click the Use Current Location button to automatically detect your location and fetch weather data.
View Charts: Scroll down to see visual charts that represent the temperature and weather conditions over the next 5 days.
Setup and Installation
Prerequisites
A modern web browser (Google Chrome, Mozilla Firefox, etc.).
Internet connection (to fetch weather data via the OpenWeatherMap API).
An API key from OpenWeatherMap.
Installation Steps
Clone this repository or download the project files.
Open the project folder and locate the index.html file.
Open index.html in a web browser.
Ensure you add your OpenWeatherMap API key to the JavaScript file (dash_script.js).
Code Structure
HTML (index.html): Structures the weather dashboard, including user input for city names, current weather display, and forecast sections.
CSS (dash_styles.css): Styles the app, ensuring that the layout is clean, visually appealing, and responsive across devices.
JavaScript (dash_script.js): Handles logic for fetching weather data, updating the DOM, and generating charts.
API Integration
To fetch live weather data, this app uses the OpenWeatherMap API. You will need an API key for weather data retrieval.

Get an API key from OpenWeatherMap.
Replace the placeholder for the API key in your JavaScript file (dash_script.js).