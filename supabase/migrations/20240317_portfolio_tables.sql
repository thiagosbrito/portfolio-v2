-- Create about_me table
CREATE TABLE IF NOT EXISTS about_me (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  bio TEXT NOT NULL,
  profile_image TEXT,
  resume_url TEXT,
  social_links JSONB DEFAULT '{"github": "", "linkedin": ""}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  technologies TEXT[] NOT NULL,
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  current BOOLEAN DEFAULT false,
  technologies TEXT[] DEFAULT '{}',
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  current BOOLEAN DEFAULT false,
  description TEXT,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT NOT NULL,
  available_for_work BOOLEAN DEFAULT true,
  preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'form')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seed data for about_me
INSERT INTO about_me (headline, bio, profile_image, resume_url, social_links)
VALUES (
  'Senior Front-End Developer',
  'I''m a passionate Front-End Developer with over 5 years of experience creating beautiful, responsive, and user-friendly web applications. I specialize in modern JavaScript frameworks like React and Next.js, and I''m dedicated to writing clean, maintainable code.

My journey in web development started with a curiosity about how websites work, which led me to pursue a degree in Computer Science. Since then, I''ve worked with various companies and clients, helping them bring their digital visions to life.

When I''m not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through blog posts and mentoring junior developers.',
  '/images/placeholder.svg',
  '/resume.pdf',
  '{"github": "https://github.com/yourusername", "linkedin": "https://linkedin.com/in/yourusername"}'
);

-- Create seed data for projects
INSERT INTO projects (title, description, image_url, technologies, github_url, live_url, featured, display_order)
VALUES 
(
  'E-commerce Platform',
  'A modern e-commerce platform built with Next.js, Tailwind CSS, and Stripe for payments.',
  '/images/placeholder.svg',
  ARRAY['Next.js', 'React', 'Tailwind CSS', 'Stripe'],
  'https://github.com/yourusername/ecommerce',
  'https://example.com',
  true,
  1
),
(
  'Task Management App',
  'A productivity app for managing tasks and projects with real-time updates.',
  '/images/placeholder.svg',
  ARRAY['React', 'Firebase', 'Tailwind CSS', 'Framer Motion'],
  'https://github.com/yourusername/task-app',
  'https://example.com',
  true,
  2
),
(
  'Portfolio Website',
  'A personal portfolio website showcasing my projects and skills.',
  '/images/placeholder.svg',
  ARRAY['Next.js', 'Tailwind CSS', 'Framer Motion', 'Supabase'],
  'https://github.com/yourusername/portfolio',
  'https://example.com',
  true,
  3
);

-- Create seed data for education
INSERT INTO education (institution, degree, field, start_date, end_date, current, description, display_order)
VALUES 
(
  'University of Technology',
  'Bachelor of Science',
  'Computer Science',
  '2014-09',
  '2018-06',
  false,
  'Graduated with honors. Specialized in web development and software engineering.',
  1
),
(
  'Frontend Masters',
  'Professional Certificate',
  'Advanced React Patterns',
  '2019-03',
  '2019-06',
  false,
  'Completed intensive course on advanced React patterns and best practices.',
  2
);

-- Create seed data for skills
INSERT INTO skills (name, category, proficiency, display_order)
VALUES 
('JavaScript', 'Frontend', 90, 1),
('TypeScript', 'Frontend', 85, 2),
('React', 'Frontend', 90, 3),
('Next.js', 'Frontend', 85, 4),
('Node.js', 'Backend', 80, 5),
('Express', 'Backend', 75, 6),
('PostgreSQL', 'Database', 70, 7),
('Tailwind CSS', 'Frontend', 85, 8),
('Framer Motion', 'Frontend', 80, 9),
('Git', 'Tools', 85, 10);

-- Create seed data for experiences
/*
INSERT INTO experiences (company, position, description, start_date, end_date, current, technologies, display_order)
VALUES 
(
  'Tech Innovations Inc.',
  'Senior Frontend Developer',
  'Led the development of a complex SaaS application using React and TypeScript. Implemented state management with Redux and improved performance by 40%.',
  '2021-03',
  NULL,
  true,
  ARRAY['React', 'TypeScript', 'Redux', 'Next.js'],
  1
),
(
  'Digital Solutions Ltd.',
  'Frontend Developer',
  'Developed responsive web applications using React and Next.js. Collaborated with designers to implement pixel-perfect UI components.',
  '2019-06',
  '2021-02',
  false,
  ARRAY['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
  2
),
(
  'Web Creators Agency',
  'Junior Web Developer',
  'Built and maintained various client websites using HTML, CSS, and JavaScript. Worked with the design team to translate mockups into functioning websites.',
  '2018-01',
  '2019-05',
  false,
  ARRAY['HTML', 'CSS', 'JavaScript', 'React'],
  3
);
*/

-- Create seed data for contact_info
INSERT INTO contact_info (email, phone, location, available_for_work, preferred_contact_method)
VALUES (
  'your.email@example.com',
  '+1 (555) 123-4567',
  'San Francisco, CA',
  true,
  'email'
); 