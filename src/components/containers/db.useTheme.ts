import { useState } from "react";
import { loadSetting, saveSetting } from "@/store";
import useTauriSafeEffect from "@/hooks/useTauriSideEffect";

export default function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  useTauriSafeEffect(() => {
    (async () => {
      const savedTheme = await loadSetting("theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    })();
  }, []);

  useTauriSafeEffect(() => {
    (async () => {
      await saveSetting("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    })();
  }, [theme]);

  return { theme, setTheme };
}