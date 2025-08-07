/**
 * Lightweight router for dyad screens
 */

export type DyadType = 'night' | 'tantrum' | 'meal';
export type ScreenType = 'home' | 'capture' | 'thermo' | 'history' | 'settings' | 'meal-logging' | 'insights' | 'gallery' | 'form';

export interface Route {
  dyad: DyadType;
  screen: ScreenType;
  params?: Record<string, string>;
}

export class Router {
  private routes: Map<string, () => void> = new Map();
  private currentRoute: Route | null = null;

  constructor() {
    this.handleHashChange = this.handleHashChange.bind(this);
    window.addEventListener('hashchange', this.handleHashChange);
    window.addEventListener('load', this.handleHashChange);
  }

  public register(route: Route, handler: () => void): void {
    const key = this.routeToKey(route);
    this.routes.set(key, handler);
  }

  public navigate(route: Route): void {
    const hash = this.routeToHash(route);
    window.location.hash = hash;
  }

  public getCurrentRoute(): Route | null {
    return this.currentRoute;
  }

  private routeToKey(route: Route): string {
    return `${route.dyad}:${route.screen}`;
  }

  private routeToHash(route: Route): string {
    let hash = `#${route.dyad}/${route.screen}`;
    if (route.params) {
      const params = new URLSearchParams(route.params);
      hash += `?${params.toString()}`;
    }
    return hash;
  }

  private hashToRoute(hash: string): Route {
    // Remove leading # and split
    const path = hash.substring(1);
    const [pathPart, queryPart] = path.split('?');
    const [dyad, screen] = pathPart.split('/');

    const route: Route = {
      dyad: (dyad as DyadType) || 'night',
      screen: (screen as ScreenType) || 'home'
    };

    if (queryPart) {
      const params = new URLSearchParams(queryPart);
      route.params = Object.fromEntries(params.entries());
    }

    return route;
  }

  private handleHashChange(): void {
    const hash = window.location.hash || '#night/home';
    const route = this.hashToRoute(hash);
    this.currentRoute = route;

    const key = this.routeToKey(route);
    const handler = this.routes.get(key);

    if (handler) {
      handler();
    } else {
      console.warn(`No handler found for route: ${key}`);
      // Fallback to home screen
      const fallbackKey = `${route.dyad}:home`;
      const fallbackHandler = this.routes.get(fallbackKey);
      if (fallbackHandler) {
        fallbackHandler();
      }
    }
  }

  public destroy(): void {
    window.removeEventListener('hashchange', this.handleHashChange);
    window.removeEventListener('load', this.handleHashChange);
  }
} 