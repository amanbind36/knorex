import React, { useEffect, useState } from "react";
import "./homepage.css"

const API_Key = "7a09c00c7811cefa0cdd7f14f4f932bc" 

const cities = ["Ho Chi Minh", "Singapore", "Kuala Lumpur", "Tokyo", "Athens"];
const defaultCity = "Ho Chi Minh";

const HomePage = () => {
  const [weatherData, setWeatherData] = useState({});
  const [forecastData, setForecastData] = useState({});
  const [city, setCity] = useState(
    localStorage.getItem("selectedCity") || defaultCity
  );
  const [days, setDays] = useState(3);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}`
        );
        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchForecast = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${
            days * 8
          }&appid=${API_Key}`
        );
        const data = await res.json();
        setForecastData(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWeather();
    fetchForecast();
  }, [city, days]);

  const handleCity = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    localStorage.setItem("selectedCity", selectedCity);
  };

  return (
    <>
    <div className="container">
      <div>Weather Application</div>
      <div>
        <label htmlFor="selectCity">Select a City:</label>
        <select id="selectCity" value={city} onChange={handleCity}>
          {cities.map((cityName) => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
        </select>
        <div>
          <label htmlFor="day">Forecast Days:</label>
          <input
            type="number"
            id="day"
            min="1"
            max="5"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
        </div>
        <div className="weatherSection">
          <h1>Current Weather in {weatherData.name || "N/A"}</h1>
          {weatherData.main ? (
            <div  className="weatherCard">
              <p>
                Temperature:
                {(weatherData.main.temp - 273.15).toFixed(2)}{" "}
                <span>&deg;</span> C
              </p>
              <p>Weather: {weatherData.weather?.[0]?.description || "N/A"}</p>
            </div>
          ) : (
            <p>Weather data unavailable for {city}</p>
          )}
        </div>
        <div className="forcastSection">
          <h2>Weather Forecast for {days} Days</h2>
          {forecastData.list?.length > 0 ? (
            forecastData.list.map((data, idx) => (
              <div className="weatherCard" key={idx}>
                <p>Date: {data.dt_txt}</p>
                <p>
                  Temperature: {(data.main.temp - 273.15).toFixed(2)}{" "}
                  <span>&deg;</span> C
                </p>
                <p>Weather: {data.weather?.[0]?.description || " "}</p>
              </div>
            ))
          ) : (
            <p>No forecast data available</p>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default HomePage;
