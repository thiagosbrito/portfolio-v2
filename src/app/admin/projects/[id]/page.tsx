'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { Project } from '@/lib/types';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function ProjectDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { id } = await params;
        setProjectId(id);
        
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProject(data);
          if (data.image_url) {
            setImagePreview(data.image_url);
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !projectId) return;

    setSaving(true);
    try {
      let imageUrl = project.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${projectId}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase!.storage
          .from('projects')
          .upload(filePath, imageFile, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase!.storage
          .from('projects')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase!
        .from('projects')
        .update({
          ...project,
          image_url: imageUrl,
        })
        .eq('id', projectId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!projectId) return;

    try {
      const { error } = await supabase!
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });

      router.push('/admin/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Button onClick={() => router.push('/admin/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={saving}
        >
          Delete Project
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={project.description}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="technologies">Technologies</Label>
          <Input
            id="technologies"
            value={project.technologies.join(', ')}
            onChange={(e) => setProject({ 
              ...project, 
              technologies: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean)
            })}
            required
          />
        </div>

        <div>
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            type="url"
            value={project.github_url}
            onChange={(e) => setProject({ ...project, github_url: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="live_url">Live URL</Label>
          <Input
            id="live_url"
            type="url"
            value={project.live_url}
            onChange={(e) => setProject({ ...project, live_url: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="image">Project Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt="Project preview"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/projects')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
} 