import { isNil } from "ramda";

import type { Final } from "./lib/lib_export";
import { signal } from "./lib/lib_export";
import { element } from "./element";
import { plain_matcher } from "./lib/router_matchers";
import { config } from "./config";

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

export const location = signal<URL>(
  config.location
    ? new URL(config.location.href)
    : // Undefined Behavior
      (undefined as any)
);

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

if (config?.window?.onpopstate) {
  config.window.onpopstate = () => {
    location.value = new URL(config.window.location.href);
  };
}

/**
 * Router Root Element
 */
export const create_router = (fallback?: RouteElement) => {
  const default_fallback: RouteElement = () => element("div", {}, ["404 Not Found"]);

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

          const url = new URL(event.target.href, config.window.location.href);
          if (location.value.href !== event.target.href && location.value.origin === url.origin) {
            event.preventDefault();
            location.value = url;
            config.window.history.pushState({}, "", location.value.href);
          }
        }
      },
    },
    [
      () => {
        const loc = location.value;
        return (match(loc.pathname) || (fallback ?? default_fallback))({
          location: loc,
        });
      },
    ]
  );
};
