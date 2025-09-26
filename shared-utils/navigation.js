// Shared navigation service - Provides navigation functions for federated modules

export const navigation = {
  initNavigation,
  navigate,
};

let navigateFunction = null;

// Initialize the navigation service with a navigate function
function initNavigation(navigateFn) {
  navigateFunction = navigateFn;
}

// Navigate to a path - can be used by any module
function navigate(path) {
  if (!navigateFunction) {
    console.warn('[Navigation] Navigation not initialized. Using fallback to location.href');
    window.location.href = path;
    return;
  }
  navigateFunction(path);
}
