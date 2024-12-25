import { minimatch } from "minimatch";

import { RouteMatcher } from "../router";

/**
 * Plain Matcher
 */
export const plain_matcher: (p1: string) => RouteMatcher = (p1) => (p2) => p1 === p2;

/**
 * Regular Expression Matcher
 */
export const regexp_matcher: (regexp: RegExp) => RouteMatcher = (regexp) => (p) => regexp.test(p);

/**
 * Glob Matcher
 */
export const glob_matcher: (glob: string) => RouteMatcher = (glob) => (p) => minimatch(p, glob);
