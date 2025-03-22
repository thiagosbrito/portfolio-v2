'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getExperiences } from '@/lib/supabase/services';
import { Experience } from '@/lib/types';
import { CalendarDays, Briefcase, Building } from 'lucide-react';

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fallback data if CMS data is not available
  const fallbackExperiences: Experience[] = [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      position: 'Senior Frontend Developer',
      start_date: '2021-01',
      current: true,
      description: 'Led the development of a complex SaaS application using React and TypeScript. Implemented state management with Redux and improved performance by 40%.',
      technologies: ['React', 'TypeScript', 'Redux', 'Next.js', 'Tailwind CSS'],
      display_order: 1,
    },
    {
      id: '2',
      company: 'Digital Solutions Ltd.',
      position: 'Frontend Developer',
      start_date: '2019-06',
      end_date: '2021-02',
      current: false,
      description: 'Developed responsive web applications using React and Next.js. Collaborated with designers to implement pixel-perfect UI components.',
      technologies: ['React', 'Next.js', 'JavaScript', 'CSS', 'REST API'],
      display_order: 2,
    },
    {
      id: '3',
      company: 'Web Creators Agency',
      position: 'Junior Developer',
      start_date: '2018-07',
      end_date: '2019-05',
      current: false,
      description: 'Built and maintained websites for various clients using HTML, CSS, and JavaScript. Gained experience with React and modern frontend workflows.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'jQuery'],
      display_order: 3,
    },
  ];

  // Process experiences to ensure they have technologies
  const processExperiences = (exps: Experience[]): Experience[] => {
    return exps.map(exp => ({
      ...exp,
      technologies: exp.technologies || []
    }));
  };

  const displayExperiences = experiences.length > 0 
    ? processExperiences(experiences) 
    : fallbackExperiences;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="experience" className="py-20 w-full">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Work Experience</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            My professional journey as a developer, showcasing my roles and responsibilities
            at various companies.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line - only visible on mobile */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-muted-foreground/20 to-transparent md:hidden"></div>
            
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-12"
            >
              {displayExperiences.map((experience, index) => (
                <motion.div key={experience.id} variants={item}>
                  {/* Mobile layout */}
                  <div className="block md:hidden relative">
                    <div className="absolute left-0 top-0 w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-full flex items-center justify-center z-10 shadow-lg backdrop-blur-sm">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="ml-16">
                      <div className="flex items-center mb-2 group">
                        <Building className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">{experience.company}</h3>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        <span>
                          {formatDate(experience.start_date)} - {experience.current ? 'Present' : formatDate(experience.end_date || '')}
                        </span>
                      </div>
                      
                      <Card className="relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardHeader className="pb-2 relative">
                          <CardTitle className="group-hover:text-primary transition-colors duration-300">{experience.position}</CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                          <p className="text-muted-foreground mb-4 group-hover:text-foreground/80 transition-colors duration-300">{experience.description}</p>
                          {experience.technologies && experience.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {experience.technologies.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="bg-primary/5 text-primary border border-primary/10 text-xs px-2.5 py-1 rounded-full transition-all duration-300 hover:bg-primary/10 hover:border-primary/20"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Desktop layout */}
                  <div className="hidden md:block">
                    <div className={`flex items-start ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      {/* Left/Right content */}
                      <div className={`w-[calc(50%-20px)] ${index % 2 === 0 ? 'text-right pr-10' : 'pl-10'}`}>
                        <div className={`flex items-center ${index % 2 === 0 ? 'justify-end' : ''} mb-2 group`}>
                          {index % 2 === 1 && <Building className="h-5 w-5 mr-2 text-primary" />}
                          <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">{experience.company}</h3>
                          {index % 2 === 0 && <Building className="h-5 w-5 ml-2 text-primary" />}
                        </div>
                        
                        <div className={`flex items-center text-sm text-muted-foreground ${index % 2 === 0 ? 'justify-end' : ''}`}>
                          {index % 2 === 1 && <CalendarDays className="h-4 w-4 mr-1" />}
                          <span>
                            {formatDate(experience.start_date)} - {experience.current ? 'Present' : formatDate(experience.end_date || '')}
                          </span>
                          {index % 2 === 0 && <CalendarDays className="h-4 w-4 ml-1" />}
                        </div>
                      </div>
                      
                      {/* Center timeline dot */}
                      <div className="relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-full flex items-center justify-center z-10 shadow-lg backdrop-blur-sm">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        {index !== displayExperiences.length - 1 && (
                          <div className="absolute top-10 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-[calc(100%+3rem)] bg-gradient-to-b from-primary/20 via-primary/10 to-transparent"></div>
                        )}
                      </div>
                      
                      {/* Right/Left card */}
                      <div className={`w-[calc(50%-20px)] ${index % 2 === 0 ? 'pl-10' : 'pr-10'}`}>
                        <Card className="relative overflow-hidden group backdrop-blur-sm bg-card/50">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <CardHeader className="pb-2 relative">
                            <CardTitle className="group-hover:text-primary transition-colors duration-300">{experience.position}</CardTitle>
                          </CardHeader>
                          <CardContent className="relative">
                            <p className="text-muted-foreground mb-4 group-hover:text-foreground/80 transition-colors duration-300">{experience.description}</p>
                            {experience.technologies && experience.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {experience.technologies.map((tech, techIndex) => (
                                  <span
                                    key={techIndex}
                                    className="bg-primary/5 text-primary border border-primary/10 text-xs px-2.5 py-1 rounded-full transition-all duration-300 hover:bg-primary/10 hover:border-primary/20"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
} 