// Tiny router using browser history API
export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    window.addEventListener('popstate', () => this.handleRoute(location.pathname));
  }

  init() {
    this.handleRoute(location.pathname);
  }

  navigate(path) {
    history.pushState({}, '', path);
    this.handleRoute(path);
  }

  handleRoute(path) {
    this.currentRoute = path;
    if (this.routes[path]) {
      this.routes[path]();
    } else if (this.routes['*']) {
      this.routes['*']();
    }
  }
}