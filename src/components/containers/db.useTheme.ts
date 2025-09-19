import { useStore } from "@tanstack/react-store";
import { ThemeStore, loadSetting, saveSetting } from "@/store";
import useTauriSafeEffect from "@/hooks/useTauriSideEffect";

export default function useTheme() {
  const { theme, setTheme } = useStore(ThemeStore)
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
      await saveSetting("theme", theme ?? 'dark');
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    })();
  }, [theme]);
}