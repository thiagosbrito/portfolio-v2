'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: 'https://github.com/thiagosbrito', label: 'GitHub' },
    { icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com/in/thiagosbrito', label: 'LinkedIn' },
    // { icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com/yourusername', label: 'Twitter' },
    // { icon: <Instagram className="h-5 w-5" />, href: 'https://instagram.com/yourusername', label: 'Instagram' },
    { icon: <Mail className="h-5 w-5" />, href: 'mailto:brito.dev@outlook.com', label: 'Email' },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-primary/10">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      {/* Decorative Blobs */}
      <div className="absolute -top-24 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[128px]" />
      
      <div className="relative container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-block group">
              <span className="font-marker text-2xl bg-clip-text font-bold text-transparent bg-gradient-to-r from-primary to-primary/60 group-hover:to-primary/80 transition-all duration-300">
                Thiago<span className="font-marker font-extrabold text-muted-foreground">Brito</span>
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground/80 leading-relaxed">
              Senior Front-End Developer specializing in creating beautiful, responsive, and user-friendly web applications.
            </p>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Quick Links
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/0" />
            </h3>
            <ul className="grid grid-cols-2 gap-3">
              {['About', 'Skills', 'Experience', 'Contact'].map((item) => (
                <motion.li
                  key={item}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href={`/#${item.toLowerCase()}`} 
                    className="text-muted-foreground/80 hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      →
                    </span>
                    {item}
                    <span className="absolute -bottom-px left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Connect Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Connect
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/0" />
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="relative group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-2.5 rounded-full bg-muted/50 backdrop-blur-sm border border-primary/10 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300">
                    {link.icon}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-primary/10"
        >
          <p className="text-sm text-muted-foreground/70">
            © {new Date().getFullYear()} <span className="text-primary/90 font-medium">Thiago Brito</span>. All rights reserved.
          </p>
          
          <motion.button
            onClick={scrollToTop}
            className="mt-6 md:mt-0 relative group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-2.5 rounded-full bg-muted/50 backdrop-blur-sm border border-primary/10 text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-all duration-300">
              <ArrowUp className="h-5 w-5" />
            </div>
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
} 