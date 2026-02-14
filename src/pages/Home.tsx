import { useEffect, useState } from 'react';
import Section from '@/components/Section';
import { motion, useScroll, useSpring } from 'framer-motion';

// Mock data until Supabase is connected
const MOCK_SECTIONS = [
  {
    id: 'hero',
    title: 'Hello, I\'m a Developer',
    content: `
I build exceptional digital experiences.

Based in the cloud, working worldwide.
    `,
    backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    type: 'hero'
  },
  {
    id: 'about',
    title: 'About Me',
    content: `
### Passionate about code

I am a full-stack developer with a love for clean code and intuitive design.

- 5+ years of experience
- Specialized in React & Node.js
- Open source contributor
    `,
    backgroundImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
    type: 'text'
  },
  {
    id: 'projects',
    title: 'Projects',
    content: `
### Featured Work

1. **E-commerce Platform**: A full-featured online store built with Next.js and Stripe.
2. **Task Manager**: A collaborative productivity tool with real-time updates.
3. **AI Chatbot**: An intelligent assistant powered by OpenAI.
    `,
    backgroundImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    type: 'projects'
  },
  {
    id: 'contact',
    title: 'Get in Touch',
    content: `
Ready to start your next project?

- **Email**: hello@example.com
- **GitHub**: [github.com/example](https://github.com)
- **LinkedIn**: [linkedin.com/in/example](https://linkedin.com)
    `,
    backgroundImage: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2071&auto=format&fit=crop',
    type: 'contact'
  }
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">Portfolio</div>
          <div className="hidden md:flex space-x-8">
            {MOCK_SECTIONS.map((section) => (
              <a 
                key={section.id}
                href={`#${section.id}`}
                className="text-sm font-medium hover:text-blue-400 transition-colors"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {MOCK_SECTIONS.map((section) => (
          <Section
            key={section.id}
            id={section.id}
            title={section.title}
            content={section.content}
            backgroundImage={section.backgroundImage}
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-black py-8 text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} Portfolio. Built with React & Framer Motion.</p>
      </footer>
    </div>
  );
}
