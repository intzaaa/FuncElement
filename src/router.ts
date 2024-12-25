import { isNil } from "ramda";

import type { Final, ReadonlySignal } from "./lib/lib_export";
import { signal } from "./lib/lib_export";
import { element } from "./element";
import { plain_matcher } from "./lib/router_matchers";

export type RouteData = {
  location: URL;
};

export type RouteMatcher = (path: string) => boolean;

export type RouteElement = (data: RouteData) => Final<HTMLElement>;

export type RouteEntry = {
  matcher: RouteMatcher;
  element: RouteElement;
};

const registry: RouteEntry[] = [];

const _location = signal<URL>(new URL(window.location.href));

export const location: ReadonlySignal<URL> = _location;

/**
 * Declare a Route Entry
 */
export const router = (items: [matcher: RouteMatcher | string, element: RouteElement][]) => {
  registry.push(
    ...items.map(([matcher, element]) => {
      if (typeof matcher === "string") {
        return {
          matcher: plain_matcher(matcher),
          element,
        };
      } else {
        return { matcher, element };
      }
    })
  );
};

const match = (path: string) => {
  const entry = registry.find(({ matcher }) => matcher(path));
  return entry ? entry.element : null;
};

window.onpopstate = () => {
  _location.value = new URL(window.location.href);
};

/**
 * Router Root Element
 */
export const create_router = (fallback?: RouteElement) => {
  const defaultFallback: RouteElement = () => element("div", {}, ["404 Not Found"]);

  return element(
    "div",
    {
      style: {
        display: "contents",
        width: "100%",
        height: "100%",
      },
      onclick(event) {
        if (event.target && event.target instanceof HTMLAnchorElement) {
          if (isNil(event.target.href)) {
            return;
          }

          const url = new URL(event.target.href, window.location.href);
          if (_location.value.href !== event.target.href && _location.value.origin === url.origin) {
            event.preventDefault();
            _location.value = url;
            window.history.pushState({}, "", _location.value.href);
          }
        }
      },
    },
    [
      () => {
        const loc = _location.value;
        return (match(loc.pathname) || (fallback ?? defaultFallback))({
          location: loc,
        });
      },
    ]
  );
};
