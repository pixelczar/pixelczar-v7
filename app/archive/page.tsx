"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type ArchiveItem = 
  | { layout: "full"; src: string; alt: string }
  | { layout: "split"; left: { src: string; alt: string }; right: { src: string; alt: string } };

// Archive images - mix of full-width and 50-50 layouts
const archiveItems: ArchiveItem[] = [
  {
    layout: "full",
    src: "/images/work-banner-reprise.jpg",
    alt: "Full width archive image 1",
  },
  {
    layout: "split",
    left: {
      src: "/images/work-banner-catalant.jpg",
      alt: "Split left image 1",
    },
    right: {
      src: "/images/work-banner-insightsquared.jpg",
      alt: "Split right image 1",
    },
  },
  {
    layout: "full",
    src: "/images/work-banner-levelup.jpg",
    alt: "Full width archive image 2",
  },
  {
    layout: "split",
    left: {
      src: "/images/will-reflective-03.jpg",
      alt: "Split left image 2",
    },
    right: {
      src: "/images/work-banner-reprise.jpg",
      alt: "Split right image 2",
    },
  },
  {
    layout: "full",
    src: "/images/work-banner-catalant.jpg",
    alt: "Full width archive image 3",
  },
  {
    layout: "split",
    left: {
      src: "/images/work-banner-insightsquared.jpg",
      alt: "Split left image 3",
    },
    right: {
      src: "/images/work-banner-levelup.jpg",
      alt: "Split right image 3",
    },
  },
  {
    layout: "full",
    src: "/images/will-reflective-03.jpg",
    alt: "Full width archive image 4",
  },
];

export default function ArchivePage() {
  return (
    <div className="bg-background text-foreground theme-transition relative overflow-hidden">
      <main className="py-12 theme-transition relative">
        {/* Header Content - Minimal */}
        <div className="max-w-2xl mx-auto px-6 mb-12">
          <motion.h1
            variants={itemVariants}
            className="text-6xl font-serif heading-display italic font-normal text-foreground mb-8 theme-transition text-center"
          >
            <span className="lust-aalt">A</span>rc<span className="lust-swsh">h</span>i<span className="lust-swsh">v</span><span className="lust-cswh">e</span>
          </motion.h1>
        </div>

        {/* Image Grid - Full Width Container */}
        <div className="w-full">
          <div className="">
            {archiveItems.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="w-full theme-transition"
              >
                {item.layout === "full" ? (
                  <div className="px-4">
                    <div className="relative w-full overflow-hidden rounded-lg theme-transition">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={1200}
                        height={800}
                        className="w-full h-auto object-cover rounded-lg theme-transition"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div className="relative w-full overflow-hidden rounded-lg theme-transition">
                      <Image
                        src={item.left.src}
                        alt={item.left.alt}
                        width={600}
                        height={800}
                        className="w-full h-auto object-cover rounded-lg theme-transition"
                      />
                    </div>
                    <div className="relative w-full overflow-hidden rounded-lg theme-transition">
                      <Image
                        src={item.right.src}
                        alt={item.right.alt}
                        width={600}
                        height={800}
                        className="w-full h-auto object-cover rounded-lg theme-transition"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

