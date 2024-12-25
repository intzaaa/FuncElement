import type CSS from "csstype";

import type { Final, StaticFinal } from "./lib/final_types";
import { effect } from "./lib/lib_export";
import { value, assign } from "./lib/utils";
import { config } from "./config";

type Override<What, With> = Omit<What, keyof With> & With;

/**
 * Declare a HTML Element
 */
export const element = <T extends keyof HTMLElementTagNameMap>(
  tag: StaticFinal<T>,
  atr?: Final<
    Partial<
      Override<
        HTMLElementTagNameMap[T],
        {
          style: Partial<CSS.Properties>;
          action: (self: HTMLElementTagNameMap[T]) => void;
        }
      >
    >
  >,
  sub?: StaticFinal<Final<any>[]>
): HTMLElementTagNameMap[T] => {
  const ele = config.document.createElement(value(tag));

  effect(() => {
    if (atr) assign(value, ele, value(atr));
  });

  if (sub !== undefined) {
    for (const item of value(sub)) {
      let last: Node | undefined = undefined;

      effect(() => {
        const curr = value(item);
        const node = curr instanceof Node ? curr : config.document.createTextNode(String(curr));

        if (last == undefined) {
          last = ele.appendChild(node);
        } else {
          ele.replaceChild(node, last);
        }
      });
    }
  }

  effect(() => {
    value(atr)?.action?.(ele);
  });

  return ele;
};
