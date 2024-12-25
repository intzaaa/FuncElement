const default_config = {
  document: globalThis?.document,
} as const;

export let config = default_config;

export const set_config = (_config: Partial<typeof default_config>) => {
  return Object.assign(config, _config);
};
