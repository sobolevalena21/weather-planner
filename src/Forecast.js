import React, { useState, useEffect } from "react";
import { get } from './mockBackend/fetch';
import './Forecast.css'; //Need to be here for the styles to apply!!!

export default function Forecast() {
  const [data, setData] = useState([]);
  const [notes, setNotes] = useState({});
  const [forecastType, setForecastType] = useState('/daily');

  useEffect(() => {
    alert('Requested data from server...');
    get(forecastType).then((response) => {
      alert('Response: ' + JSON.stringify(response,'',2));
      setData(response.data);
    });
  }, [forecastType]);//the effect re-renders if the value in the dependency array changed - buttons '5-day' vs 'Today' were reclicked, aka endpoint '/daily' vs '/hourly'.

  const handleChange = (index) => ({ target }) =>
    setNotes((prev) => ({
      ...prev,
      [index]: target.value
    }));
//In our JSX, we are trying to map over an array stored by the data state variable, but our effect that fetches this data doesn’t get called until after the first render. So during the first render, data is undefined and attempting to call map() on undefined is causing our error! Let’s prevent this error by checking to see if data has loaded yet. If it hasn’t, then we want our function component to just return a paragraph tag with the text “Loading…”. If data is no longer undefined, then the data has been loaded, and we can go ahead and render the full JSX!

//In our JSX, we are trying to map over an array stored by the data state variable, but our effect that fetches this data doesn’t get called until after the first render. So during the first render, data is undefined and attempting to call map() on undefined is causing our error! Let’s prevent this error by checking to see if data has loaded yet. If it hasn’t, then we want our function component to just return a paragraph tag with the text “Loading…”. If data is no longer undefined, then the data has been loaded, and we can go ahead and render the full JSX!
  if (!data) {
    return <p>Loading...</p>
    }; 
  return (
    <div className='App'>
      <h1>My Weather Planner</h1>
      <div>
        <button onClick={() => setForecastType('/daily')}>5-day</button>
        <button onClick={() => setForecastType('/hourly')}>Today</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Summary</th>
            <th>Avg Temp</th>
            <th>Precip</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
            {data.map((item) => {
              return (
            <tr key={item.id}>
              <td>{item.summary}</td>
              <td> {item.temp.avg}°F</td>
              <td>{item.precip}%</td>
              <td>
                <input
                  value={notes[item.id] || ''}
                  onChange={handleChange(item.id)}
                />
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
}
