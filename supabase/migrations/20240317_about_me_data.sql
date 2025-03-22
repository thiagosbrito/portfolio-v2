-- Insert initial data into about_me table if it doesn't exist
INSERT INTO about_me (headline, bio, profile_image, social_links)
SELECT 
  'Senior Front-End Developer',
  E'I\'m a passionate Front-End Developer with over 5 years of experience creating beautiful, responsive, and user-friendly web applications. I specialize in modern JavaScript frameworks like React and Next.js, and I\'m dedicated to writing clean, maintainable code.\n\nMy journey in web development started with a curiosity about how websites work, which led me to pursue a degree in Computer Science. Since then, I\'ve worked with various companies and clients, helping them bring their digital visions to life.\n\nWhen I\'m not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through blog posts and mentoring junior developers.',
  '/images/placeholder.svg',
  '{"github": "https://github.com/yourusername", "linkedin": "https://linkedin.com/in/yourusername"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM about_me LIMIT 1
); 