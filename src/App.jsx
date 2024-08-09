import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [temperature, setTemperature] = useState(null);
  const [location, setLocation] = useState(null);
  const [humidity, setHumidity] = useState(30);
  const [soilHumidity, setSoilHumidity] = useState(30);
  const [fieldTemperature, setFieldTemperature] = useState(21);
  const [PNK, setPNK] = useState(0);
  const [hover, setHover] = useState(false); // État pour gérer l'effet de survol

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;

        // Fetch location name and temperature using a weather API
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=985e2a3a6045936a3bd362c3577f1755`)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            setLocation(data.name);
            setTemperature(data.main.temp.toString() + ' °C');
          })
          .catch(error => console.error('Error fetching weather data:', error));
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://smartagriculture-backend.onrender.com/');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setFieldTemperature(message.temperature);
      setHumidity(message.humidity);
      setSoilHumidity(message.soilHumidity);
      setPNK(message.PNK);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHover(true);
      setTimeout(() => setHover(false), 10000); // L'effet dure 10 secondes
    }, 60000); // L'effet se déclenche toutes les minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="cardm">
        <div className={`card ${hover ? 'hover1' : ''}`}>
          <div className="containerr">
            <div className="cloud front">
              <span className="left-front"></span>
              <span className="right-front"></span>
            </div>
            <span className="sun sunshine" aria-label="sunshine"></span>
            <span className="sun" aria-label="sun"></span>
            <div className="cloud back">
              <span className="left-back"></span>
              <span className="right-back"></span>
            </div>
          </div>
          <div className="main">{temperature}</div>
          <div className="mainsub">{location}</div>
        </div>

        <div className="card2">
          <div className="upper">
            <div className="humidity">
              <div className="humiditytext">Humidité sol: <span className='values'>{soilHumidity}%</span></div>
              <img src={'/soil.webp'} width="30" height="30" alt="Humidity Icon" className='humIm' />
            </div>

            <div className="pnk">
              <div className="pnktext">PNK: <span className='values'>{PNK} mg</span></div>
              <img src={'/pnk.webp'} width="30" height="30" alt="Air Quality Icon" className='pnkIm' />
            </div>
          </div>

          <div className="lower">
            <div className="">
              <div className="soiltext">Humidité air: <span className='values'>{humidity}%</span></div>
              <img src={'/hum.png'} width="30" height="30" alt="Soil Humidity Icon" className='soilIm'/>
            </div>

            <div className="">
              <div className="temptext">Température: <span className='values'>{fieldTemperature} °C</span></div>
              <img src="/temp.png" width="30" height="30" alt="Temperature Icon" className='tempIm'/>
            </div>

            <div className="card3">
              Votre Champ en temp réel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
