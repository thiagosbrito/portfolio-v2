"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface HomeContent {
  id?: string;
  headline: string;
  sub_headline: string;
  welcome_text: string;
  profile_image: string;
  cta_text: string;
  cta_link: string;
}

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState<HomeContent>({
    headline: '',
    sub_headline: '',
    welcome_text: '',
    profile_image: '',
    cta_text: '',
    cta_link: '',
  });

  const fetchHomeContent = useCallback(async () => {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return;
      }

      const { data, error } = await supabase
        .from('home')
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, create initial record
          const { error: insertError } = await supabase
            .from('home')
            .insert([content]);

          if (insertError) {
            throw insertError;
          }
        } else {
          throw error;
        }
      } else if (data) {
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching home content:', error);
      toast.error('Failed to fetch home content');
    } finally {
      setIsLoading(false);
    }
  }, [content]);

  useEffect(() => {
    fetchHomeContent();
  }, [fetchHomeContent, content]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageUpload = async (url: string, path: string) => {
    if (!supabase || !content.id) return;

    try {
      setContent((prev) => ({ ...prev, profile_image: path }));
      
      const { error } = await supabase
        .from('home')
        .update({ profile_image: path })
        .eq('id', content.id);

      if (error) throw error;
      
      toast.success('Profile image updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating profile image:', error);
      toast.error('Failed to update profile image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !content.id) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('home')
        .update({
          ...content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', content.id);

      if (error) throw error;

      toast.success('Content saved successfully');
      router.refresh();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] p-6 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] p-6">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="flex-none pb-6">
          <h1 className="text-3xl font-bold mb-2">Home Content</h1>
          <p className="text-muted-foreground">
            Manage your portfolio&apos;s home page content here.
          </p>
        </div>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Left Column - Profile Image */}
          <div className="w-1/3 flex flex-col">
            <Card className="flex-1">
              <CardHeader className="pb-4">
                <CardTitle>Profile Image</CardTitle>
                <CardDescription>
                  Upload a professional profile image for your home page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  bucket="home"
                  path="profile"
                  variant="hero"
                  onUploadComplete={handleProfileImageUpload}
                  defaultImage={content.profile_image}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Forms */}
          <div className="w-2/3 flex flex-col">
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle>Main Content</CardTitle>
                    <CardDescription>
                      Set your headline and introduction text
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="headline" className="text-sm font-medium mb-1.5">
                          Headline
                        </Label>
                        <Input
                          id="headline"
                          name="headline"
                          value={content.headline}
                          onChange={handleInputChange}
                          placeholder="Enter your main headline"
                          className="w-full"
                        />
                        <p className="text-sm text-muted-foreground mt-1.5">
                          This will be the first text visitors see on your home page
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="sub_headline" className="text-sm font-medium mb-1.5">
                          Sub Headline
                        </Label>
                        <Input
                          id="sub_headline"
                          name="sub_headline"
                          value={content.sub_headline}
                          onChange={handleInputChange}
                          placeholder="Enter a supporting sub headline"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label htmlFor="welcome_text" className="text-sm font-medium mb-1.5">
                          Welcome Text
                        </Label>
                        <Textarea
                          id="welcome_text"
                          name="welcome_text"
                          value={content.welcome_text}
                          onChange={handleInputChange}
                          placeholder="Write a welcoming introduction message"
                          rows={4}
                          className="w-full resize-y min-h-[100px]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle>Call to Action</CardTitle>
                    <CardDescription>
                      Configure the main action button on your home page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cta_text" className="text-sm font-medium mb-1.5">
                        Button Text
                      </Label>
                      <Input
                        id="cta_text"
                        name="cta_text"
                        value={content.cta_text}
                        onChange={handleInputChange}
                        placeholder="e.g., View My Projects"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cta_link" className="text-sm font-medium mb-1.5">
                        Button Link
                      </Label>
                      <Input
                        id="cta_link"
                        name="cta_link"
                        value={content.cta_link}
                        onChange={handleInputChange}
                        placeholder="e.g., /projects"
                        className="w-full"
                      />
                      <p className="text-sm text-muted-foreground mt-1.5">
                        Enter the path or URL where the button should lead
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin')}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 