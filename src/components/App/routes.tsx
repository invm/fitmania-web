import { Route, RouteComponentProps } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from '../common';
import { Login, NotFound, Posts } from '../pages';

interface IRoute {
  type: 'public' | 'private' | 'default';
  exact?: boolean;
  path: string;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

const routes: IRoute[] = [
  {
    type: 'private',
    path: '/',
    component: Posts,
  },
  {
    type: 'public',
    path: '/login',
    component: Login,
  },
  {
    type: 'default',
    path: '/404',
    component: NotFound,
  },
];

export const getRoutes = () => {
  return routes.map(({ type, ...rest }, i) => {
    let AppRoute;
    switch (type) {
      case 'private':
        AppRoute = PrivateRoute;
        break;
      case 'public':
        AppRoute = PublicRoute;
        break;
      default:
        AppRoute = Route;
        break;
    }

    return <AppRoute key={i} {...rest} />;
  });
};
