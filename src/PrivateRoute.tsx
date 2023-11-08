import React, { useState, useEffect, PropsWithChildren } from 'react';
import axios from 'axios';

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const [checkingIfAuthenticated, setCheckingIfAuthenticated] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get('/api/auth/isAuthenticated')
      .then(response => {
        // User is authenticated
        if (response.data.authenticated === 'true') {
          setIsAuthenticated(true);
          setCheckingIfAuthenticated(false);
        }
        // User not authenticated, redirect to login
        else {
          window.location.href = '/api/auth/login';
        }
      })
      .catch(() => {
        // Failed to check if use was authenticated, redirect to login
        window.location.href = '/api/auth/login';
      });
  }, [setCheckingIfAuthenticated, setIsAuthenticated]);

  // This is the view while the auth check is being carried out:
  if (checkingIfAuthenticated) {
    return false;
  }

  if (!isAuthenticated) {
    return <>Redirecting to OKTA...</>;
  }
  return React.createElement(React.Fragment, null, children);
};

export default PrivateRoute;
