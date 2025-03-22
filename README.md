# Thiago Brito Portfolio

A modern portfolio website built with Next.js, Tailwind CSS, Framer Motion, Shadcn UI, and Supabase.

## Features

- Modern and responsive design
- Smooth animations with Framer Motion
- Content management with Supabase
- Sections for projects, experience, skills, about, and contact
- Dark/light mode support
- Contact form with validation
- Integrated messaging system with email notifications
- Admin dashboard for content management

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **CMS**: Supabase
- **Email Integration**: Nodemailer with Outlook
- **Form Validation**: React Hook Form, Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Email Integration (Optional)
   EMAIL_USER=your_outlook_email
   EMAIL_PASSWORD=your_app_password
   ADMIN_EMAIL=your_admin_email
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup

1. Create a new Supabase project
2. Set up the following tables:
   - `projects`
   - `experiences`
   - `skills`
   - `education`
   - `about_me`
   - `contact_info`
   - `messages`
   - `message_replies`

Refer to the `src/lib/types.ts` file for the schema of each table and the SQL migrations files in `supabase/migrations/` for the complete table definitions.

## Email Integration Setup

For full messaging functionality, including email notifications and the ability to reply to messages via email:

1. See the detailed instructions in `README_EMAIL_INTEGRATION.md`
2. Set up the required environment variables for email integration
3. Configure an email forwarding service if you want to capture direct email replies

## Deployment

This project can be easily deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fportfolio)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)
- [Nodemailer](https://nodemailer.com/)