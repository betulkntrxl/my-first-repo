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
        console.log('auth', response.data);

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
  }, [
    checkingIfAuthenticated,
    checkingIfAuthenticated.value,
    isAuthenticated,
    isAuthenticated.value,
  ]);

  // This is the view while the auth check is being carried out:
  if (checkingIfAuthenticated.value) {
    return false;
  }

  // User is not authenticated, user will be redirected so they probably won't
  // see the Redirecting text below
  if (!isAuthenticated.value) {
    return <>Redirecting to OKTA...</>;
  }

  // User is authenticated, render the children which is the application
  return React.createElement(React.Fragment, null, children);
};

export default PrivateRoute;
