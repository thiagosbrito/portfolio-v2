export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  featured: boolean;
  display_order: number;
  created_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  technologies: string[];
  display_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 1-5
  is_expert: boolean;
  display_order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description?: string;
  display_order: number;
}

export interface AboutMe {
  id: string;
  headline: string;
  bio: string;
  profile_image: string;
  resume_url?: string;
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

export interface ContactInfo {
  id: string;
  email: string;
  phone?: string;
  location: string;
  available_for_work: boolean;
  preferred_contact_method: 'email' | 'phone' | 'form';
} 