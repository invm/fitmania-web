/**
 * All app routes are declared here, based on their type, which can be either public, private or default.
 */

import { Route, RouteComponentProps } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from '../common';
import * as PAGES from '../pages';

interface IRouteMin {
  exact?: boolean;
  path: string;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

enum RouteTypes {
  public,
  private,
  default,
}

interface IRoute extends IRouteMin {
  type: RouteTypes;
}

const PRIVATE: IRouteMin[] = [
  {
    path: '/',
    component: PAGES.Posts,
    exact: true,
  },
  {
    path: '/posts/:id',
    component: PAGES.PostDetails,
  },
];

const PUBLIC: IRouteMin[] = [
  {
    path: '/login',
    component: PAGES.Login,
    exact: true,
  },
  {
    path: '/register',
    component: PAGES.Register,
    exact: true,
  },
];

const DEFAULT: IRouteMin[] = [
  {
    path: '/404',
    component: PAGES.NotFound,
  },
];

const routes: IRoute[] = [
  ...PRIVATE.map((v) => ({ ...v, type: RouteTypes.private })),
  ...PUBLIC.map((v) => ({ ...v, type: RouteTypes.public })),
  ...DEFAULT.map((v) => ({ ...v, type: RouteTypes.default })),
];

export const getRoutes = () => {
  return routes.map(({ type, ...rest }, i) => {
    let AppRoute;
    switch (type) {
      case RouteTypes.private:
        AppRoute = PrivateRoute;
        break;
      case RouteTypes.public:
        AppRoute = PublicRoute;
        break;
      default:
        AppRoute = Route;
        break;
    }

    return <AppRoute key={i} {...rest} />;
  });
};
