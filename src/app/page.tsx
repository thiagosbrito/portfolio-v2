'use client';

import MainLayout from '@/components/layout/main-layout';
import HeroSection from '@/components/sections/hero-section';
import ExperienceSection from '@/components/sections/experience-section';
import SkillsSection from '@/components/sections/skills-section';
import AboutSection from '@/components/sections/about-section';
import ContactSection from '@/components/sections/contact-section';

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
    </MainLayout>
  );
}
