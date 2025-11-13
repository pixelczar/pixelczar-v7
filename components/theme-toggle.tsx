"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Ensure dark mode is set as default on first load
    if (!localStorage.getItem("pixel-czar-theme")) {
      setTheme("dark");
      localStorage.setItem("pixel-czar-theme", "dark");
    }
  }, [setTheme]);

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="w-[36px] h-[20px] bg-slate-600 rounded-full p-[2px]">
        <div
          className="w-[16px] h-[16px] bg-white rounded-full"
          style={{ transform: "translateX(14px)" }}
        />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
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
        className="w-[16px] h-[16px] bg-white rounded-full  relative flex items-center justify-center pt-0.5"
        animate={{
          x: isDark ? 14 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          <motion.div
            className="absolute"
            initial={{ scale: 0, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: -90 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            <div className="w-[13px] h-[13px] ml-[-7px] mt-[-3px] bg-gray-700 rounded-full" />
          </motion.div>
        ) : (
          <motion.div
            className="absolute"
            initial={{ scale: 0, opacity: 0, rotate: 90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 90 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            <div className="w-[8px] h-[8px] ml-[-1px] mt-[-2px] bg-accent rounded-full" />
          </motion.div>
        )}
      </motion.div>
    </button>
  );
}
