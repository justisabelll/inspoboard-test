'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import { TileGrid } from '@/components/tile-grid';
import { ModeToggle } from '@/components/mode-toggle';
import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import LoginModal from '@/components/login-modal';
import { authStore } from './lib/auth-store';

export default function InspirationBoard() {
  const [filter, setFilter] = useState('all');
  const auth = authStore((state) => state.isAuthenticated);
  const updateAuth = authStore((state) => state.setAuth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/protected/auth-check`,
          {
            credentials: 'include',
          }
        );
        if (response.ok) {
          updateAuth(true);
        } else if (response.status === 401) {
          updateAuth(false);
        }
      } catch (error: unknown) {
        console.error('Authentication check failed:', error);
      }
    };

    checkAuth();
  }, [updateAuth]);

  const items = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await client.items.$get();
      const data = await res.json();

      return data;
    },
  });

  const categoryMap = {
    video: 1,
    image: 2,
    quote: 3,
  };

  const filteredItems =
    filter === 'all'
      ? items.data
      : items.data?.filter(
          (item) =>
            item.category_id === categoryMap[filter as keyof typeof categoryMap]
        );

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}logout`, {
        method: 'POST',
        credentials: 'include',
      });

      updateAuth(false);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="relative py-16 mb-12">
        <h1 className="text-6xl font-bold tracking-tight text-center">
          Inspo<span className="text-primary">board</span>{' '}
          <span className="animate-pulse">✨</span>
        </h1>
        <div className="flex absolute top-4 right-4 gap-3 items-center">
          <ModeToggle />
          {auth ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <LoginModal />
          )}
        </div>
      </header>

      <div className="container flex-grow px-4 mx-auto">
        <div className="flex justify-center mb-12 space-x-6">
          {['all', 'image', 'quote', 'video'].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`p-2 transition-all duration-150 ${
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
              {value === 'video' && (
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

        <TileGrid
          items={
            filteredItems?.map((item) => ({
              ...item,
              created_at: new Date(item.created_at),
            })) ?? []
          }
        />
      </div>
      {auth && (
        <Button
          size="icon"
          className="fixed right-8 bottom-8 rounded-full shadow-lg bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <Icon icon="mdi:plus" className="w-5 h-5" />
          <span className="sr-only">Add Inspiration</span>
        </Button>
      )}
    </div>
  );
}
