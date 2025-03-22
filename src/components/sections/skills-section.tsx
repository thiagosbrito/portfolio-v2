'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSkills } from '@/lib/supabase/services';
import { Skill } from '@/lib/types';
import dynamic from 'next/dynamic';
import { 
  SiAngular, 
  SiNextdotjs, 
  SiReact, 
  SiIonic,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiRedux,
  SiNgrx,
  SiJest,
  SiCypress,
  SiWebpack,
  SiVite,
  SiBabel,
  SiNpm,
  SiYarn,
  SiBun,
  SiPnpm,
  SiFirebase,
  SiSupabase,
  SiPostgresql,
  SiNodedotjs,
  SiPhp,
  SiMysql,
  SiFigma,
  SiAdobephotoshop,
  SiAdobeillustrator,
} from 'react-icons/si';
import { FaPaintBrush, FaPencilAlt, FaSprayCan } from 'react-icons/fa';
import { TbTestPipe } from 'react-icons/tb';
import { BiTestTube } from 'react-icons/bi';

const skillIcons: { [key: string]: React.ElementType } = {
  'Angular': SiAngular,
  'NextJs': SiNextdotjs,
  'React Native': SiReact,
  'Ionic Framework': SiIonic,
  'TypeScript': SiTypescript,
  'JavaScript': SiJavascript,
  'HTML5': SiHtml5,
  'CSS3': SiCss3,
  'Redux': SiRedux,
  'NgRx': SiNgrx,
  'Zustand': SiReact,
  'Karma': BiTestTube,
  'Jest': SiJest,
  'Cypress': SiCypress,
  'Playwright': TbTestPipe,
  'Webpack': SiWebpack,
  'Vite': SiVite,
  'Babel': SiBabel,
  'NPM': SiNpm,
  'Yarn': SiYarn,
  'Bun': SiBun,
  'Pnpm': SiPnpm,
  'Firebase': SiFirebase,
  'Supabase': SiSupabase,
  'PostgreSQL': SiPostgresql,
  'NodeJs': SiNodedotjs,
  'PHP': SiPhp,
  'MySQL': SiMysql,
  'Figma': SiFigma,
  'Adobe Photoshop': SiAdobephotoshop,
  'Illustrator': SiAdobeillustrator,
  'Procreate': FaPaintBrush,
  'Drawing': FaPencilAlt,
  'Graffiti': FaSprayCan,
  'Calligraphy': FaPencilAlt,
};

// Create a client-side only wrapper component
const ClientSkillCard = dynamic(() => Promise.resolve(({ skill, Icon }: { skill: Skill; Icon: React.ElementType | null }) => {
  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.5 
      } 
    },
  };

  const getSkillLevel = (proficiency: number) => {
    if (proficiency >= 75) return { label: 'Advanced', showFire: true };
    if (proficiency > 60) return { label: 'Good Base', showFire: false };
    if (proficiency > 50) return { label: 'Intermediate', showFire: false };
    return { label: 'Basic', showFire: false };
  };

  const skillLevel = getSkillLevel(skill.proficiency);

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.05 }}
      className={`group flex flex-col items-center justify-between p-4 rounded-xl transition-all duration-300 aspect-square relative border ${
        skill.is_expert 
          ? 'bg-primary/[0.02] hover:bg-primary/[0.05] border-primary/10' 
          : 'bg-muted/[0.02] hover:bg-muted/[0.05] border-muted/10'
      }`}
      suppressHydrationWarning
    >
      <motion.span 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1 border ${
          skillLevel.showFire 
            ? 'bg-primary/[0.05] text-primary border-primary/20'
            : 'bg-muted/[0.05] text-muted-foreground/80 border-muted/20'
        }`}
        suppressHydrationWarning
      >
        {skillLevel.label} {skillLevel.showFire && '🔥'}
      </motion.span>
      <div 
        className={`w-16 h-16 flex items-center justify-center rounded-xl mb-2 transition-all duration-300 border ${
          skill.is_expert 
            ? 'bg-primary/[0.03] text-primary group-hover:bg-primary/[0.08] border-primary/20' 
            : 'bg-muted/[0.03] text-muted-foreground group-hover:bg-muted/[0.08] border-muted/20'
        }`}
      >
        {Icon ? (
          <Icon className={`w-8 h-8 transition-transform duration-300 ${
            skill.is_expert ? 'drop-shadow-sm' : ''
          }`} />
        ) : (
          <span className="text-3xl">{skill.name[0]}</span>
        )}
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className={`text-sm font-medium text-center ${
          skill.is_expert ? 'text-primary/90' : 'text-foreground/80'
        }`}>
          {skill.name}
        </span>
      </div>
    </motion.div>
  );
}), { ssr: false });

// Create a client-side only wrapper for the category container
const ClientCategoryCard = dynamic(() => Promise.resolve(({ category, skills }: { category: string; skills: Skill[] }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative p-[1px] rounded-xl group"
      suppressHydrationWarning
    >
      {/* Gradient border background */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/30 via-primary/20 to-muted/20 opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Main content */}
      <div className="relative bg-background/95 h-full backdrop-blur-sm rounded-xl p-6 border border-muted/10">
        <h3 className="text-2xl font-bold mb-6 pb-2 border-b border-primary/10 text-primary/90">
          {category}
        </h3>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          suppressHydrationWarning
        >
          {skills.map((skill) => {
            const Icon = skillIcons[skill.name] || null;
            return (
              <ClientSkillCard key={skill.id} skill={skill} Icon={Icon} />
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}), { ssr: false });

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      async function fetchData() {
        try {
          const data = await getSkills();
          setSkills(data);
        } catch (error) {
          console.error('Error fetching skills:', error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchData();
    }
  }, [isMounted]);

  // Fallback data if CMS data is not available
  const fallbackSkills: Skill[] = [
    {
      id: '1',
      name: 'Angular',
      category: 'Front-End Frameworks',
      proficiency: 5,
      is_expert: true,
      display_order: 1,
    },
    {
      id: '2',
      name: 'NextJs',
      category: 'Front-End Frameworks',
      proficiency: 4,
      is_expert: false,
      display_order: 2,
    },
    // Add more fallback skills if needed
  ];

  const displaySkills = skills.length > 0 ? skills : fallbackSkills;

  // Group skills by category
  const groupedSkills = displaySkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Sort skills by display order within each category
  Object.keys(groupedSkills).forEach((category) => {
    groupedSkills[category].sort((a, b) => a.display_order - b.display_order);
  });

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-muted/[0.02] via-background to-background w-full">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Skills & Expertise
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and expertise across various domains.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <ClientCategoryCard 
                key={category} 
                category={category} 
                skills={categorySkills} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 