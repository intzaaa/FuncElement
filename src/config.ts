const default_config = {
  window: globalThis?.window,
  document: globalThis?.window?.document,
  location: globalThis?.window?.location,
} as const;

export let config = default_config;

export const set_config = (_config: Partial<typeof default_config>) => Object.assign(config, _config);
