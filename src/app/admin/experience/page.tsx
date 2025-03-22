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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase, isSupabaseAvailable } from "@/lib/supabase/client";

interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string;
  current: boolean;
  display_order: number;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [current, setCurrent] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
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
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        throw error;
      }

      setExperiences(data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast({
        title: "Error",
        description: "Failed to load experiences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCompany("");
    setPosition("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setCurrent(false);
    setDisplayOrder(0);
    setEditingId(null);
  };

  const handleEdit = (experience: Experience) => {
    setEditingId(experience.id);
    setCompany(experience.company);
    setPosition(experience.position);
    setStartDate(experience.start_date);
    setEndDate(experience.end_date || "");
    setDescription(experience.description);
    setCurrent(experience.current);
    setDisplayOrder(experience.display_order);
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
    
    if (!confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });
      
      fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error",
        description: "Failed to delete experience",
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
    
    if (!company || !position || !startDate || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const experienceData = {
        company,
        position,
        start_date: startDate,
        end_date: current ? null : endDate,
        description,
        current,
        display_order: displayOrder,
      };

      let error;
      
      if (editingId) {
        // Update existing experience
        const { error: updateError } = await supabase
          .from("experiences")
          .update(experienceData)
          .eq("id", editingId);
          
        error = updateError;
      } else {
        // Add new experience
        const { error: insertError } = await supabase
          .from("experiences")
          .insert([experienceData]);
          
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Experience ${editingId ? "updated" : "added"} successfully`,
      });
      
      resetForm();
      fetchExperiences();
    } catch (error) {
      console.error("Error saving experience:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingId ? "update" : "add"} experience`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Experience</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Experience" : "Add New Experience"}</CardTitle>
              <CardDescription>
                {editingId ? "Update the experience details" : "Add a new work experience to your portfolio"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Job title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2 my-4">
                  <Switch
                    id="current"
                    checked={current}
                    onCheckedChange={setCurrent}
                  />
                  <Label htmlFor="current">I currently work here</Label>
                </div>
                
                {!current && (
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your responsibilities and achievements"
                    rows={5}
                    required
                  />
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
                  {isSubmitting ? "Saving..." : (editingId ? "Update Experience" : "Add Experience")}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Experience List</h2>
          {loading ? (
            <p>Loading experiences...</p>
          ) : experiences.length === 0 ? (
            <p>No experiences found. Add your first work experience.</p>
          ) : (
            <div className="space-y-4">
              {experiences.map((experience) => (
                <Card key={experience.id}>
                  <CardHeader>
                    <CardTitle>{experience.position}</CardTitle>
                    <CardDescription>{experience.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      {new Date(experience.start_date).toLocaleDateString("en-US", { 
                        year: "numeric", 
                        month: "long" 
                      })} - {
                        experience.current 
                          ? "Present" 
                          : experience.end_date 
                            ? new Date(experience.end_date).toLocaleDateString("en-US", { 
                                year: "numeric", 
                                month: "long" 
                              }) 
                            : "No end date"
                      }
                    </p>
                    <p className="text-sm text-gray-600">{experience.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Display order: {experience.display_order}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(experience)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(experience.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 