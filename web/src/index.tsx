import React from 'react';
import ReactDOM from 'react-dom';

import './config/yup';
import App from './App';
import AppProviders from './AppProviders';

ReactDOM.render(
  <AppProviders>
    <App />
  </AppProviders>,
  document.getElementById('root'),
);
