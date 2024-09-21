import { motion } from 'framer-motion';
import { div } from 'framer-motion/client';

interface InspirationTileProps {
  item: {
    type: string;
    content: string;
  };
}

export function Tile({ item }: InspirationTileProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      }}
      //@ts-expect-error - TypeScript error due to missing type definition for className
      className="overflow-hidden rounded-lg ring-1 shadow-sm aspect-square bg-card ring-primary/20"
    >
      {item.type === 'image' && (
        <img
          src={item.content}
          alt="Inspiration"
          className="object-cover w-full h-full"
        />
      )}
      {item.type === 'quote' && (
        <div className="flex justify-center items-center p-4 h-full text-center">
          <p className="text-sm font-light text-card-foreground">
            {item.content}
          </p>
        </div>
      )}
      {item.type === 'youtube' && (
        <iframe
          src={item.content}
          title="YouTube video"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </motion.div>
  );
}
