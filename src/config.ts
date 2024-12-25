export const default_config = {
  document: globalThis?.document,
} as const;

export let config = default_config;

export const set_config = (_config: typeof default_config) => {
  config = _config;
};
