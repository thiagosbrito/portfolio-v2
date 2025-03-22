"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase, isSupabaseAvailable } from "@/lib/supabase/client";
import { ImageUpload } from "@/components/ui/image-upload";

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [id, setId] = useState<string | null>(null);
  const [headline, setHeadline] = useState("");
  const [socialLinks, setSocialLinks] = useState<{
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  }>({});
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    if (!isSupabaseAvailable() || !supabase) {
      toast({
        title: "Error",
        description: "Database connection not available",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching about content...');
      
      const { data, error } = await supabase
        .from("about_me")
        .select("*")
        .single();

      console.log('Fetch response:', { data, error });

      if (error && error.code !== "PGRST116") {
        // PGRST116 is the error code for "no rows returned"
        throw error;
      }

      if (data) {
        setId(data.id);
        setHeadline(data.headline || "");
        setSocialLinks(data.social_links || {});
        setBio(data.bio || "");
        setProfileImageUrl(data.profile_image || undefined);
        setResumeUrl(data.resume_url);
        console.log('State updated with:', { 
          id: data.id,
          profile_image: data.profile_image
        });
      }
    } catch (error) {
      console.error("Error fetching about content:", error);
      toast({
        title: "Error",
        description: "Failed to load about content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
    if (!isSupabaseAvailable() || !supabase) {
      toast({
        title: "Error",
        description: "Database connection not available",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${path}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error(`Error uploading ${path}:`, error);
      toast({
        title: "Error",
        description: `Failed to upload ${path}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleProfileImageUpload = async (url: string) => {
    if (!isSupabaseAvailable() || !supabase || !id) {
      toast({
        title: "Error",
        description: "Database connection not available or content not initialized",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Updating profile image with:', { url, id });
      
      // Verify the URL is accessible
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Image URL not accessible: ${response.status}`);
        }
      } catch (error) {
        console.error('Error verifying image URL:', error);
        throw new Error('Unable to verify image URL. Please check if the bucket is public.');
      }

      // Update the database with the public URL
      const { data, error } = await supabase
        .from("about_me")
        .update({
          profile_image: url,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select();

      console.log('Update response:', { data, error });

      if (error) {
        throw error;
      }

      // Update local state with the public URL
      setProfileImageUrl(url);

      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile image",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseAvailable() || !supabase) {
      toast({
        title: "Error",
        description: "Database connection not available",
        variant: "destructive",
      });
      return;
    }
    
    if (!headline || !bio) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Handle resume file upload if selected
      if (resumeFile) {
        const resumeFileUrl = await uploadFile(resumeFile, 'portfolio', 'resume');
        if (resumeFileUrl) {
          setResumeUrl(resumeFileUrl);
        }
      }
      
      const aboutData = {
        headline,
        bio,
        social_links: socialLinks,
        resume_url: resumeUrl,
        updated_at: new Date().toISOString()
      };

      let error;
      
      if (id) {
        // Update existing about content
        const { error: updateError } = await supabase
          .from("about_me")
          .update(aboutData)
          .eq("id", id);
          
        error = updateError;
      } else {
        // Insert new about content
        const { error: insertError } = await supabase
          .from("about_me")
          .insert([aboutData]);
          
        error = insertError;
      }

      if (error) {
        throw error;
      }

      // Fetch fresh data after update
      await fetchAboutContent();

      toast({
        title: "Success",
        description: "About content saved successfully",
      });
      
      // Reset file inputs
      setResumeFile(null);
      
      // Reset file input elements
      const resumeInput = document.getElementById('resume') as HTMLInputElement;
      if (resumeInput) resumeInput.value = '';
      
    } catch (error) {
      console.error("Error saving about content:", error);
      toast({
        title: "Error",
        description: "Failed to save about content",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Manage About Section</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit About Content</CardTitle>
          <CardDescription>
            Update your personal information and introduction
          </CardDescription>
        </CardHeader>
        
        {loading ? (
          <CardContent>
            <p>Loading content...</p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headline">Headline *</Label>
                <Input
                  id="headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="social">Social Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="github"
                    value={socialLinks.github || ""}
                    onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                    placeholder="GitHub URL"
                  />
                  <Input
                    id="linkedin"
                    value={socialLinks.linkedin || ""}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    placeholder="LinkedIn URL"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write about yourself, your experience, and your interests"
                  rows={8}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profile Image</Label>
                  <div className="space-y-2">
                    <ImageUpload
                      bucket="about-me"
                      path="profile"
                      onUploadComplete={handleProfileImageUpload}
                      variant="about"
                      defaultImage={profileImageUrl}
                    />
                    <p className="text-xs text-gray-500">
                      Upload a professional photo of yourself
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume/CV</Label>
                  <div className="space-y-2">
                    {resumeUrl && (
                      <div className="mb-2">
                        <a 
                          href={resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          View Current Resume
                        </a>
                      </div>
                    )}
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                    />
                    <p className="text-xs text-gray-500">
                      Upload your resume (PDF, DOC, or DOCX format)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="ml-auto"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
} 