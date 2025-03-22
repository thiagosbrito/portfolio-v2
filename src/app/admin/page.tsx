'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  MessageSquare, 
  PenTool, 
  User, 
  Briefcase, 
  Code, 
  Layers,
  Home 
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface DashboardStats {
  projects: number;
  experiences: number;
  skills: number;
  messages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    experiences: 0,
    skills: 0,
    messages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        if (!supabase) {
          console.error('Supabase client not initialized');
          return;
        }

        // Fetch counts from each table
        const [projectsResponse, experiencesResponse, skillsResponse, messagesResponse] = await Promise.all([
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('experiences').select('id', { count: 'exact', head: true }),
          supabase.from('skills').select('id', { count: 'exact', head: true }),
          supabase.from('messages').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          projects: projectsResponse.count || 0,
          experiences: experiencesResponse.count || 0,
          skills: skillsResponse.count || 0,
          messages: messagesResponse.count || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const dashboardCards = [
    {
      title: 'Projects',
      value: stats.projects,
      description: 'Total projects in your portfolio',
      icon: <Code className="h-5 w-5 text-primary" />,
      link: '/admin/projects',
    },
    {
      title: 'Experience',
      value: stats.experiences,
      description: 'Work experiences listed',
      icon: <Briefcase className="h-5 w-5 text-primary" />,
      link: '/admin/experience',
    },
    {
      title: 'Skills',
      value: stats.skills,
      description: 'Skills and technologies',
      icon: <Layers className="h-5 w-5 text-primary" />,
      link: '/admin/skills',
    },
    {
      title: 'Messages',
      value: stats.messages,
      description: 'Contact form messages',
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      link: '/admin/messages',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your portfolio content and view statistics.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardCards.map((card, index) => (
              <Link href={card.link} key={index}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    {card.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading ? (
                        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                      ) : (
                        card.value
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent content updates and messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                          <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    No recent activity to display
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/admin/home">
                  <div className="flex items-center p-3 hover:bg-muted rounded-md cursor-pointer transition-colors">
                    <Home className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <div className="font-medium">Update Home</div>
                      <div className="text-sm text-muted-foreground">
                        Edit your home page content
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/admin/projects/new">
                  <div className="flex items-center p-3 hover:bg-muted rounded-md cursor-pointer transition-colors">
                    <PenTool className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <div className="font-medium">Add New Project</div>
                      <div className="text-sm text-muted-foreground">
                        Create a new portfolio project
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/admin/experience">
                  <div className="flex items-center p-3 hover:bg-muted rounded-md cursor-pointer transition-colors">
                    <Briefcase className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <div className="font-medium">Add Work Experience</div>
                      <div className="text-sm text-muted-foreground">
                        Add a new work experience entry
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/admin/skills">
                  <div className="flex items-center p-3 hover:bg-muted rounded-md cursor-pointer transition-colors">
                    <Layers className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <div className="font-medium">Manage Skills</div>
                      <div className="text-sm text-muted-foreground">
                        Add or update your skills
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/admin/about">
                  <div className="flex items-center p-3 hover:bg-muted rounded-md cursor-pointer transition-colors">
                    <User className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <div className="font-medium">Update About Me</div>
                      <div className="text-sm text-muted-foreground">
                        Edit your personal information
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/admin/messages">
                  <div className="flex items-center p-3 hover:bg-muted rounded-md cursor-pointer transition-colors">
                    <MessageSquare className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <div className="font-medium">View Messages</div>
                      <div className="text-sm text-muted-foreground">
                        Check contact form submissions
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Analytics</CardTitle>
              <CardDescription>
                View statistics about your portfolio website
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <BarChart className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">
                    Analytics feature coming soon
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This feature is currently under development
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 