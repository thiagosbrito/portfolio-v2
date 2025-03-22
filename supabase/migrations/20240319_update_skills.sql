-- Drop existing skills table
DROP TABLE IF EXISTS skills;

-- Create updated skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 5),
  is_expert BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert skills data based on CV
INSERT INTO skills (name, category, proficiency, is_expert, display_order) VALUES 
-- Front-End Frameworks
('Angular', 'Front-End Frameworks', 5, true, 1),
('NextJs', 'Front-End Frameworks', 4, false, 2),
('React Native', 'Front-End Frameworks', 4, false, 3),
('Ionic Framework', 'Front-End Frameworks', 4, false, 4),

-- Languages
('TypeScript', 'Languages', 5, true, 5),
('JavaScript', 'Languages', 5, true, 6),
('HTML5', 'Languages', 5, true, 7),
('CSS3', 'Languages', 5, true, 8),

-- State Management
('Redux', 'State Management', 5, true, 9),
('NgRx', 'State Management', 4, false, 10),
('Zustand', 'State Management', 4, false, 11),
('Ngxs', 'State Management', 4, false, 12),

-- Testing
('Karma', 'Testing', 5, true, 13),
('Jest', 'Testing', 5, true, 14),
('Cypress', 'Testing', 4, false, 15),
('Playwright', 'Testing', 4, false, 16),

-- Build Tools & Package Managers
('Webpack', 'Build Tools & Package Managers', 4, false, 17),
('Vite', 'Build Tools & Package Managers', 4, false, 18),
('Babel', 'Build Tools & Package Managers', 4, false, 19),
('NPM', 'Build Tools & Package Managers', 4, false, 20),
('Yarn', 'Build Tools & Package Managers', 4, false, 21),
('Bun', 'Build Tools & Package Managers', 4, false, 22),
('Pnpm', 'Build Tools & Package Managers', 4, false, 23),

-- Backend & Databases
('Firebase', 'Backend & Databases', 4, false, 24),
('Supabase', 'Backend & Databases', 4, false, 25),
('PostgreSQL', 'Backend & Databases', 4, false, 26),
('NodeJs', 'Backend & Databases', 4, false, 27),
('PHP', 'Backend & Databases', 3, false, 28),
('MySQL', 'Backend & Databases', 3, false, 29),

-- Design & Creative
('Figma', 'Design & Creative', 4, false, 30),
('Adobe Photoshop', 'Design & Creative', 4, false, 31),
('Illustrator', 'Design & Creative', 4, false, 32),
('Procreate', 'Design & Creative', 4, false, 33),
('Drawing', 'Design & Creative', 4, false, 34),
('Graffiti', 'Design & Creative', 4, false, 35),
('Calligraphy', 'Design & Creative', 4, false, 36); 