import React from 'react';
import ReactDOM from 'react-dom';
import IndexComponent from './IndexComponent';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<IndexComponent />, div);
  ReactDOM.unmountComponentAtNode(div);
});
