-- Add technologies column to experiences table
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';

-- Update existing experiences with technologies
UPDATE experiences SET technologies = ARRAY['React', 'TypeScript', 'Redux', 'Next.js'] WHERE company = 'Tech Innovations Inc.';
UPDATE experiences SET technologies = ARRAY['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'] WHERE company = 'Digital Solutions Ltd.';
UPDATE experiences SET technologies = ARRAY['HTML', 'CSS', 'JavaScript', 'React'] WHERE company = 'Web Creators Agency'; 