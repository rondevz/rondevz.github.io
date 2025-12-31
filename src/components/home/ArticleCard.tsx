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
      className="group relative flex flex-col h-full p-6 bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-colors"
    >
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Decorative "Code" Line */}
      <div className="absolute top-0 left-0 w-1 h-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-code text-gray-500 group-hover:text-pink-400 transition-colors">
            {date}
          </span>
          {article.data.tag && (
            <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded bg-gray-800 text-gray-300 border border-gray-700 group-hover:border-pink-500/30 transition-colors">
              {article.data.tag}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-pink-400 transition-colors leading-tight">
          {article.data.title || article.id}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-grow leading-relaxed">
          {article.data.description}
        </p>

        {/* Footer / Link */}
        <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors mt-auto">
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
