import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useMutation } from '@tanstack/react-query';
import { CategorySelectType } from '../../../api/src/db';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Icon } from '@iconify/react';
import { UploadButton } from '@uploadthing/react';

const formSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  source: z.string().optional(),
  category: z.string(),
});

export interface InspirationType {
  content: string;
  source: string | undefined;
  category: CategorySelectType;
}

import { toast } from 'sonner';

export default function NewInspiration({
  categories,
}: {
  categories: CategorySelectType[];
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      source: '',
      category: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InspirationType) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/protected/new-items`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item: data }),
            credentials: 'include',
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Server responded with an error:', errorData);
          throw new Error(errorData.message || 'Failed to add new item');
        }

        return response.json();
      } catch (error) {
        console.error('Error in mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Item added successfully');
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error('Error adding item');
      console.error('Error adding item:', error);
    },
  });

  const optimizeAndUpload = async (file: File): Promise<File> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/protected/optimize-image`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Image optimization failed');
    }

    const optimizedBlob = await response.blob();
    return new File(
      [optimizedBlob],
      file.name.replace(/\.[^/.]+$/, '') + '.webp',
      { type: 'image/webp' }
    );
  };

  function onSubmit(data: z.infer<typeof formSchema>) {
    const selectedCategory = categories.find(
      (category) => category.name === data.category
    );
    if (!selectedCategory) {
      toast.error('Category not found');
      return;
    }

    const newItem = {
      content: data.content,
      source: data.source,
      category: {
        id: selectedCategory.id,
        name: selectedCategory.name,
      },
    };

    mutation.mutate(newItem);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Icon icon="mdi:plus" className="w-6 h-6" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Inspiration</DialogTitle>
          <DialogDescription>
            Add a new piece of inspiration to your board.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name.charAt(0).toUpperCase() +
                            category.name.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category for your inspiration.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your inspiration" />
                  </FormControl>
                  <FormDescription>
                    This can be a quote, or a link to an image or YouTube video.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter the source (optional)"
                    />
                  </FormControl>
                  <FormDescription>
                    Source of the inspiration (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <UploadButton
              endpoint="imageUploader"
              onBeforeUploadBegin={async (files: File[]) => {
                try {
                  const optimizedFiles = await Promise.all(
                    files.map(optimizeAndUpload)
                  );
                  toast.success('Images optimized successfully');
                  return optimizedFiles;
                } catch (error) {
                  toast.error('Error optimizing images');
                  console.error('Error optimizing images:', error);
                  return files; // Fall back to original files if optimization fails
                }
              }}
              onClientUploadComplete={(res) => {
                toast.success('Upload Completed');
                console.log('Files: ', res);
                // Here you can add logic to update the form with the uploaded file URLs if needed
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload ERROR! ${error.message}`);
              }}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Adding...' : 'Add Inspiration'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
