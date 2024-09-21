'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tile } from '@/components/tile';
const initialItems = [
  { type: 'image', content: 'https://placehold.co/600x400' },
  {
    type: 'quote',
    content: 'The only way to do great work is to love what you do.',
  },
  { type: 'youtube', content: 'https://www.youtube.com/embed/------' },
  { type: 'image', content: 'https://placehold.co/600x400' },
  { type: 'quote', content: "Believe you can and you're halfway there." },
  { type: 'image', content: 'https://placehold.co/600x400' },
  { type: 'quote', content: 'Stay hungry, stay foolish.' },
  { type: 'image', content: 'https://placehold.co/600x400' },
  { type: 'youtube', content: 'https://www.youtube.com/embed/------' },
  {
    type: 'quote',
    content:
      'The future belongs to those who believe in the beauty of their dreams.',
  },
  { type: 'image', content: 'https://placehold.co/600x400' },
  { type: 'quote', content: "It always seems impossible until it's done." },
  { type: 'image', content: 'https://placehold.co/600x400' },
  { type: 'youtube', content: 'https://www.youtube.com/embed/------' },
  { type: 'image', content: 'https://placehold.co/600x400' },
  {
    type: 'quote',
    content: 'The best way to predict the future is to invent it.',
  },
];

export default function InspirationBoard() {
  const [items] = useState(initialItems);
  const [filter, setFilter] = useState('all');

  const handleUpload = () => {
    alert('Upload functionality would be implemented here');
  };

  const filteredItems =
    filter === 'all' ? items : items.filter((item) => item.type === filter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-12 mb-12">
        <h1 className="text-4xl font-extralight tracking-widest text-center">
          Inspoboard ✨
        </h1>
      </header>

      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-6 mb-12">
          {['all', 'image', 'quote', 'youtube'].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`p-2 transition-all duration-300 ${
                filter === value
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {value === 'all' && (
                <Icon icon="mdi:inbox-multiple" className="h-4 w-4" />
              )}
              {value === 'image' && (
                <Icon icon="mdi:image-outline" className="h-4 w-4" />
              )}
              {value === 'quote' && (
                <Icon icon="mdi:format-quote-close" className="h-4 w-4" />
              )}
              {value === 'youtube' && (
                <Icon icon="mdi:youtube" className="h-4 w-4" />
              )}
              <span className="sr-only">
                {value === 'all'
                  ? 'All'
                  : value === 'youtube'
                  ? 'Videos'
                  : `${value}s`}
              </span>
            </button>
          ))}
        </div>

        <motion.div
          //@ts-expect-error - TypeScript error due to missing type definition for className
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-20"
          layout
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <Tile key={index} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Button
        onClick={handleUpload}
        size="icon"
        className="fixed bottom-8 right-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
      >
        <Icon icon="mdi:plus" className="h-5 w-5" />
        <span className="sr-only">Add Inspiration</span>
      </Button>
    </div>
  );
}
