'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Mail, Phone, MapPin, Instagram, Linkedin } from 'lucide-react';
import { getContactInfo, saveMessage } from '@/lib/supabase/services';
import { useToast } from '@/components/ui/use-toast';
import { ContactInfo } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(4, { message: 'Subject must be at least 4 characters.' }),
  message: z.string().min(20, { message: 'Message must be at least 20 characters.' }),
});

type ContactFormData = z.infer<typeof formSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  // Initialize form
  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Fetch contact info from Supabase
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await getContactInfo();
        if (data) {
          setContactInfo(data);
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
        toast({
          title: 'Error',
          description: 'Failed to load contact information. Using fallback data.',
          variant: 'destructive',
        });
      }
    };

    fetchContactInfo();
  }, [toast]);

  // Handle form submission
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Save message to Supabase
      const result = await saveMessage({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      });
      
      if (result.success) {
        // Display success toast
        toast({
          title: "Message sent!",
          description: "Thank you for your message. I'll get back to you soon.",
          variant: "default",
        });
        
        // Reset form
        form.reset();
      } else {
        // Display error toast
        toast({
          title: "Error sending message",
          description: result.error || "There was a problem sending your message. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fallback contact info
  const fallbackContactInfo = {
    email: contactInfo?.email || 'brito.dev@outlook.com',
    phone: contactInfo?.phone || '+61 123 456 789',
    location: contactInfo?.location || 'Melbourne, Australia',
    available_for_work: contactInfo?.available_for_work ?? true,
    preferred_contact_method: contactInfo?.preferred_contact_method || 'email',
  };

  const fadeIn = (direction: 'up' | 'down' | 'left' | 'right', delay: number) => {
    return {
      hidden: {
        y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
        x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
        opacity: 0,
      },
      visible: {
        y: 0,
        x: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          damping: 12,
          stiffness: 100,
          delay: delay,
        },
      },
    };
  };

  const contactItems = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: 'Email',
      value: fallbackContactInfo.email,
      link: `mailto:${fallbackContactInfo.email}`,
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: 'Phone',
      value: fallbackContactInfo.phone,
      link: `tel:${fallbackContactInfo.phone?.replace(/\s+/g, '')}`,
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: 'Location',
      value: fallbackContactInfo.location,
      link: `https://maps.google.com/?q=${encodeURIComponent(fallbackContactInfo.location)}`,
    },
  ];

  const socialLinks = {
    linkedin: 'https://linkedin.com/in/thiagosbrito',
  };

  return (
    <section id="contact" className="py-12 md:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn('up', 0.2)}
        className="container px-4 md:px-6 max-w-6xl mx-auto"
      >
        <div className="flex flex-col gap-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get in Touch</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            Have a project in mind or want to chat? Send me a message!
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            variants={fadeIn('right', 0.3)}
            className="rounded-lg border bg-card/50 p-8 shadow-lg relative overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-primary/2 to-transparent" />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name" 
                          {...field} 
                          className="h-11 bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary/50 hover:border-primary/30 transition-colors placeholder:text-muted-foreground/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your email" 
                          type="email" 
                          {...field}
                          className="h-11 bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary/50 hover:border-primary/30 transition-colors placeholder:text-muted-foreground/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Subject</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Message subject" 
                          {...field}
                          className="h-11 bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary/50 hover:border-primary/30 transition-colors placeholder:text-muted-foreground/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your message"
                          {...field}
                          className="min-h-[150px] bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary/50 hover:border-primary/30 transition-colors resize-none placeholder:text-muted-foreground/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-11 text-base"
                  disabled={isSubmitting}
                  variant="modern"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </span>
                </Button>
              </form>
            </Form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={fadeIn('left', 0.3)}
            className="space-y-8 rounded-lg border bg-card/50 p-8 shadow-lg relative overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute inset-0 h-full bg-gradient-to-br from-primary/5 via-primary/3 to-transparent" />
            <div className="relative space-y-4">
              <h3 className="text-2xl font-bold tracking-tight">Contact Information</h3>
              <p className="text-muted-foreground text-lg">
                Reach out through any of these channels and I&apos;ll respond as soon as possible.
              </p>
            </div>
            <div className="relative space-y-6">
              {contactItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-primary/5 group relative overflow-hidden"
                  variants={fadeIn('left', 0.1 * (index + 3))}
                >
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {item.value}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.a>
              ))}
            </div>
            <div className="relative space-y-4 pt-4 border-t">
              <h3 className="text-xl font-bold">Connect</h3>
              <div className="flex gap-4">
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl p-3 text-muted-foreground hover:text-primary bg-primary/5 hover:bg-primary/10 transition-all duration-300"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
} 