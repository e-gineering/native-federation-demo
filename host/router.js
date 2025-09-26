// Tiny router using browser history API
export const router = {
  createRouter,
};

function createRouter(routes) {
  let currentRoute = null;

  const handleRoute = (path) => {
    currentRoute = path;
    if (routes[path]) {
      routes[path]();
    } else if (routes['*']) {
      routes['*']();
    }
  };

  const navigate = (path) => {
    history.pushState({}, '', path);
    handleRoute(path);
  };

  const init = () => {
    handleRoute(location.pathname);
  };

  const getCurrentRoute = () => currentRoute;

  // Set up popstate listener
  window.addEventListener('popstate', () => handleRoute(location.pathname));

  return {
    init,
    navigate,
    getCurrentRoute,
    handleRoute,
  };
}
