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
    <div className="relative flex gap-6 theme-transition">
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
      <div className="flex-1 flex gap-8">
        {/* Left Column - Job Details (Narrow) */}
        <div className="w-96 space-y-6">
          <p className="text-base font-semibold theme-transition mb-8" style={{ color: 'var(--muted-foreground)' }}>
            {job.dates} -
            <span
              className={`ml-2 text-accent font-normal text-sm ${
                index === 0 ? "" : "hidden"
              }`}
            >
              present
            </span>
          </p>

          <div>
            <p className="text-sm font-normal mb-1 theme-transition" style={{ color: 'var(--muted-foreground)' }}>
              Company
            </p>
            <h3 className="text-base font-semibold text-foreground theme-transition">
              {job.company}
            </h3>
          </div>

          <div>
            <p className="text-sm font-normal mb-1 theme-transition" style={{ color: 'var(--muted-foreground)' }}>
              Type
            </p>
            <p className="text-base font-semibold text-foreground theme-transition">
              {job.type}
            </p>
          </div>

          <div>
            <p className="text-sm font-normal mb-1 theme-transition" style={{ color: 'var(--muted-foreground)' }}>
              Responsibilities
            </p>
            <p className="text-base font-semibold text-foreground theme-transition leading-relaxed">
              {job.skills.join(", ")}
            </p>
          </div>
        </div>

        {/* Right Column - Company Card (Wide) */}
        <div className="flex flex-1 bg-card rounded-lg shadow-lg transition-all duration-300 theme-transition overflow-hidden mb-32">
          <Image
            src={job.image || "/placeholder.svg"}
            alt={job.imageAlt}
            width={800}
            height={400}
            className="w-full h-auto theme-transition"
          />
        </div>
      </div>
    </div>
  );
}
