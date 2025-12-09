"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const hasInteracted = useRef(false);

  useEffect(() => {
    // Read initial state from DOM (set by ThemeScript before React hydrates)
    const htmlElement = document.documentElement;
    const initialDark = htmlElement.classList.contains('dark');
    setIsDark(initialDark);
    setMounted(true);
  }, []);

  // Update isDark when resolvedTheme changes
  useEffect(() => {
    if (mounted && resolvedTheme) {
      setIsDark(resolvedTheme === "dark");
    }
  }, [mounted, resolvedTheme]);

  const toggleTheme = () => {
    hasInteracted.current = true;
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
  };

  // Only apply dynamic styles after mount to prevent hydration issues
  const buttonStyle = mounted ? {
    backgroundColor: isDark ? "#374151" : "#d1d5db",
  } : undefined;

  return (
    <button
      onClick={toggleTheme}
      className="cursor-hover relative w-[36px] h-[20px] rounded-full p-0.5 bg-gray-300 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      data-cursor-rounded="full"
      style={buttonStyle}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Switch theme"}
    >
      <motion.div
        className="w-[16px] h-[16px] bg-white rounded-full relative flex items-center justify-center pt-0.5"
        initial={false}
        animate={{
          x: mounted ? (isDark ? 14 : 0) : 0,
        }}
        transition={hasInteracted.current ? {
          type: "spring",
          stiffness: 500,
          damping: 30,
        } : { duration: 0 }}
      >
        {mounted && isDark ? (
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
