import React from 'react';
import ReactDOM from 'react-dom';

import './travel-log.scss';

const TravelLog = (props) => {
  const logNode = document.getElementById('travel-log');
  const logElement = (
    <div className="travel-log">
      <div className="content-wrapper">
        <h1>Travel Log</h1>
        <button type="button" onClick={props.resetGrid}>Start again</button>
        <div className="flex-row">
          {props.rovers.map((rover, index) => (
            <div className="log-panel" key={`log-panel-${index}`}>
              <h3>{rover.name}</h3>
              <ul className="log-list">
                {rover.travelLog.map(({ message }, id) => (
                  <li key={`message-${id}`}>{message}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  return ReactDOM.createPortal(
    logElement,
    logNode
  );
}

export default TravelLog;