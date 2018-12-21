import React from 'react';

import Input from '../input/Input';

const DialogCard = (props) => {
  let message;
  let heading;
  let inputValue;
  let inputId;
  switch(props.step) {
    case 1:
      heading = 'Welcome to Mars Rover kata!';
      inputValue = props.currentGridSize;
      inputId = 'set-grid-size';
      message = (
        <>
          <div className="input-field">
            <Input type="number" value={props.currentGridSize} label="Set grid size:" id={inputId} hint="Integer between 5 and 25" validator={/(^[5-9]$|^1[0-9]$|^2[0-5]$)/} />
          </div>
          <div className="submit-field">
            <button type="button" onClick={() => {
              inputValue = document.getElementById(inputId).value;
              inputValue !== props.currentGridSize ? props.updateGridSize(inputValue) : props.nextMessage();
            }}>Next</button>
          </div>
        </>
      );
      break;
    case 2:
      heading = 'Click on map to set obstacles';
      message = (
        <>
          <div className="submit-field">
            <button type="button" onClick={() => {
              props.nextMessage();
            }}>Next</button>
          </div>
        </>
      );
      break;
    case 3:
      heading = 'Click on map to put a rover';
      message = '';
      break;
    case 4:
      inputValue = '';
      inputId = 'set-grid-size';
      heading = 'Upload commands for the rover';
      message = (
        <>
          <div className="input-field">
            <Input type="text" value="" label="Commands:" id={inputId} hint="f - go forward; b - go backward; s - skip move; l - turn left; r - turn right" validator={/^[fbrls]+$/} /> 
          </div>
          <div className="submit-field">
            <button type="button" onClick={() => {
              inputValue = document.getElementById(inputId).value;
              inputValue !== '' ? props.addRoverCommands(inputValue) : props.nextMessage();
            }}>Next</button>
          </div>
        </>
      );
      break;
    case 5:
      if (props.roverCount >= 4) {
        props.nextMessage();
      } else {
        heading = 'Add another rover?';
        message = (
          <>
            <div className="submit-field">
              <button type="button" onClick={() => {
                props.nextMessage(3);
              }}>Yes</button>
              <button type="button" onClick={() => {
                props.nextMessage();
              }}>No</button>
            </div>
          </>
        );
      }
      break;
    case 6:
      heading = 'Set rover speed';
      inputValue = '2';
      inputId = 'set-mps';
      message = (
        <>
          <div className="input-field">
            <Input type="number" value="2" label="Moves per second:" id={inputId} hint="Integer between 1 and 25" validator={/(^[1-9]$|^1[0-9]$|^2[0-5]$)/} /> 
          </div>
          <div className="submit-field">
            <button type="button" onClick={() => {
              inputValue = document.getElementById(inputId).value;
              props.runMap(inputValue);
            }}>Run</button>
          </div>
        </>
      );
      break;
    case 7:
      heading = 'Go, rover, go!';
      message = '';
      break;
    case 8:
      heading = 'Race is over!';
      message = (
        <div className="submit-field">
          <button type="button" onClick={() => {
            props.viewTravelLog();
          }}>View Travel Log</button>
          <button type="button" onClick={() => {
            props.resetGrid();
          }}>Start again</button>
        </div>
      );
      break;
    default:
      heading = 'Something went wrong!';
  }
  return (
    <div className="dialog-card">
      <h3>{heading}</h3>
      {message}
    </div>
  )
}

export default DialogCard;