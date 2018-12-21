import React from 'react';
import ReactDOM from 'react-dom';
import TravelLog from './TravelLog';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TravelLog />, div);
  ReactDOM.unmountComponentAtNode(div);
});