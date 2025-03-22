'use client';

import { motion } from 'framer-motion';
import { Education } from '@/lib/types';

export default function EducationSection({ educations }: { educations: Education[] }) {
  return (
    <section className="py-20 w-full">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Education
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {educations.map((education) => (
            <motion.div
              key={education.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative p-[1px] rounded-xl group"
            >
              {/* Gradient border background */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/40 via-primary/30 to-muted/30 opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Main content */}
              <div className="relative bg-background/95 h-full backdrop-blur-sm rounded-xl p-6 border border-muted/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <h3 className="font-display text-xl font-bold text-foreground/90">
                  {education.institution}
                </h3>
                <p className="font-display text-primary mt-1 font-medium">
                  {education.degree}
                </p>
                <p className="font-display text-muted-foreground text-sm mt-2">
                  {education.start_date} - {education.end_date}
                </p>
                <p className="font-sans text-muted-foreground mt-4 leading-relaxed">
                  {education.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 