import { motion } from 'motion/react';

interface ArticleProps {
  id: string;
  slug?: string;
  data: {
    title: string;
    description: string;
    pubDate: Date | string;
    tag?: string;
  };
}

export default function ArticleCard({ article, index }: { article: ArticleProps; index: number }) {
  const date = new Date(article.data.pubDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.a
      href={`/blog/${article.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col h-full p-6 bg-[rgba(15,22,32,0.78)] backdrop-blur-md border border-white/12 rounded-2xl overflow-hidden hover:border-pink-400/40 transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute top-0 left-0 w-1 h-full bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-code text-slate-500 group-hover:text-pink-300 transition-colors">
            {date}
          </span>
          {article.data.tag && (
            <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded bg-black/25 text-slate-300 border border-white/12 group-hover:border-pink-400/30 transition-colors">
              {article.data.tag}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-pink-300 transition-colors leading-tight">
          {article.data.title || article.id}
        </h3>

        <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-grow leading-relaxed">
          {article.data.description}
        </p>

        <div className="flex items-center text-sm font-medium text-slate-400 group-hover:text-white transition-colors mt-auto">
          <span className="mr-2">Read Article</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}
