export interface Plugin<TContext> {
  activate(context: TContext): void;
}
export const createPluginService = <TContext>(context: TContext) => {
  const usedPlugins: Plugin<TContext>[] = [];
  const use = (plugins: Plugin<TContext>[] | Plugin<TContext>) => {
    if (!Array.isArray(plugins)) {
      plugins = [plugins];
    }
    plugins.forEach((plugin) => {
      usedPlugins.push(plugin);
      plugin.activate(context);
    });
  };
  return {
    use,
  };
};
