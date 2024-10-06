'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { authStore } from '@/lib/auth-store';

export default function LoginModal() {
  const [open, setOpen] = useState(false);
  // const isAuthenticated = authStore((state) => state.isAuthenticated);
  const updateAuth = authStore((state) => state.setAuth);

  async function login(data: FormData) {
    const username = data.get('username');
    const password = data.get('password');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        credentials: 'include', // This is important for including cookies
      });

      if (response.ok) {
        toast.success('Logged in successfully');
        setOpen(false);
        updateAuth(true);
      } else {
        toast.error('Invalid credentials');
      }
      //eslint-disable-next-line
    } catch (error: unknown) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-primary/10 text-primary"
        >
          <Icon icon="mdi:login" className="mr-2 w-4 h-4 text-primary" />
          Admin Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center text-foreground">
            Login
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="p-0 w-8 h-8 text-foreground"
            ></Button>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your credentials to access your account.
          </DialogDescription>
        </DialogHeader>
        <form action={login} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              required
              className="bg-input text-input-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="bg-input text-input-foreground"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground"
            >
              <LogIn className="mr-2 w-4 h-4" />
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
