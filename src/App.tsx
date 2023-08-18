import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Home from './pages/Home/Home';

// Css
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
}

export default App;
