import Image from "next/image";
import { motion } from "framer-motion";
import type { Experience } from "@/lib/data";

interface TimelineItemProps {
  job: Experience;
  index: number;
  isLast?: boolean;
}

export default function TimelineItem({
  job,
  index,
  isLast = false,
}: TimelineItemProps) {
  return (
    <div className="relative flex gap-4 md:gap-6 theme-transition">
      {/* Timeline Line and Dot */}
      <div className="relative flex flex-col items-center">
        {/* Timeline Dot */}
        <div className="relative">
          <div
            className="w-2 h-2 rounded-full relative z-20 theme-transition mt-1 border-4 border-solid box-content"
            style={{ 
              borderColor: "var(--background)",
              backgroundColor: index === 0 ? "hsl(var(--accent))" : "var(--muted-foreground)"
            }}
          />
          {/* Radar pulse animation for present (first item) */}
          {index === 0 && (
            <>
              <motion.div
                className="absolute left-1 rounded-full bg-accent z-0"
                style={{ 
                  top: "9px",
                  width: "2px",
                  height: "2px",
                  transformOrigin: "center center",
                }}
                animate={{
                  scale: [0, 4],
                  opacity: [0.7, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: [0, 0, 0.2, 1],
                  repeatDelay: 0,
                }}
              />
              <motion.div
                className="absolute left-1 rounded-full bg-accent z-0"
                style={{ 
                  top: "9px",
                  width: "2px",
                  height: "2px",
                  transformOrigin: "center center",
                }}
                animate={{
                  scale: [0, 4],
                  opacity: [0.7, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: [0, 0, 0.2, 1],
                  repeatDelay: 0,
                  delay: 1,
                }}
              />
            </>
          )}
        </div>

        {/* Timeline Line */}
        {!isLast && (
          <div 
            className="w-px h-full absolute top-2 theme-transition" 
            style={{ backgroundColor: "var(--border)" }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Left Column - Job Details */}
        <div className="w-full md:w-2/5 space-y-4 md:4">
          <p className="text-sm md:text-base font-semibold theme-transition mb-4 md:mb-8" style={{ color: 'var(--muted-foreground)' }}>
            {job.dates}
            {/* <span
              className={`ml-2 text-accent font-normal text-xs md:text-sm ${
                index === 0 ? "" : "hidden"
              }`}
            >
              present
            </span> */}
          </p>

          <div>
            <p className="text-xs md:text-sm font-normal mb-1 theme-transition text-muted-foreground" style={{ color: 'var(--muted-foreground)' }}>
              Company
            </p>
            <h3 className="text-base font-semibold text-foreground theme-transition">
              {job.company}
            </h3>
          </div>

          <div>
            <p className="text-xs md:text-sm font-normal mb-1 theme-transition text-muted-foreground" style={{ color: 'var(--muted-foreground)' }}>
              Type
            </p>
            <p className="text-base font-semibold text-foreground theme-transition">
              {job.type}
            </p>
          </div>

          <div>
            <p className="text-xs md:text-sm font-normal mb-1 theme-transition text-muted-foreground" style={{ color: 'var(--muted-foreground)' }}>
              Responsibilities
            </p>
            <p className="text-sm md:text-base font-semibold text-foreground theme-transition leading-relaxed">
              {job.skills.join(", ")}
            </p>
          </div>
        </div>

        {/* Right Column - Company Card */}
        <div className="w-full md:flex-1 bg-card rounded-lg shadow-lg transition-all duration-300 theme-transition overflow-hidden mb-16 md:mb-32">
          {/* Mobile: Use aspect ratio container */}
          <div className="relative w-full aspect-[2/1] md:hidden">
            <Image
              src={job.image || "/placeholder.svg"}
              alt={job.imageAlt}
              fill
              className="object-contain theme-transition"
              sizes="100vw"
            />
          </div>
          {/* Desktop: Use original width/height approach */}
          <div className="hidden md:block">
            <Image
              src={job.image || "/placeholder.svg"}
              alt={job.imageAlt}
              width={800}
              height={400}
              className="w-full h-auto theme-transition"
              sizes="50vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
