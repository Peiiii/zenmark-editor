import { useMemo, useState } from "react";

export function useContentSync(content: string) {
  const [listeners, setListeners] = useState<Array<(content: string) => void>>(
    []
  );

  const pushToSubscribers = (next: string) => {
    listeners.forEach((l) => l(next));
  };

  const subscribeContent = (cb: (s: string) => void) => {
    setListeners((arr) => [...arr, cb]);
    return () => setListeners((arr) => arr.filter((x) => x !== cb));
  };

  const readContent = useMemo(() => {
    return () => Promise.resolve(content);
  }, [content]);

  const writeContent = (next: string) => {
    pushToSubscribers(next);
    return Promise.resolve();
  };

  return {
    readContent,
    writeContent,
    subscribeContent,
    pushToSubscribers,
  };
}

