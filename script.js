const API_KEY = "b38910a99a886dea253129e8f991464e";

const form = document.querySelector("#weatherForm");
const cityInput = document.querySelector("#city");
const container = document.querySelector(".weatherData");
const searchHistory = document.querySelector(".searchHistory");
const eventBox = document.querySelector(".event_state");

let visitedCities = JSON.parse(localStorage.getItem("visitedCities")) || [];

function logEvent(message) {
    const p = document.createElement("p");
    p.textContent = message;
    eventBox.appendChild(p);
}

function resetConsole() {
    eventBox.innerHTML = "";
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        searchWeather(city);
    }
});

async function searchWeather(city) {

    resetConsole();
    logEvent("1️⃣ Sync Start");
    logEvent("[ASYNC] Start fetching...");

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const weatherData = await response.json();

        if (weatherData.cod === 200) {

            container.innerHTML = `
                <p><strong>City:</strong> ${weatherData.name}, ${weatherData.sys.country}</p>
                <p><strong>Temp:</strong> ${weatherData.main.temp} °C</p>
                <p><strong>Weather:</strong> ${weatherData.weather[0].main}</p>
                <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
                <p><strong>Wind:</strong> ${weatherData.wind.speed} m/s</p>
            `;

            logEvent("[ASYNC] Data received ✅");

            if (!visitedCities.includes(city)) {
                visitedCities.push(city);
                localStorage.setItem("visitedCities", JSON.stringify(visitedCities));
            }

            showHistory();

        } else {

            container.innerHTML = `<p>${weatherData.message}</p>`;
            logEvent("[ASYNC] Data not received ❌");
        }

    } catch (error) {
        container.innerHTML = `<p>Something went wrong</p>`;
        logEvent("[ASYNC] Data not received ❌");
    }

    logEvent("2️⃣ Sync End");
}

function showHistory() {
    searchHistory.innerHTML = "";

    visitedCities.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city;
        btn.addEventListener("click", () => searchWeather(city));
        searchHistory.appendChild(btn);
    });
}

showHistory();