import { Final } from "./lib_export";
import { computed, signal, batch, ReadonlySignal } from "./wrapper";

/**
 * Conditional Element
 */
export const C = (items: [predicate: (() => boolean) | null, then: Final<HTMLElement>][]) => {
  return () => {
    const fallback = items.find(([predicate]) => predicate === null)?.[1];

    return items.find(([predicate]) => predicate?.())?.[1] ?? fallback;
  };
};

type State = "processing" | "completed" | "errored";

/**
 * Async Computation
 */
export const A = <T>(task: (() => Promise<T>) | Promise<T>, handler: (state: ReadonlySignal<State>, data: ReadonlySignal<T | undefined>) => Final<any>) => {
  const data = signal<T | undefined>();
  const state = signal<State>("processing");
  const result = handler(
    computed(() => state.value),
    computed(() => data.value)
  );

  (typeof task === "function" ? task() : task)
    .then((r) => {
      batch(() => {
        state.value = "completed";
        data.value = r;
      });
    })
    .catch((e) => {
      batch(() => {
        state.value = "errored";
        data.value = e;
      });
    });

  return result;
};
