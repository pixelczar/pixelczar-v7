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

  // Use resolved theme when mounted, otherwise default to dark for consistent SSR
  // This prevents hydration mismatches by ensuring server and client render the same initially
  const isDark = mounted ? resolvedTheme === "dark" : true;

  const toggleTheme = () => {
    hasInteracted.current = true;
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("pixel-czar-theme", newTheme);
  };

  // Ensure consistent initial render to prevent hydration mismatch
  // Only apply dynamic styles after component has mounted
  const buttonStyle = mounted ? {
    backgroundColor: isDark ? "#374151" : "#d1d5db",
  } : {
    backgroundColor: "#374151", // Default to dark for SSR
  };

  return (
    <button
      onClick={toggleTheme}
      className="cursor-hover relative w-[36px] h-[20px] rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      data-cursor-rounded="full"
      style={buttonStyle}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Switch theme"}
    >
      <motion.div
        className="w-[16px] h-[16px] bg-white rounded-full relative flex items-center justify-center pt-0.5"
        initial={false}
        animate={{
          x: mounted ? (isDark ? 14 : 0) : 14, // Default to dark position for SSR
        }}
        transition={hasInteracted.current ? {
          type: "spring",
          stiffness: 500,
          damping: 30,
        } : { duration: 0 }}
      >
        {(mounted ? isDark : true) ? (
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
