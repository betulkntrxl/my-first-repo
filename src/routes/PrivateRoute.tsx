import React, { useState, useEffect, PropsWithChildren } from 'react';
import AuthenticationClient from '../clients/AuthenticationClient';
import MetricsClient from '../clients/MetricsClient';
import { TraceSeverity } from '../clients/models/MetricsModel';

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const [checkingIfAuthenticated, setCheckingIfAuthenticated] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    AuthenticationClient.isAuthenticated()
      .then(responseData => {
        // User is authenticated
        if (responseData.authenticated === 'true') {
          setIsAuthenticated(true);
          setCheckingIfAuthenticated(false);
        }
        // User not authenticated, redirect to login
        else {
          window.location.href = '/api/auth/login';
        }
      })
      .catch(error => {
        MetricsClient.sendTrace({
          message: 'ChatApp failed to retrieve isAuthenticated',
          severity: TraceSeverity.CRITICAL,
          properties: { errorResponse: error.response },
        });

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
