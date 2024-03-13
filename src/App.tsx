import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { signal } from '@preact/signals-react';
import PrivateRoute from './routes/PrivateRoute';
import Home from './pages/Home/Home';
import { theme } from './Theme';
// Css
import './App.css';
import SnackbarComponent from './components/SnackBar/SnackBar';

export const showSnackbar = signal(false);

const App = () => (
  <Suspense fallback="">
    <ThemeProvider theme={theme}>
      <SnackbarComponent showStatus={showSnackbar.value} />
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
