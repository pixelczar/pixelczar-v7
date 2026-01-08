"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import ThemeSwatches from "@/components/theme-swatches";
import AnimatedLogo from "@/components/animated-logo";
import MagneticLink from "@/components/magnetic-link";
import MagneticWrapper from "@/components/magnetic-wrapper";
import { smoothEase, homepageTransitions, standardTransitions, menuVariants, menuItemVariants } from "@/lib/animations";

const logoVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0 },
};

const getNavVariants = (isHomepage: boolean) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: isHomepage ? 1.2 : 0,
    },
  },
});

const navItemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: smoothEase,
    },
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
        transition={isHomepage ? homepageTransitions.logo : standardTransitions.logo}
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
          {/* <span className="text-body hidden sm:inline font-sans font-medium theme-transition text-gray-600 dark:text-white/40 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
            Home
          </span> */}
        </Link>
      </motion.div>

      <motion.nav 
        className="hidden md:flex items-center space-x-4"
        variants={getNavVariants(isHomepage)}
        initial={isHomepage ? "hidden" : "visible"}
        animate="visible"
        transition={isHomepage ? homepageTransitions.nav : standardTransitions.nav}
      >
        <motion.div variants={navItemVariants}>
          <MagneticLink
            href="/about"
            className={`text-base font-sans font-normal transition-all duration-300 relative px-3 py-1 rounded-full hover:text-white ${
              pathname === "/about" ? "font-medium" : "hover:text-primary"
            }`}
            style={pathname === "/about" ? { color: 'hsl(var(--accent))', opacity: 1 } : { color: 'var(--muted-foreground)' }}
            data-cursor-rounded="full"
            strength={0.3}
          >
            About
          </MagneticLink>
        </motion.div>
        <motion.div variants={navItemVariants}>
          <MagneticLink
            href="/work"
            className={`text-base font-sans font-normal transition-all duration-300 relative px-3 py-1 rounded-full hover:text-white ${
              pathname === "/work" ? "font-medium" : "hover:text-primary"
            }`}
            style={pathname === "/work" ? { color: 'hsl(var(--accent))', opacity: 1 } : { color: 'var(--muted-foreground)' }}
            data-cursor-rounded="full"
            strength={0.3}
          >
            Work
          </MagneticLink>
        </motion.div>
        <motion.div variants={navItemVariants}>
          <MagneticLink
            href="/play"
            className={`text-base font-sans font-normal transition-all duration-300 relative px-3 py-1 rounded-full hover:text-white ${
              pathname === "/play" ? "font-medium" : "hover:text-primary"
            }`}
            style={pathname === "/play" ? { color: 'hsl(var(--accent))', opacity: 1 } : { color: 'var(--muted-foreground)' }}
            data-cursor-rounded="full"
            strength={0.3}
          >
            Play
          </MagneticLink>
        </motion.div>
        <motion.div variants={navItemVariants}>
          <MagneticWrapper
            strength={0.3}
            data-cursor-rounded="full"
          >
            <div className="pt-0.5 flex items-center">
              <ThemeSwatches />
            </div>
          </MagneticWrapper>
        </motion.div>
      </motion.nav>

      <motion.div 
        className="md:hidden flex items-center space-x-4"
        variants={getNavVariants(isHomepage)}
        initial={isHomepage ? "hidden" : "visible"}
        animate="visible"
        transition={isHomepage ? homepageTransitions.mobileMenu : standardTransitions.nav}
      >
        <motion.div variants={navItemVariants}>
          <MagneticWrapper
            strength={0.3}
            data-cursor-rounded="full"
          >
            <div className="flex items-center">
              <ThemeSwatches />
            </div>
          </MagneticWrapper>
        </motion.div>
        <motion.div variants={navItemVariants}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-muted-foreground hover:text-primary transition-colors duration-300 z-50 relative w-8 h-8 flex items-center justify-center"
            aria-label="Toggle menu"
          >
          <div className="relative w-6 h-5 flex flex-col justify-between">
            <motion.div
              className="h-0.5 bg-current rounded-full"
              animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 10 : 0 }}
              transition={{ duration: 0.3, ease: smoothEase }}
              style={{ transformOrigin: "center" }}
            />
            <motion.div
              className="h-0.5 bg-current rounded-full"
              animate={{ opacity: isMenuOpen ? 0 : 1, scaleX: isMenuOpen ? 0 : 1 }}
              transition={{ duration: 0.2, ease: smoothEase }}
            />
            <motion.div
              className="h-0.5 bg-current rounded-full"
              animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -8 : 0 }}
              transition={{ duration: 0.3, ease: smoothEase }}
              style={{ transformOrigin: "center" }}
            />
          </div>
        </button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: smoothEase }}
            className="fixed inset-0 dark:bg-gray-900/80 bg-white/30 z-40 md:hidden theme-transition"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
              className="flex flex-col items-center justify-center h-full space-y-12 theme-transition"
            >
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/work", label: "Work" },
                { href: "/play", label: "Play" },
              ].map((item) => (
                <motion.div key={item.href} variants={menuItemVariants}>
                  <MagneticLink
                    href={item.href}
                    className={`text-8xl font-sans tracking-tight font-light transition-all duration-300 relative px-4 py-2 ${
                      pathname === item.href ? "text-accent" : "hover:text-accent"
                    }`}
                    style={pathname !== item.href ? { color: 'var(--muted-foreground)' } : undefined}
                    data-cursor-rounded="full"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('hideCursorOuter', { detail: true }));
                      setIsMenuOpen(false);
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('hideCursorOuter', { detail: false }));
                      }, 2000);
                    }}
                  >
                    {item.label}
                  </MagneticLink>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
