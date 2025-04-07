import { useEffect, useState } from 'react';
import './App.css';

const API_KEY = 'e8bef9ce8fbd43ef918d2201c341c00e'; // Replace with your WeatherBit API key
const CITIES = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Denver', 'Seattle', 'Phoenix', 'Boston', 'Atlanta'];

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByTemp, setFilterByTemp] = useState('all');

  useEffect(() => {
    const fetchWeatherData = async () => {
      const results = await Promise.all(
        CITIES.map(async (city) => {
          const response = await fetch(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${API_KEY}`);
          const data = await response.json();
          console.log(`Data for ${city}:`, data); // ✅ Debug log
          return data.data[0];
        })
      );
      setWeatherData(results);
    };
  
    fetchWeatherData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleTempFilter = (e) => {
    setFilterByTemp(e.target.value);
  };

  const filteredData = weatherData
    .filter((item) => item.city_name.toLowerCase().includes(searchQuery))
    .filter((item) => {
      if (filterByTemp === 'all') return true;
      if (filterByTemp === 'hot') return item.temp >= 80;
      if (filterByTemp === 'cool') return item.temp < 80;
      return true;
    });

  const averageTemp = (weatherData.reduce((acc, item) => acc + item.temp, 0) / weatherData.length).toFixed(1);
  const hottest = weatherData.reduce((prev, curr) => (prev.temp > curr.temp ? prev : curr), weatherData[0]);
  const coldest = weatherData.reduce((prev, curr) => (prev.temp < curr.temp ? prev : curr), weatherData[0]);

  return (
    <div className="App">
      <h1>Weather Dashboard</h1>
  
      <div className="summary">
        <p><strong>Average Temp:</strong> {averageTemp} °F</p>
        <p><strong>Hottest City:</strong> {hottest?.city_name} ({hottest?.temp} °F)</p>
        <p><strong>Coldest City:</strong> {coldest?.city_name} ({coldest?.temp} °F)</p>
      </div>
  
      <div className="controls">
        <input
          type="text"
          placeholder="Search city..."
          value={searchQuery}
          onChange={handleSearch}
        />
  
        <select onChange={handleTempFilter} value={filterByTemp}>
          <option value="all">All Temps</option>
          <option value="hot">Hot (&gt;= 80&#176;F)</option>
          <option value="cool">Cool (&lt; 80&#176;F)</option>
        </select>
      </div>
  
      <div className="card-list">
        {filteredData.map((item, index) => (
          <div key={index} className="card">
            <h3>{item.city_name}</h3>
            <p><strong>Temperature:</strong> {item.temp} °F</p>
            <p><strong>Weather:</strong> {item.weather.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;