'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getHomeContent, type HomeContent } from '@/lib/supabase/services';
import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';

export default function HeroSection() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse position values with increased range
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothed mouse values with more responsive spring settings
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  // Transform values for parallax effect with increased rotation
  const rotateX = useTransform(smoothY, [-300, 300], [15, -15]);
  const rotateY = useTransform(smoothX, [-300, 300], [-15, 15]);
  const translateZ = useTransform(smoothY, [-300, 300], [50, -50]);

  // Transform values for interactive elements with more dramatic movement
  const orbX = useTransform(smoothX, [-300, 300], [-150, 150]);
  const orbY = useTransform(smoothY, [-300, 300], [-150, 150]);
  const orbOpacity = useTransform(smoothY, [-300, 300], [0.1, 0.6]);
  const orb2X = useTransform(smoothX, [-300, 300], [150, -150]);
  const orb2Y = useTransform(smoothY, [-300, 300], [150, -150]);
  const orb2Opacity = useTransform(smoothY, [-300, 300], [0.2, 0.7]);
  
  // More pronounced depth effects for content
  const profileZ = useTransform(smoothY, [-300, 300], [80, -80]);
  const profileRotateY = useTransform(smoothX, [-300, 300], [10, -10]);
  const glowScale = useTransform(smoothY, [-300, 300], [1.2, 0.8]);
  const glowRotate = useTransform(smoothX, [-300, 300], [-15, 15]);
  const headlineZ = useTransform(smoothY, [-300, 300], [100, -100]);
  const subHeadlineZ = useTransform(smoothY, [-300, 300], [80, -80]);
  const textZ = useTransform(smoothY, [-300, 300], [60, -60]);
  const ctaZ = useTransform(smoothY, [-300, 300], [70, -70]);
  const ctaX = useTransform(smoothX, [-300, 300], [-40, 40]);
  const ctaOpacity = useTransform(smoothY, [-300, 300], [0.4, 1]);
  const socialScale = useTransform(smoothY, [-300, 300], [0.7, 1.3]);
  const scrollZ = useTransform(smoothY, [-300, 300], [40, -40]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    async function fetchHomeContent() {
      try {
        const data = await getHomeContent();
        setContent(data);
      } catch (error) {
        console.error('Error fetching home content:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHomeContent();
  }, []);

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-8 text-center">
          <div className="w-48 h-48 rounded-full bg-muted mx-auto" />
          <div className="space-y-4">
            <div className="h-8 w-64 bg-muted rounded mx-auto" />
            <div className="h-4 w-48 bg-muted rounded mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background to-background" />
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-grid-pattern" /> {/* Slightly more visible grid */}
      
      {/* Interactive Background Elements */}
      <motion.div
        className="absolute inset-0"
        style={{
          perspective: 2000, // Increased perspective for more dramatic 3D
          rotateX,
          rotateY,
        }}
      >
        <div className="absolute inset-0">
          {/* Glowing Orbs with increased size and blur */}
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full bg-primary/15 blur-[100px]" // Larger orb with more blur
            style={{
              x: orbX,
              y: orbY,
              opacity: orbOpacity,
            }}
          />
          <motion.div
            className="absolute right-1/4 top-1/4 w-[500px] h-[500px] rounded-full bg-primary/25 blur-[80px]" // Larger secondary orb
            style={{
              x: orb2X,
              y: orb2Y,
              opacity: orb2Opacity,
            }}
          />
        </div>
      </motion.div>

      <div ref={containerRef} className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        {/* Main content grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center justify-items-center"
          style={{
            rotateX,
            rotateY,
            translateZ,
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
          }}
        >
          {/* Left column - Profile Image */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative flex justify-center w-full max-w-[400px]"
            style={{
              translateZ: profileZ,
              rotateY: profileRotateY,
            }}
          >
            <div className="relative w-56 h-56 lg:w-[400px] lg:h-[400px] transform-gpu">
              {content?.profile_image && (
                <Image
                  src={content.profile_image}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover border-4 border-primary/30" // More visible border
                  priority
                />
              )}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary/60 to-primary/40 rounded-full blur-xl opacity-40" // More intense glow
                style={{
                  scale: glowScale,
                  rotate: glowRotate,
                }}
              />
            </div>
          </motion.div>

          {/* Right column - Text Content with enhanced animations */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 w-full max-w-xl">
            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400" // Enhanced gradient
              style={{
                translateZ: headlineZ,
              }}
            >
              {content?.headline || 'Hi, I\'m Thiago Brito'}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl md:text-2xl text-muted-foreground font-light"
              style={{
                translateZ: subHeadlineZ,
              }}
            >
              {content?.sub_headline || 'Front-End Developer & Tech Leader'}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full"
              style={{
                translateZ: textZ,
              }}
            >
              <p className="text-lg text-muted-foreground/80 leading-relaxed">
                {content?.welcome_text}
              </p>
            </motion.div>

            {/* CTAs and Social Links */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-6 pt-6 w-full"
              style={{
                translateZ: ctaZ,
              }}
            >
              <Button 
                variant="modern" 
                size="lg"
                className="font-display"
                asChild
              >
                <Link href="#contact">
                  <span>Let&apos;s Talk</span>
                </Link>
              </Button>
              
              <div className="flex items-center gap-4">
                <Link href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 relative overflow-hidden">
                    <motion.span
                      className="absolute inset-0 bg-primary/10"
                      style={{
                        scale: socialScale,
                      }}
                    />
                    <Github className="h-5 w-5 relative" />
                  </Button>
                </Link>
                <Link href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 relative overflow-hidden">
                    <motion.span
                      className="absolute inset-0 bg-primary/10"
                      style={{
                        scale: socialScale,
                      }}
                    />
                    <Linkedin className="h-5 w-5 relative" />
                  </Button>
                </Link>
                <Link href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 relative overflow-hidden">
                    <motion.span
                      className="absolute inset-0 bg-primary/10"
                      style={{
                        scale: socialScale,
                      }}
                    />
                    <Twitter className="h-5 w-5 relative" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-8"
        style={{
          translateZ: scrollZ,
        }}
      >
        <motion.div 
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 12, 0] }} // Increased movement range
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
        >
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-primary/70 to-transparent" /> {/* Taller and more visible indicator */}
          <span className="text-sm text-muted-foreground/90">Scroll to explore</span>
        </motion.div>
      </motion.div>
    </section>
  );
} 