import { getPath, matchPath } from '../utils';
import { CLIENT_URL } from '../client';

const routes = [];
routes.push({ key: 'ChangeAccountDialog', pattern: '/account/change' });
routes.push({ key: 'ChangePasswordDialog', pattern: '/account/password/change' });
routes.push({ key: 'VerifyAccountDialog', pattern: '/account/verify' });
routes.push({ key: 'ResetPasswordDialog', pattern: '/account/password/reset' });
routes.push({ key: 'SignInDialog', pattern: '/account/signin' });
routes.push({ key: 'SignOutDialog', pattern: '/account/signout' });
routes.push({ key: 'SignUpDialog', pattern: '/account/signup' });

routes.push({ key: 'AddOrderDialog', pattern: ['/orders/:action(add)', '/orders/:orderId/:action(edit|delete)'] });

const findContextualRoute = (url) => {
    const contextualRoute = routes.map(route => {
        const match = matchPath(new URL(getPath(url), CLIENT_URL).pathname, route.pattern);
        return { ...route, match };
    }).filter(route => route.match != null)[0] || null;
    return contextualRoute;
};

const PAGE_PATH_QUERY_PARAM = 'pageUrl';

export { findContextualRoute, routes, PAGE_PATH_QUERY_PARAM };