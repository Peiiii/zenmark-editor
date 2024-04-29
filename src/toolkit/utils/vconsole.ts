export const initVConsole = (options?: { triggerParamKey: string }) => {
    const { triggerParamKey = "debug" } = { ...options };

    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams, triggerParamKey);

    if (urlParams.has(triggerParamKey)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import("https://esm.sh/vconsole@latest" as any).then((m) => {
            new m.default();
        });
    }
}