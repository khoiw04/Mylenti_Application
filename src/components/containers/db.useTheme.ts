/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { useStore } from "@tanstack/react-store";
import { ThemeStore, loadSetting, saveSetting } from "@/store";
import useTauriSafeEffect from "@/hooks/useTauriSideEffect";

export default function useTheme() {
  const { theme, setTheme } = useStore(ThemeStore)

  function updateMetaTheme(isDark: boolean) {
    let colorSchemeMeta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null;
    if (!colorSchemeMeta) {
      colorSchemeMeta = document.createElement('meta') as HTMLMetaElement;
      colorSchemeMeta.setAttribute('name', 'color-scheme');
      document.head.appendChild(colorSchemeMeta);
    }

    let themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta') as HTMLMetaElement;
      themeColorMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColorMeta);
    }

    colorSchemeMeta.setAttribute('content', isDark ? 'dark light' : 'light dark');
    themeColorMeta.setAttribute('content', isDark ? '#1e2327' : '#ffffff');
  }

  useTauriSafeEffect(() => {
    (async () => {
      const savedTheme = await loadSetting("theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
        const isDark = savedTheme === "dark";
        document.documentElement.classList.toggle("dark", isDark);
        updateMetaTheme(isDark);
      }
    })();
  }, []);

  useTauriSafeEffect(() => {
    (async () => {
      const currentTheme = theme ?? "dark";
      await saveSetting("theme", currentTheme);
      const isDark = currentTheme === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      updateMetaTheme(isDark);
    })();
  }, [theme])
}