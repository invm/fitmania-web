import { Route, RouteComponentProps } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from '../common';
import * as PAGES from '../pages';

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
    component: PAGES.Posts,
  },
  {
    type: 'public',
    path: '/login',
    component: PAGES.Login,
  },
  {
    type: 'public',
    path: '/register',
    component: PAGES.Register,
  },
  {
    type: 'default',
    path: '/404',
    component: PAGES.NotFound,
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

    return <AppRoute key={i} exact {...rest} />;
  });
};
