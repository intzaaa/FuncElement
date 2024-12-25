import { is } from "ramda";
import { Final } from "./final_types";
import { Signal } from "@preact/signals-core";

export const STOP = Symbol("STOP");

export const value = <T>(val: Final<T>): T => {
  if (is(Function, val)) {
    return value(val());
  } else if (is(Signal, val)) {
    return value((val as Signal).value);
  } else if (Array.isArray(val) && val[0] === STOP) {
    return val[1];
  } else {
    return val;
  }
};

type obj = {
  [k: string | symbol | number]: any;
};

export const assign = (f: Function, x: obj, y: obj) => {
  Object.entries(y).forEach(([key, value]) => {
    if (typeof value === "object") {
      assign(f, x[key] || {}, value);
    } else {
      x[key] = value;
    }
  });
};
