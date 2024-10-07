import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { InspirationSelectType } from '../../../api/src/db';
import { ItemModal } from './item-modal';

interface TileGridProps {
  items: InspirationSelectType[];
}

const getYouTubeVideoThumbnail = (url: string) => {
  const regex = /[?&]v=([^&]+)/;
  const match = url.match(regex);
  const videoId = match ? match[1] : null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg `;
};

export function TileGrid({ items }: TileGridProps) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-2 mb-20 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      layout
    >
      <AnimatePresence>
        {items.map((item) => (
          <Tile key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function Tile({ item }: { item: InspirationSelectType }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
        className="overflow-hidden rounded-lg ring-1 shadow-sm aspect-square bg-card ring-primary/20 hover:ring-primary/40 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
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
            <p className="text-sm italic font-medium text-card-foreground line-clamp-4">
              "{item.content}"
            </p>
            <Icon
              icon="mdi:format-quote-close"
              className="mt-2 w-6 h-6 text-primary/60"
            />
          </div>
        )}
        {item.category_id === 1 && (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={getYouTubeVideoThumbnail(item.content)}
              alt="YouTube Video Thumbnail"
              className="object-none w-full h-full scale-110 blur-sm "
            />
            <div className="absolute inset-0 flex items-center justify-center ">
              <Icon icon="mdi:youtube" className="w-12 h-12 text-red-500" />
            </div>
          </div>
        )}
      </motion.div>
      <ItemModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
