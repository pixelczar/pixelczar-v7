"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import AnimatedLogo from "@/components/animated-logo";
import MagneticLink from "@/components/magnetic-link";

const logoVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const navVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <header className="flex items-center justify-between p-6 theme-transition">
      <motion.div
        variants={logoVariants}
        initial={isHomepage ? "hidden" : "visible"}
        animate="visible"
        transition={isHomepage ? { delay: 1.5, duration: 1.2, ease: [0.16, 1.0, 0.3, 1.0] } : { duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <Link
          href="/"
          className="flex items-center space-x-4 z-50 cursor-hover group"
          data-cursor-target="logo-symbol"
          data-cursor-shape="circle"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          onClick={() => {
            setIsLogoHovered(true);
            setTimeout(() => setIsLogoHovered(false), 300);
          }}
        >
          <div id="logo-symbol">
            <AnimatedLogo isHovered={isLogoHovered} />
          </div>
          <span className="text-body font-sans font-medium theme-transition text-gray-600 dark:text-white/40 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
            Home
          </span>
        </Link>
      </motion.div>

      <motion.nav 
        className="hidden md:flex items-center space-x-6"
        variants={navVariants}
        initial={isHomepage ? "hidden" : "visible"}
        animate="visible"
        transition={isHomepage ? { delay: 1.8, duration: 1.0, ease: [0.16, 1.0, 0.3, 1.0] } : { duration: 0.6, ease: [0.19, 1.0, 0.22, 1.0] }}
      >

        <MagneticLink
          href="/about"
          className={`text-base font-sans font-normal transition-all duration-300 relative px-3 py-1 rounded-full hover:text-white ${
            pathname === "/about"
              ? "font-medium"
              : "hover:text-primary"
          }`}
          style={pathname === "/about" ? { color: 'hsl(var(--accent))' } : { color: 'var(--muted-foreground)' }}
        >
          About
        </MagneticLink>
        <MagneticLink
          href="/work"
          className={`text-base font-sans font-normal transition-all duration-300 relative px-3 py-1 rounded-full hover:text-white ${
            pathname === "/work"
              ? "font-medium"
              : "hover:text-primary"
          }`}
          style={pathname === "/work" ? { color: 'hsl(var(--accent))' } : { color: 'var(--muted-foreground)' }}
        >
          Pixels Pushed
        </MagneticLink>
        
        {/* <MagneticLink
          href="/archive"
          className={`text-base font-sans font-normal transition-all duration-300 relative px-3 py-1 mr-6 rounded-full hover:text-white ${
            pathname === "/archive"
              ? "font-medium"
              : "hover:text-primary"
          }`}
          style={pathname === "/archive" ? { color: 'hsl(var(--accent))' } : { color: 'var(--muted-foreground)' }}
        >
          Archive
        </MagneticLink> */}
        <div className="pt-0.5 flex pl-6">
          <ThemeToggle />
        </div>
      </motion.nav>

      
      <div className="md:hidden flex items-center space-x-4">
        <ThemeToggle />
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-muted-foreground hover:text-primary transition-colors duration-300 z-50 relative w-8 h-8 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-5 flex flex-col justify-between">
            {/* Top line - morphs to top-left of X */}
            <motion.div
              className="h-0.5 bg-current rounded-full"
              animate={{
                rotate: isMenuOpen ? 45 : 0,
                y: isMenuOpen ? 10 : 0,
              }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{ transformOrigin: "center" }}
            />
            {/* Middle line - fades out */}
            <motion.div
              className="h-0.5 bg-current rounded-full"
              animate={{
                opacity: isMenuOpen ? 0 : 1,
                scaleX: isMenuOpen ? 0 : 1,
              }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
            {/* Bottom line - morphs to bottom-right of X */}
            <motion.div
              className="h-0.5 bg-current rounded-full"
              animate={{
                rotate: isMenuOpen ? -45 : 0,
                y: isMenuOpen ? -8 : 0,
              }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{ transformOrigin: "center" }}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 dark:bg-gray-900/80 bg-white/30 z-40 md:hidden theme-transition"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.15,
                  },
                },
              }}
              className="flex flex-col items-center justify-center h-full space-y-8 theme-transition"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.23, 1, 0.32, 1],
                    },
                  },
                }}
              >
                <MagneticLink
                  href="/"
                  className={`text-6xl font-sans tracking-tight font-medium transition-all duration-300 relative px-4 py-2 ${
                    pathname === "/"
                      ? "text-accent"
                      : "hover:text-accent"
                  }`}
                  style={pathname !== "/" ? { color: 'var(--muted-foreground)' } : undefined}
                  onClick={() => {
                    // Hide cursor outline immediately during navigation
                    window.dispatchEvent(new CustomEvent('hideCursorOuter', { detail: true }));
                    setIsMenuOpen(false);
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('hideCursorOuter', { detail: false }));
                    }, 2500);
                  }}
                >
                  Home
                </MagneticLink>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.23, 1, 0.32, 1],
                    },
                  },
                }}
              >
                <MagneticLink
                  href="/work"
                  className={`text-6xl font-sans tracking-tight font-medium transition-all duration-300 relative px-4 py-2 ${
                    pathname === "/work"
                      ? "text-accent"
                      : "hover:text-accent"
                  }`}
                  style={pathname !== "/work" ? { color: 'var(--muted-foreground)' } : undefined}
                  onClick={() => {
                    // Hide cursor outline immediately during navigation
                    window.dispatchEvent(new CustomEvent('hideCursorOuter', { detail: true }));
                    setIsMenuOpen(false);
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('hideCursorOuter', { detail: false }));
                    }, 2500);
                  }}
                >
                  Work
                </MagneticLink>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.23, 1, 0.32, 1],
                    },
                  },
                }}
              >
                <MagneticLink
                  href="/about"
                  className={`text-6xl font-sans tracking-tight font-medium transition-all duration-300 relative px-4 py-2 ${
                    pathname === "/about"
                      ? "text-accent"
                      : "hover:text-accent"
                  }`}
                  style={pathname !== "/about" ? { color: 'var(--muted-foreground)' } : undefined}
                  onClick={() => {
                    // Hide cursor outline immediately during navigation
                    window.dispatchEvent(new CustomEvent('hideCursorOuter', { detail: true }));
                    setIsMenuOpen(false);
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('hideCursorOuter', { detail: false }));
                    }, 2500);
                  }}
                >
                  About
                </MagneticLink>
              </motion.div>
              {/* <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.23, 1, 0.32, 1],
                    },
                  },
                }}
              >
                <MagneticLink
                  href="/archive"
                  className={`text-6xl font-sans tracking-tight font-medium transition-all duration-300 relative px-4 py-2 ${
                    pathname === "/archive"
                      ? "text-accent"
                      : "hover:text-accent"
                  }`}
                  style={pathname !== "/archive" ? { color: 'var(--muted-foreground)' } : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Archive
                </MagneticLink>
              </motion.div> */}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
