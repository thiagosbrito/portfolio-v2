'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { getAboutMe, getEducation } from '@/lib/supabase/services';
import { AboutMe, Education } from '@/lib/types';

export default function AboutSection() {
  const [aboutMe, setAboutMe] = useState<AboutMe | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [aboutData, educationData] = await Promise.all([
          getAboutMe(),
          getEducation(),
        ]);
        setAboutMe(aboutData);
        setEducation(educationData);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fallback data if CMS data is not available
  const fallbackAboutMe: AboutMe = {
    id: '1',
    headline: 'Senior Front-End Developer',
    bio: `I'm a passionate Front-End Developer with over 5 years of experience creating beautiful, responsive, and user-friendly web applications. I specialize in modern JavaScript frameworks like React and Next.js, and I'm dedicated to writing clean, maintainable code.

My journey in web development started with a curiosity about how websites work, which led me to pursue a degree in Computer Science. Since then, I've worked with various companies and clients, helping them bring their digital visions to life.

When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through blog posts and mentoring junior developers.`,
    profile_image: "/images/placeholder.svg",
    resume_url: '/resume.pdf',
    social_links: {
      github: 'https://github.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
    },
  };

  const fallbackEducation: Education[] = [
    {
      id: '1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      start_date: '2014-09',
      end_date: '2018-06',
      current: false,
      description: 'Graduated with honors. Specialized in web development and software engineering.',
      display_order: 1,
    },
    {
      id: '2',
      institution: 'Frontend Masters',
      degree: 'Professional Certificate',
      field: 'Advanced React Patterns',
      start_date: '2019-03',
      end_date: '2019-06',
      current: false,
      description: 'Completed intensive course on advanced React patterns and best practices.',
      display_order: 2,
    },
  ];

  const aboutData = aboutMe || fallbackAboutMe;
  const educationData = education.length > 0 ? education : fallbackEducation;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background" />
      
      {/* Dot pattern overlay */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `radial-gradient(circle at center, var(--primary) 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
          opacity: 0.05
        }}
      />
      
      {/* Animated gradient lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-slide-left-right"
            style={{
              top: `${20 + i * 15}%`,
              animationDelay: `${i * 1.5}s`,
              opacity: 0.15
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background/80 to-background pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            About Me
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get to know more about me, my background, and what drives me as a developer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-2xl border border-primary/10 shadow-2xl shadow-primary/5">
              {!isLoading && aboutData.profile_image ? (
                <Image
                  src={aboutData.profile_image}
                  alt="Thiago Brito"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/50 backdrop-blur-sm text-muted-foreground">
                  Profile Image
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-l from-primary/20 via-primary/10 to-primary/5 rounded-2xl blur-2xl opacity-50" />
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                {aboutData.headline}
              </h3>
              <div className="space-y-4 text-muted-foreground/90">
                {aboutData.bio.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">{paragraph}</p>
                ))}
              </div>

              {aboutData.resume_url && (
                <div className="mt-8">
                  <Button variant="modern" asChild>
                    <a href={aboutData.resume_url} target="_blank" rel="noopener noreferrer">
                      <span>
                        <Download className="mr-2 h-4 w-4 inline" />
                        Download Resume
                      </span>
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-24 max-w-5xl mx-auto"
        >
          <h3 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Education
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educationData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group relative overflow-hidden backdrop-blur-sm bg-card/50 border-primary/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 relative">
                    <h4 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                      {item.institution}
                    </h4>
                    <p className="text-primary font-medium mt-1">
                      {item.degree} in {item.field}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(item.start_date)} - {item.current ? 'Present' : formatDate(item.end_date || '')}
                    </p>
                    {item.description && (
                      <p className="mt-4 text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                        {item.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 