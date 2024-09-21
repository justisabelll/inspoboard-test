'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import { TileGrid } from '@/components/tile-grid';
import { ModeToggle } from '@/components/mode-toggle';
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="relative py-12 mb-12">
        <h1 className="text-6xl font-bold text-center">Inspoboard ✨</h1>
        <div className="absolute top-0 right-0 p-4">
          <ModeToggle />
        </div>
      </header>

      <div className="container flex-grow px-4 mx-auto">
        <div className="flex justify-center mb-12 space-x-6">
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
                <Icon icon="mdi:inbox-multiple" className="w-4 h-4" />
              )}
              {value === 'image' && (
                <Icon icon="mdi:image-outline" className="w-4 h-4" />
              )}
              {value === 'quote' && (
                <Icon icon="mdi:format-quote-close" className="w-4 h-4" />
              )}
              {value === 'youtube' && (
                <Icon icon="mdi:youtube" className="w-4 h-4" />
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

        <TileGrid items={filteredItems} />
      </div>

      <Button
        onClick={handleUpload}
        size="icon"
        className="fixed right-8 bottom-8 rounded-full shadow-lg bg-secondary text-secondary-foreground hover:bg-secondary/90"
      >
        <Icon icon="mdi:plus" className="w-5 h-5" />
        <span className="sr-only">Add Inspiration</span>
      </Button>
    </div>
  );
}
