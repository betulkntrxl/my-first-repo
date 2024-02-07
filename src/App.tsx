import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import PrivateRoute from './routes/PrivateRoute';
import Home from './pages/Home/Home';
import { theme } from './Theme';

// Css
import './App.css';

const App = () => (
  <Suspense fallback="">
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </Suspense>
);

export default App;
