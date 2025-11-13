"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState({
    x: 0,
    y: 0,
    width: 32, // 2rem
    height: 32, // 2rem
    borderRadius: 50,
  });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMagnetized, setIsMagnetized] = useState(false);
  const [hideOuter, setHideOuter] = useState(false);
  const [hideBorder, setHideBorder] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check for interactable elements
      const interactable = (e.target as Element).closest(".cursor-hover");

      if (interactable) {
        setIsMagnetized(true);
        
        // Check if we should target a specific element (like logo symbol)
        let targetElement = interactable as HTMLElement;
        const cursorTarget = interactable.getAttribute("data-cursor-target");
        if (cursorTarget) {
          const target = document.getElementById(cursorTarget);
          if (target) {
            targetElement = target;
          }
        }
        
        const rect = targetElement.getBoundingClientRect();
        
        // Check if the element should be circular
        const isCircle = interactable.hasAttribute("data-cursor-shape") &&
          interactable.getAttribute("data-cursor-shape") === "circle";
        
        // Check if the element has rounded-full class or data attribute (like the toggle)
        const computedStyle = window.getComputedStyle(interactable as Element);
        const hasRoundedFull = interactable.hasAttribute("data-cursor-rounded") ||
          interactable.classList.contains("rounded-full") ||
          computedStyle.borderRadius.includes("9999") ||
          computedStyle.borderRadius === "50%";
        
        // Calculate cursor dimensions with padding
        // Add more padding for rounded-full elements (like toggle)
        const padding = hasRoundedFull ? 8 : 4;
        const cursorWidth = rect.width + padding;
        const cursorHeight = rect.height + padding;
        
        // Use circular border radius for circle shape, pill shape for rounded-full, or default
        let borderRadius: number;
        let finalWidth = cursorWidth;
        let finalHeight = cursorHeight;
        
        if (isCircle) {
          // Perfect circle - match the ring size when hovered (90px * 0.75 scale = 67.5px, rounded to 68px)
          const ringSize = 90 * 0.75;
          finalWidth = ringSize;
          finalHeight = ringSize;
          borderRadius = ringSize / 2;
          // Center the cursor on the logo element
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          setCursorState({
            x: centerX - ringSize / 2,
            y: centerY - ringSize / 2,
            width: finalWidth,
            height: finalHeight,
            borderRadius: borderRadius,
          });
          return; // Early return to skip the default setCursorState below
        } else if (hasRoundedFull) {
          // Pill shape (half of height)
          borderRadius = cursorHeight / 2;
        } else {
          // Default rounded corners
          borderRadius = 8;
        }
        
        setCursorState({
          x: rect.left - padding / 2,
          y: rect.top - padding / 2,
          width: finalWidth,
          height: finalHeight,
          borderRadius: borderRadius,
        });
      } else {
        setIsMagnetized(false);
        setCursorState({
          x: e.clientX - 16,
          y: e.clientY - 16,
          width: 32,
          height: 32,
          borderRadius: 50,
        });
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleHideCursorOuter = (e: CustomEvent) => {
      setHideOuter(e.detail);
    };

    const handleHideCursorBorder = (e: CustomEvent) => {
      setHideBorder(e.detail);
    };

    document.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener(
      "hideCursorOuter",
      handleHideCursorOuter as EventListener
    );
    window.addEventListener(
      "hideCursorBorder",
      handleHideCursorBorder as EventListener
    );

    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener(
        "hideCursorOuter",
        handleHideCursorOuter as EventListener
      );
      window.removeEventListener(
        "hideCursorBorder",
        handleHideCursorBorder as EventListener
      );
    };
  }, []);

  return (
    <>
      {/* Main morphing cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          opacity: isVisible ? (hideOuter ? 0 : 1) : 0,
          backgroundColor: isClicking
            ? "hsl(var(--accent) / 0.3)"
            : "transparent",
          border: hideBorder ? "none" : "1px solid hsl(var(--accent))",
        }}
        animate={{
          x: cursorState.x,
          y: cursorState.y,
          width: cursorState.width,
          height: cursorState.height,
          borderRadius: cursorState.borderRadius === 50 || 
            (cursorState.width === cursorState.height && cursorState.borderRadius === cursorState.width / 2)
            ? "50%" 
            : `${cursorState.borderRadius}px`,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.5,
        }}
      />

      {/* Small pointer dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[10000]"
        style={{
          opacity: isVisible ? 1 : 0,
          backgroundColor: "var(--foreground)",
        }}
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: "tween",
          duration: 0,
        }}
      />
    </>
  );
}
