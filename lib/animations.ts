// Silky smooth animation configuration
// Using easeOutQuart [0.25, 1, 0.5, 1] for buttery smooth feel

export const smoothEase = [0.25, 1, 0.5, 1] as const // easeOutQuart - buttery smooth
export const gentleEase = [0.22, 1, 0.36, 1] as const // slightly softer
export const exitEase = [0.4, 0, 1, 1] as const // snappy exit

// Page-level container animation
export const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: smoothEase,
      staggerChildren: 0.08, // Sequential feel
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: exitEase,
    },
  },
}

// Standard content item animation (for use with variants)
export const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.7,
      ease: smoothEase,
    },
  },
}

// Card animation with index-based stagger
export const getCardVariants = (index: number, baseDelay: number = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: baseDelay + index * 0.1, // Sequential stagger
      ease: smoothEase,
    },
  },
})

// Scroll-triggered animation for whileInView
export const scrollRevealVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: smoothEase,
    },
  },
}

// Header/nav animations
export const headerVariants = {
  logo: {
    hidden: { opacity: 0, y: -16 },
    visible: {
      opacity: 1,
      y: 0,
    },
  },
  nav: {
    hidden: { opacity: 0, y: -8 },
    visible: {
      opacity: 1,
      y: 0,
    },
  },
}

// Homepage-specific delays (longer for dramatic entrance)
// Nav comes in with logo
export const homepageTransitions = {
  logo: { delay: 1.2, duration: 0.9, ease: smoothEase },
  nav: { delay: 1.2, duration: 0.8, ease: smoothEase },
  mobileMenu: { delay: 1.2, duration: 0.8, ease: smoothEase },
  footer: { delay: 1.6, duration: 0.9, ease: smoothEase },
}

// Standard page transitions (faster, no delay)
export const standardTransitions = {
  logo: { duration: 0.6, ease: smoothEase },
  nav: { duration: 0.5, ease: smoothEase },
  footer: { duration: 0.6, ease: smoothEase },
}

// Mobile menu stagger
export const menuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

export const menuItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
}

