import React from 'react';
import { Route, Redirect, RouteComponentProps, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';
import { RootState } from '../../redux';

const PublicRoute = ({
  component: Component,
  ...rest
}: RouteProps & {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}) => {
  const { isAuthenticated, verifyingSession } = useSelector((state: typeof RootState) => state.user);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (verifyingSession) {
          return (
            <div style={{ paddingTop: 50 }}>
              <Spinner size={2} />
            </div>
          );
        } else if (isAuthenticated) {
          return <Redirect to="/" />;
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default PublicRoute;
