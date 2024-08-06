import { useState,useEffect } from 'react';
import './App.css';

function App() {
  const [temperature, setTemperature] = useState(23); 
  const [location, setLocation] = useState('Dunmore, Ireland');
  const [humidity, setHumidity] = useState(30);
  const [airQuality, setAirQuality] = useState('8 mol/L');
  const [soilHumidity, setSoilHumidity] = useState(30);
  const [realFeel, setRealFeel] = useState(21);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setTemperature(message.temperature);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
   
    <div>
     
      <div className="cardm">
        <div className="card">
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
          <div className="main">{temperature} °C</div>
          <div className="mainsub">{location}</div>
        </div>

        <div className="card2">
          <div className="upper">
            <div className="humidity">
             
              <div className="humiditytext">Humidity {humidity}%</div> 
              <img src={'../public/soilH.png'} width="30" height="30" alt="Humidity Icon" />
            </div>

            <div className="air">
              <div className="airtext">PNK {airQuality}</div>
              <img src={'../public/pnk.webp'} width="30" height="30" alt="Air Quality Icon" />
            </div>
          </div>

          <div className="lower">
            <div className="aqi">
              <img src={'../public/plante.jpg'} width="20" height="20" alt="Soil Humidity Icon" />
              <div className="aqitext">Humidité du sol {soilHumidity}</div>
            </div>

            <div className="realfeel">
              <img src="../public/temp.png" width="20" height="20" alt="Temperature Icon" />
              <div className="realfeeltext">Température {realFeel} °C</div>
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
