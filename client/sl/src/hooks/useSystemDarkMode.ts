import { useEffect, useState } from "react";
/**
 * 
 * @deprecated 
 * @returns isDarkMode: boolean
 */
export default function useSystemDarkMode() {
  const getIsDark = () =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [isDarkMode, setIsDarkMode] = useState(getIsDark);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDarkMode;
}
