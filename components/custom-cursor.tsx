"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

export default function CustomCursor() {
  // Use motion values for smooth, performant updates outside React render cycle
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  // Spring-smoothed values for the outer ring with ultra-smooth settings
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  // Separate springs for size and border radius with slightly different feel
  const cursorWidth = useMotionValue(32);
  const cursorHeight = useMotionValue(32);
  const cursorBorderRadius = useMotionValue(50);
  
  const smoothWidth = useSpring(cursorWidth, { damping: 20, stiffness: 200 });
  const smoothHeight = useSpring(cursorHeight, { damping: 20, stiffness: 200 });
  const smoothBorderRadius = useSpring(cursorBorderRadius, { damping: 20, stiffness: 200 });
  
  // Offset for centering (half of default size)
  const offsetX = useMotionValue(-16);
  const offsetY = useMotionValue(-16);
  const smoothOffsetX = useSpring(offsetX, springConfig);
  const smoothOffsetY = useSpring(offsetY, springConfig);

  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hideOuter, setHideOuter] = useState(false);
  const [hideBorder, setHideBorder] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);
  const hasMouseMoved = useRef(false);
  const rafRef = useRef<number | undefined>(undefined);

  // Helper function to get background color of element
  const getBackgroundColor = (element: Element | null): string | null => {
    if (!element) return null;
    
    const computed = window.getComputedStyle(element);
    let bgColor = computed.backgroundColor;
    
    // If background is transparent, check parent
    if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
      const parent = element.parentElement;
      if (parent && parent !== document.body) {
        return getBackgroundColor(parent);
      }
      // Default to body background
      return window.getComputedStyle(document.body).backgroundColor;
    }
    
    return bgColor;
  };

  // Helper function to calculate brightness from RGB
  const getBrightness = (rgb: string): number => {
    // Parse rgb/rgba string
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return 128; // Default to medium brightness
    
    const r = parseInt(match[0]);
    const g = parseInt(match[1]);
    const b = parseInt(match[2]);
    
    // Calculate relative luminance (perceived brightness)
    // Using the formula: 0.299*R + 0.587*G + 0.114*B
    return (r * 0.299 + g * 0.587 + b * 0.114);
  };

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Use requestAnimationFrame for smooth updates
      rafRef.current = requestAnimationFrame(() => {
        // On first mouse move, jump directly to position without animation
        if (!hasMouseMoved.current) {
          hasMouseMoved.current = true;
          // Jump springs to current position instantly
          cursorX.jump(e.clientX);
          cursorY.jump(e.clientY);
          mouseX.set(e.clientX);
          mouseY.set(e.clientY);
          return;
        }
        
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);

        // Detect if cursor is over a dark element for dot inversion
        const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
        if (elementUnderCursor) {
          const bgColor = getBackgroundColor(elementUnderCursor);
          if (bgColor) {
            const brightness = getBrightness(bgColor);
            // If brightness is less than 128 (midpoint), it's dark
            setIsOverDark(brightness < 128);
          }
        }

        // Check if the element or any parent has data-cursor-ignore
        const target = e.target as Element;
        if (target.closest("[data-cursor-ignore]")) {
          offsetX.set(-16);
          offsetY.set(-16);
          cursorWidth.set(32);
          cursorHeight.set(32);
          cursorBorderRadius.set(50);
          return;
        }

        // Check for interactable elements
        const interactable = target.closest(".cursor-hover");

        if (interactable) {
          // Check if we should target a specific element (like logo symbol)
          let targetElement = interactable as HTMLElement;
          const cursorTarget = interactable.getAttribute("data-cursor-target");
          if (cursorTarget) {
            const specificTarget = document.getElementById(cursorTarget);
            if (specificTarget) {
              targetElement = specificTarget;
            }
          }
          
          const rect = targetElement.getBoundingClientRect();
          
          // Check if the element should be circular
          const isCircle = interactable.hasAttribute("data-cursor-shape") &&
            interactable.getAttribute("data-cursor-shape") === "circle";
          
          // Check if the target element has rounded-full class or data attribute
          const computedStyle = window.getComputedStyle(targetElement);
          const hasRoundedFull = targetElement.hasAttribute("data-cursor-rounded") ||
            targetElement.classList.contains("rounded-full") ||
            computedStyle.borderRadius.includes("9999") ||
            computedStyle.borderRadius === "50%";
          
          // Calculate cursor dimensions with padding
          const padding = hasRoundedFull ? 8 : 4;
          
          if (isCircle) {
            // Perfect circle - use the larger dimension + padding to match ring size
            // Logo rings are 90px at scale 0.75 = 67.5px, so we need more padding to match visual size
            const size = Math.max(rect.width, rect.height) + 20;
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Override mouse position to snap to element center
            mouseX.set(centerX);
            mouseY.set(centerY);
            offsetX.set(-size / 2);
            offsetY.set(-size / 2);
            cursorWidth.set(size);
            cursorHeight.set(size);
            cursorBorderRadius.set(size / 2);
          } else {
            const newWidth = rect.width + padding;
            const newHeight = rect.height + padding;
            const newBorderRadius = hasRoundedFull ? newHeight / 2 : 8;
            
            // Snap cursor to element position
            mouseX.set(rect.left + rect.width / 2);
            mouseY.set(rect.top + rect.height / 2);
            offsetX.set(-newWidth / 2);
            offsetY.set(-newHeight / 2);
            cursorWidth.set(newWidth);
            cursorHeight.set(newHeight);
            cursorBorderRadius.set(newBorderRadius);
          }
        } else {
          // Default cursor state
          offsetX.set(-16);
          offsetY.set(-16);
          cursorWidth.set(32);
          cursorHeight.set(32);
          cursorBorderRadius.set(50);
        }
      });
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

    // Use passive event listener for better scroll performance
    document.addEventListener("mousemove", updateMousePosition, { passive: true });
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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
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
  }, [mouseX, mouseY, offsetX, offsetY, cursorWidth, cursorHeight, cursorBorderRadius]);

  return (
    <>
      {/* Main morphing cursor - uses spring-smoothed values */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: smoothOffsetX,
          translateY: smoothOffsetY,
          width: smoothWidth,
          height: smoothHeight,
          borderRadius: smoothBorderRadius,
          opacity: isVisible ? (hideOuter ? 0 : 1) : 0,
          backgroundColor: isClicking
            ? "hsl(var(--accent) / 0.3)"
            : "transparent",
          border: hideBorder ? "none" : "1px solid hsl(var(--accent))",
        }}
      />

      {/* Small pointer dot - follows mouse exactly for responsiveness */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[10000]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: -4,
          translateY: -4,
          opacity: isVisible ? 1 : 0,
          backgroundColor: "var(--foreground)",
          mixBlendMode: "exclusion",
        }}
      />
    </>
  );
}
