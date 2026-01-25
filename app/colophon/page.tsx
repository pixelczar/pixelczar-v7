"use client";

import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animations";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export default function ColophonPage() {
  return (
    <div className="bg-background text-foreground theme-transition relative overflow-hidden min-h-screen">
      <motion.main 
        className="px-6 py-12 theme-transition relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12 md:mb-20">
          <motion.h1 
            variants={itemVariants}
            className="heading-display mb-8 text-center"
          >
            <span className="lust-aalt">C</span>o<span className="lust-swsh">l</span>o<span className="lust-swsh">p</span><span className="lust-swsh">h</span>o<span className="lust-ss03">n</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
          />
        </div>

        {/* Intro Section */}
        <div className="max-w-3xl mx-auto space-y-16 mb-20">
          <motion.section variants={itemVariants}>
            <h2 className="font-normal text-xl md:text-2xl mb-6 md:mb-8 text-foreground">I always wanted one of these. First, I thought they were cool. Then I thought they were pretentious. Guess what? They&apos;re cool again.</h2>
            
          </motion.section>
          <motion.h3 variants={itemVariants} className="font-normal text-xl md:text-2xl mb-12 text-foreground border-t border-accent/20 pt-6">
            Typography
          </motion.h3>
        </div>


        {/* Typefaces Section */}
        <div className="max-w-7xl mx-auto pt-6 mb-20">
          <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Display / Lust */}
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="heading-display text-6xl md:text-8xl text-foreground leading-none">Display</p>
                <p className="text-body-main font-medium">
                  The swishy serif is called Lust. Weird name, but I did get freaky with the advanced CSS typography features.
                </p>
              </div>
            </div>

            {/* Sans / Arimo */}
            <div className="space-y-8 font-sans">
              <div className="space-y-2">
                <p className="text-5xl md:text-7xl font-normal opacity-30 leading-none tracking-tighter">Sans</p>
              </div>
              
              <div className="space-y-10 pt-4">
                <div className="space-y-2">
                  <p className="text-xl md:text-2xl text-foreground font-normal leading-tight">
                    Arimo Regular 24px
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-body-main text-lg leading-relaxed">
                    Arimo Regular 18px. The workhorse of the interface, used for all primary descriptions and long-form content.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-body-small text-sm">
                    Arimo Regular 14px. Used for metadata, image captions, and secondary details.
                  </p>
                </div>
              </div>

              <p className="text-body-main font-medium mt-16 pt-8 border-t border-accent/10">
                The main sans font is called Arimo Sans. For this project I picked it for its clean lines and modern vibes. Google fonts has come a long way.
              </p>
            </div>
          </motion.section>
        </div>

        {/* Tech Stack Section */}
        <motion.div 
          variants={itemVariants} 
          className="max-w-3xl mx-auto my-20 border-t border-accent/20 pt-6"
        >
          <h3 className="font-normal text-xl md:text-2xl mb-12 text-foreground">Stack</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-12">
            {[
              { label: "Figma", value: "Design & Layout" },
              { label: "Cursor", value: "Engineering" },
              { label: "v0", value: "Prototyping" },
              { label: "Sanity", value: "Content" },
              { label: "motion.js", value: "Animations" },
              { label: "Vercel", value: "Deployment" }
            ].map((tech, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl md:text-5xl font-normal mb-2 opacity-30">{tech.label}</p>
                <p className="text-body-main font-medium leading-tighter">{tech.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero Image Section */}
        <motion.div 
          variants={itemVariants} 
          className="max-w-5xl mx-auto my-16 md:my-24"
        >
          <div className="relative w-full overflow-hidden bg-muted rounded-lg md:rounded-xl shadow-lg">
            <Image
              src="/images/colophone-desk-1.jpg"
              alt="Vibe-city, population - me."
              width={1920}
              height={1080}
              className="w-full h-auto object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              quality={90}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4 max-w-4xl mx-auto">
            Vibe-city, population - me.
          </p>
        </motion.div>
      </motion.main>
    </div>
  );
}
