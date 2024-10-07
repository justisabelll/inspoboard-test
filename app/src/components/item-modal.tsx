import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { InspirationSelectType } from '../../../api/src/db';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authStore } from '@/lib/auth-store';
import { MediaPlayer, MediaProvider } from '@vidstack/react';

import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';

import {
  PlyrLayout,
  plyrLayoutIcons,
} from '@vidstack/react/player/layouts/plyr';

interface ItemModalProps {
  item: InspirationSelectType;
  isOpen: boolean;
  onClose: () => void;
}

export function ItemModal({ item, isOpen, onClose }: ItemModalProps) {
  const queryClient = useQueryClient();
  const auth = authStore((state) => state.isAuthenticated);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/protected/delete-item/${item.id}`,
          {
            method: 'DELETE',
            credentials: 'include',
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Server responded with an error:', errorData);
          throw new Error(errorData.message || 'Failed to delete item');
        }

        return response.json();
      } catch (error) {
        console.error('Error in mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Item deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['items'] });
      onClose();
    },
    onError: (error) => {
      toast.error('Error deleting item');
      console.error('Error deleting item:', error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {item.category_id === 2
              ? 'Image'
              : item.category_id === 3
              ? 'Quote'
              : 'Video'}
          </DialogTitle>
          <DialogDescription>
            Added on {new Date(item.created_at).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {item.category_id === 2 && (
            <img
              src={item.content}
              alt="Inspiration"
              className="w-full h-auto rounded-md max-h-[90vh] object-contain"
            />
          )}
          {item.category_id === 3 && (
            <blockquote className="text-xl italic border-l-4 border-primary pl-4 py-2">
              "{item.content}"
            </blockquote>
          )}
          {item.category_id === 1 && (
            <div className="aspect-video">
              <MediaPlayer src={item.content} crossOrigin="">
                <MediaProvider />
                <PlyrLayout
                  icons={plyrLayoutIcons}
                  style={{
                    '--plyr-color-main': 'hsl(var(--primary))',
                    '--plyr-video-control-color': 'hsl(var(--secondary))',
                    '--plyr-video-control-color-hover': 'hsl(var(--secondary))',
                    '--plyr-video-control-background-hover':
                      'hsl(var(--secondary-background))',
                    '--plyr-audio-control-color': 'hsl(var(--primary))',
                    '--plyr-audio-control-color-hover': 'hsl(var(--primary))',
                    '--plyr-audio-control-background-hover':
                      'hsl(var(--secondary))',
                    '--plyr-menu-background': 'hsl(var(--primary))',
                    '--plyr-menu-color': 'hsl(var(--primary))',
                  }}
                />
              </MediaPlayer>
            </div>
          )}
        </div>
        {item.source && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-1">Source:</h4>
            <span className="text-primary hover:underline flex items-center">
              <Icon icon="" className="mr-1" />
              {item.source}
            </span>
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-2">
          {auth && (
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
