"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const hasInteracted = useRef(false);

  useEffect(() => {
    setMounted(true);

    // Ensure dark mode is set as default on first load
    if (!localStorage.getItem("pixel-czar-theme")) {
      setTheme("dark");
      localStorage.setItem("pixel-czar-theme", "dark");
    }
  }, [setTheme]);

  // Get the initial theme from localStorage or default to dark
  // This prevents the toggle from jumping on load
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("pixel-czar-theme") || "dark";
    }
    return "dark";
  };

  // Use resolved theme when mounted, otherwise use initial theme
  const isDark = mounted ? resolvedTheme === "dark" : getInitialTheme() === "dark";

  const toggleTheme = () => {
    hasInteracted.current = true;
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("pixel-czar-theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="cursor-hover relative w-[36px] h-[20px] rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      data-cursor-rounded="full"
      style={{
        backgroundColor: isDark ? "#374151" : "#d1d5db",
      }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        className="w-[16px] h-[16px] bg-white rounded-full relative flex items-center justify-center pt-0.5"
        initial={false}
        animate={{
          x: isDark ? 14 : 0,
        }}
        transition={hasInteracted.current ? {
          type: "spring",
          stiffness: 500,
          damping: 30,
        } : { duration: 0 }}
      >
        {isDark ? (
          <motion.div
            className="absolute"
            initial={hasInteracted.current ? { scale: 0, opacity: 0, rotate: -90 } : false}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={hasInteracted.current ? { 
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 20
            } : { duration: 0 }}
          >
            <div className="w-[13px] h-[13px] ml-[-7px] mt-[-3px] bg-gray-700 rounded-full" />
          </motion.div>
        ) : (
          <motion.div
            className="absolute"
            initial={hasInteracted.current ? { scale: 0, opacity: 0, rotate: 90 } : false}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={hasInteracted.current ? { 
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 20
            } : { duration: 0 }}
          >
            <div className="w-[8px] h-[8px] ml-[-1px] mt-[-2px] bg-accent rounded-full" />
          </motion.div>
        )}
      </motion.div>
    </button>
  );
}
