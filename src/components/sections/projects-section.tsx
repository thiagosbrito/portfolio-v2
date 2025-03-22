'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';
import { getProjects } from '@/lib/supabase/services';
import { Project } from '@/lib/types';

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fallback data if CMS data is not available
  const fallbackProjects: Project[] = [
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'A modern e-commerce platform built with Next.js, Tailwind CSS, and Stripe for payments.',
      image_url: '/images/placeholder.svg',
      technologies: ['Next.js', 'React', 'Tailwind CSS', 'Stripe'],
      github_url: 'https://github.com/yourusername/ecommerce',
      live_url: 'https://example.com',
      featured: true,
      display_order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Task Management App',
      description: 'A productivity app for managing tasks and projects with real-time updates.',
      image_url: '/images/placeholder.svg',
      technologies: ['React', 'Firebase', 'Tailwind CSS', 'Framer Motion'],
      github_url: 'https://github.com/yourusername/task-app',
      live_url: 'https://example.com',
      featured: true,
      display_order: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Portfolio Website',
      description: 'A personal portfolio website showcasing my projects and skills.',
      image_url: '/images/placeholder.svg',
      technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Supabase'],
      github_url: 'https://github.com/yourusername/portfolio',
      live_url: 'https://example.com',
      featured: true,
      display_order: 3,
      created_at: new Date().toISOString(),
    },
  ];

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

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
    <section id="projects" className="py-20 bg-muted/30 w-full">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Here are some of my recent projects. Each project is built with modern technologies
            and best practices in mind.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayProjects.map((project) => (
              <motion.div key={project.id} variants={item}>
                <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-shadow dark:bg-card/95 backdrop-blur-sm">
                  <div className="relative aspect-video w-full overflow-hidden bg-muted -mt-6">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                        Project Image
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow pb-4">
                    <p className="text-muted-foreground">{project.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    {project.github_url && (
                      <Button variant="modern-outline" size="sm" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <span>
                            <Github className="h-4 w-4 mr-2 inline" />
                            Code
                          </span>
                        </a>
                      </Button>
                    )}
                    {project.live_url && (
                      <Button variant="modern" size="sm" asChild>
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <span>
                            <ExternalLink className="h-4 w-4 mr-2 inline" />
                            Live Demo
                          </span>
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="modern-outline" asChild>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
              <span>
                <Github className="h-5 w-5 mr-2 inline" />
                View More on GitHub
              </span>
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
} 