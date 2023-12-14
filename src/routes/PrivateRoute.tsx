import React, { useEffect, PropsWithChildren } from 'react';
import { useSignal } from '@preact/signals-react';
import AuthenticationClient from '../clients/AuthenticationClient';
import MetricsClient from '../clients/MetricsClient';
import { TraceSeverity } from '../clients/models/MetricsModel';

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const checkingIfAuthenticated = useSignal(true);
  const isAuthenticated = useSignal(false);

  useEffect(() => {
    AuthenticationClient.isAuthenticated()
      .then(response => {
        // User is authenticated
        if (response.data.authenticated === 'true') {
          isAuthenticated.value = true;
          checkingIfAuthenticated.value = false;
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
  }, [checkingIfAuthenticated, isAuthenticated]);

  // This is the view while the auth check is being carried out:
  if (checkingIfAuthenticated.value) {
    return false;
  }

  if (!isAuthenticated.value) {
    return <>Redirecting to OKTA...</>;
  }
  return React.createElement(React.Fragment, null, children);
};

export default PrivateRoute;
