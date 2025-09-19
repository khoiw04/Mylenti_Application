"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { saveSetting } from "@/store";

const themes = [
  {
    key: "light",
    icon: Sun,
    label: "Light theme",
  },
  {
    key: "dark",
    icon: Moon,
    label: "Dark theme",
  },
];

export type ThemeSwitcherProps = {
  value?: "light" | "dark";
  onChange?: (theme: "light" | "dark") => void;
  defaultValue?: "light" | "dark";
  className?: string;
};

export const ThemeSwitcher = ({
  value,
  onChange,
  defaultValue = "light",
  className,
}: ThemeSwitcherProps) => {
  const [theme, setTheme] = useControllableState({
    defaultProp: defaultValue,
    prop: value,
    onChange,
  });
  const [mounted, setMounted] = useState(false);

  const handleThemeClick = useCallback(
    async (themeKey: "light" | "dark") => {
      setTheme(themeKey);
      await saveSetting("theme", themeKey);
      document.documentElement.classList.toggle("dark", themeKey === "dark");
    },
    [setTheme]
  );

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative isolate flex h-6 gap-2 rounded-full bg-background items-center px-1.5 py-3.4 ring-1 ring-border",
        className
      )}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;

        return (
          <button
            aria-label={label}
            className="relative size-4 rounded-full"
            key={key}
            onClick={() => handleThemeClick(key as "light" | "dark")}
            type="button"
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-secondary"
                layoutId="activeTheme"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <Icon
              className={cn(
                "relative z-10 m-auto h-4 w-4",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
