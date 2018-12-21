import React from 'react';
import ReactDOM from 'react-dom';
import DialogCard from './DialogCard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DialogCard />, div);
  ReactDOM.unmountComponentAtNode(div);
});