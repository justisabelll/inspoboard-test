import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

import { InsportationSelectType } from '../../../api/src/db';

interface TileGridProps {
  items: InsportationSelectType[];
}

export function TileGrid({ items }: TileGridProps) {
  return (
    <motion.div
      //@ts-expect-error - TypeScript error due to missing type definition for className
      className="grid grid-cols-2 gap-2 mb-20 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      layout
    >
      <AnimatePresence>
        {items.map((item, index) => (
          <Tile key={index} item={item} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function Tile({ item }: { item: InsportationSelectType }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      //@ts-expect-error - TypeScript error due to missing type definition for className
      className="overflow-hidden rounded-lg ring-1 shadow-sm aspect-square bg-card ring-primary/20 hover:ring-primary/40"
    >
      {item.category_id === 2 && (
        <img
          src={item.content}
          alt="Inspiration"
          className="object-cover w-full h-full"
        />
      )}
      {item.category_id === 3 && (
        <div className="flex flex-col justify-center items-center p-4 h-full text-center bg-accent/10">
          <Icon
            icon="mdi:format-quote-open"
            className="mb-2 w-6 h-6 text-primary/60"
          />
          <p className="text-sm italic font-medium text-card-foreground">
            "{item.content}"
          </p>
          <Icon
            icon="mdi:format-quote-close"
            className="mt-2 w-6 h-6 text-primary/60"
          />
        </div>
      )}
      {item.category_id === 1 && (
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
