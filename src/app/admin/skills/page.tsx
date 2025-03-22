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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase, isSupabaseAvailable } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  display_order: number;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [proficiency, setProficiency] = useState(0);
  const [displayOrder, setDisplayOrder] = useState(0);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
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
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        throw error;
      }

      setSkills(data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast({
        title: "Error",
        description: "Failed to load skills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setCategory("");
    setProficiency(0);
    setDisplayOrder(0);
    setEditingId(null);
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setName(skill.name);
    setCategory(skill.category);
    setProficiency(skill.proficiency);
    setDisplayOrder(skill.display_order);
  };

  const handleDelete = async (id: string) => {
    if (!isSupabaseAvailable() || !supabase) {
      toast({
        title: "Error",
        description: "Database connection not available",
        variant: "destructive",
      });
      return;
    }
    
    if (!confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });
      
      fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    
    if (!name || !category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const skillData = {
        name,
        category,
        proficiency,
        display_order: displayOrder,
      };

      let error;
      
      if (editingId) {
        // Update existing skill
        const { error: updateError } = await supabase
          .from("skills")
          .update(skillData)
          .eq("id", editingId);
          
        error = updateError;
      } else {
        // Add new skill
        const { error: insertError } = await supabase
          .from("skills")
          .insert([skillData]);
          
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Skill ${editingId ? "updated" : "added"} successfully`,
      });
      
      resetForm();
      fetchSkills();
    } catch (error) {
      console.error("Error saving skill:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingId ? "update" : "add"} skill`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Skills</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Skill" : "Add New Skill"}</CardTitle>
              <CardDescription>
                {editingId ? "Update the skill details" : "Add a new skill to your portfolio"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Skill Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. React, JavaScript, Figma"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Frontend, Backend, Design"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="proficiency">Proficiency (0-100)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="proficiency"
                      type="range"
                      min="0"
                      max="100"
                      value={proficiency}
                      onChange={(e) => setProficiency(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{proficiency}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-500">Lower numbers appear first</p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : (editingId ? "Update Skill" : "Add Skill")}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Skills List</h2>
          {loading ? (
            <p>Loading skills...</p>
          ) : skills.length === 0 ? (
            <p>No skills found. Add your first skill.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-lg font-medium">{category}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {categorySkills.map((skill) => (
                      <Card key={skill.id} className="overflow-hidden">
                        <div className="relative">
                          <div 
                            className="absolute bottom-0 left-0 h-1 bg-primary" 
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <CardContent className="pt-4 pb-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{skill.name}</p>
                            <p className="text-xs text-gray-500">Order: {skill.display_order}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{skill.proficiency}%</Badge>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(skill)}
                              className="h-8 w-8 p-0"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                <path d="m15 5 4 4"/>
                              </svg>
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(skill.id)}
                              className="h-8 w-8 p-0 text-destructive"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                <line x1="10" x2="10" y1="11" y2="17"/>
                                <line x1="14" x2="14" y1="11" y2="17"/>
                              </svg>
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 