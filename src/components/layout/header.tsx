'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/#about' },
  { name: 'Skills', href: '/#skills' },
  { name: 'Experience', href: '/#experience' },
  { name: 'Contact', href: '/#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');

  // Handle navigation item click
  const handleNavClick = (itemName: string) => {
    setActiveItem(itemName);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.replace('/#', '')).filter(id => id !== '/');
      const scrollPosition = window.scrollY + 200;
      
      // Reset to Home if we're at the top of the page
      if (scrollPosition < 200) {
        setActiveItem('Home');
        return;
      }
      
      // Check other sections
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && 
            scrollPosition >= element.offsetTop && 
            scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveItem(section.charAt(0).toUpperCase() + section.slice(1));
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        scrolled ? 'bg-background/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center py-4 text-lg font-medium group"
          onClick={() => handleNavClick('Home')}
        >
          <motion.span 
            className="font-marker text-xl relative"
            whileHover={{ scale: 1.05 }}
          >
            <span className='font-semibold'>Thiago</span><span className='text-muted-foreground font-extrabold'>Brito</span>
            <motion.span 
              className="absolute -bottom-1 left-0 h-1 bg-primary"
              initial={{ width: 0 }}
              animate={{ width: scrolled ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
            <motion.span 
              className="absolute -bottom-1 left-0 h-1 bg-accent"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.2 }}
            />
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className='cursor-pointer'
              onClick={() => handleNavClick(item.name)}
            >
              <Button 
                variant="ghost" 
                className={`text-base relative group hover:bg-transparent hover:text-foreground ${activeItem === item.name ? 'text-primary hover:text-primary' : ''}`}
              >
                {item.name}
                {activeItem === item.name && (
                  <motion.span 
                    className="absolute bottom-0 left-0 h-0.5 bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <span 
                  className="absolute bottom-0 left-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ width: '100%' }}
                />
              </Button>
            </Link>
          ))}
          <ThemeToggle />
          <Link href="/#contact">
            <Button 
              variant="modern"
              className="ml-2"
            >
              <span>Let&apos;s Talk</span>
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-6 w-6" />
                <motion.span 
                  className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-primary"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-accent/20">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => handleNavClick(item.name)}
                  >
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start text-lg relative ${activeItem === item.name ? 'text-primary font-medium' : ''}`}
                    >
                      {item.name}
                      {activeItem === item.name && (
                        <motion.span 
                          className="absolute left-0 top-0 w-1 h-full bg-primary rounded-r-md"
                          initial={{ height: 0 }}
                          animate={{ height: '100%' }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Button>
                  </Link>
                ))}
                <Link href="/#contact">
                  <Button 
                    variant="modern"
                    className="w-full mt-4"
                  >
                    <span>Let&apos;s Talk</span>
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
} 