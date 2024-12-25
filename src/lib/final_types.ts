import { Signal } from "@preact/signals-core";

export type StaticFinal<T> = T | ((...argv: any) => StaticFinal<StaticFinal<T>>);

export type Final<T> = T | ((...argv: any) => Final<T>) | Signal<Final<T>> | StaticFinal<T>;
