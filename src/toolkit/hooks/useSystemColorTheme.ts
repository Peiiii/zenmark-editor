import { useEffect, useState } from "react";

type SystemColorScheme = "light" | "dark" | undefined;

function useSystemColorScheme(): SystemColorScheme {
  const [systemColorScheme, setSystemColorScheme] =
    useState<SystemColorScheme>(getInitialSystemColorScheme());

  function getInitialSystemColorScheme(): SystemColorScheme {
    const userPreference = window.matchMedia("(prefers-color-scheme: dark)");
    return userPreference.matches ? "dark" : "light";
  }

  useEffect(() => {
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemColorScheme(event.matches ? "dark" : "light");
    };

    const userPreference = window.matchMedia("(prefers-color-scheme: dark)");
    userPreference.addEventListener("change", handleChange);

    return () => {
      userPreference.removeEventListener("change", handleChange);
    };
  }, []);

  return systemColorScheme;
}

export default useSystemColorScheme;
