import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

interface SectionProps {
  id: string;
  title: string;
  content: string;
  backgroundImage?: string;
  className?: string;
}

export default function Section({ id, title, content, backgroundImage, className }: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      id={id} 
      ref={ref} 
      className={cn("relative min-h-screen flex items-center justify-center overflow-hidden py-20", className)}
    >
      {backgroundImage && (
        <motion.div 
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      )}

      <motion.div 
        style={{ opacity }}
        className="relative z-10 container mx-auto px-4 max-w-4xl"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-8 text-center text-white drop-shadow-lg">
          {title}
        </h2>
        
        <div className="prose prose-invert prose-lg max-w-none bg-black/30 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/10">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {content}
          </ReactMarkdown>
        </div>
      </motion.div>
    </section>
  );
}
