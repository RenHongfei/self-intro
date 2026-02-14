import { useEffect, useState } from 'react';
import Section from '@/components/Section';
import { motion, useScroll, useSpring } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Section as SectionType } from '@/types';

export default function Home() {
  const [sections, setSections] = useState<SectionType[]>([]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    const { data } = await supabase
      .from('sections')
      .select('*')
      .eq('is_visible', true)
      .order('order_index', { ascending: true });
    
    if (data) {
      setSections(data);
    }
  };

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
            {sections.map((section) => (
              <a 
                key={section.id}
                href={`#${section.slug}`}
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
        {sections.map((section) => (
          <Section
            key={section.id}
            id={section.slug}
            title={section.title}
            content={section.content}
            backgroundImage={section.background_image_url}
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
