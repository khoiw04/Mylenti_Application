import { useEffect, useState } from "react";
import { loadSetting } from "@/store";

export type Theme = "light" | "dark";

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    (async () => {
        const savedTheme = await loadSetting('theme')
        if (savedTheme === "dark" || savedTheme === "light") {
            setTheme(savedTheme);
            document.documentElement.classList.toggle("dark", savedTheme === "dark");
        }}
    )
  }, []);

  return { theme, setTheme };
}