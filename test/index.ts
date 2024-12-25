import { set_config, element, signal } from "../src/export";
import { JSDOM } from "jsdom";

const dom = new JSDOM();
dom.reconfigure({
  url: "http://localhost",
});
dom.window.location;
set_config({
  window: dom.window as any,
  document: dom.window.document,
  location: dom.window.location,
});

const sig = signal("abc");

const ele = element("p", {}, ["OK", sig]);

console.log(ele.outerHTML);

sig.value = "cde";

console.log(ele.outerHTML);
