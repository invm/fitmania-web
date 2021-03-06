/* A component that meant to prevent unauthorized access to private pages */

import React from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';
import { RootState } from '../../redux';

const PrivateRoute = ({
  component: Component,
  ...rest
}: {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}) => {
  const { isAuthenticated, verifyingSession, loading } = useSelector((state: typeof RootState) => state.user);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (verifyingSession || loading) {
          return (
            <div style={{ paddingTop: 50 }}>
              <Spinner size={2} />
            </div>
          );
        } else if (!isAuthenticated) {
          return <Redirect to="/login" />;
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default PrivateRoute;
