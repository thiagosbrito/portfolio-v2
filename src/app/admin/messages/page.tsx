'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Trash, CheckCheck, Mail, Send, ArrowLeft, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getMessages, Message, saveMessageReply, MessageReply } from '@/lib/supabase/services';
import { supabase } from '@/lib/supabase/client';

// Define custom alert components
const Alert = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-4 bg-muted/50 border rounded-lg ${className || ''}`}>
    {children}
  </div>
);

const AlertTitle = ({ children }: { children: React.ReactNode }) => (
  <h5 className="font-medium flex items-center gap-2 mb-2">{children}</h5>
);

const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm text-muted-foreground">{children}</div>
);

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Record<string, MessageReply[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      setLoading(true);
      const messagesData = await getMessages();
      setMessages(messagesData);
      
      // Fetch replies for each message
      await fetchReplies(messagesData);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  
  async function fetchReplies(messages: Message[]) {
    try {
      // Only fetch replies if we have messages
      if (!messages.length) return;
      
      // Build an object to store replies by message ID
      const repliesObj: Record<string, MessageReply[]> = {};
      
      // Get all message IDs
      const messageIds = messages.map(msg => msg.id).filter(Boolean) as string[];
      
      if (!messageIds.length) return;
      
      // Query for all replies at once
      const { data: repliesData, error } = await supabase!
        .from('message_replies')
        .select('*')
        .in('message_id', messageIds)
        .order('sent_at', { ascending: true });
      
      if (error) throw error;
      
      // Organize replies by message ID
      if (repliesData?.length) {
        for (const reply of repliesData) {
          if (!repliesObj[reply.message_id]) {
            repliesObj[reply.message_id] = [];
          }
          repliesObj[reply.message_id].push(reply);
        }
      }
      
      setConversations(repliesObj);
    } catch (error) {
      console.error('Error fetching replies:', error);
      toast({
        title: "Error",
        description: "Failed to load message replies.",
        variant: "destructive",
      });
    }
  }

  async function markAsRead(id: string) {
    try {
      const { error } = await supabase!
        .from('messages')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === id ? { ...msg, read: true } : msg
        )
      );

      toast({
        title: "Success",
        description: "Message marked as read.",
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark message as read.",
        variant: "destructive",
      });
    }
  }

  async function deleteMessage(id: string) {
    try {
      // First, delete any replies to this message
      const { error: repliesError } = await supabase!
        .from('message_replies')
        .delete()
        .eq('message_id', id);
      
      if (repliesError) throw repliesError;
      
      // Then delete the message
      const { error } = await supabase!
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.id !== id)
      );
      
      // Also update conversations state
      setConversations(prev => {
        const newConversations = { ...prev };
        delete newConversations[id];
        return newConversations;
      });

      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }

      toast({
        title: "Success",
        description: "Message and its replies deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      });
    }
  }

  function handleReply(message: Message) {
    setSelectedMessage(message);
    setReplying(true);
    setReplyText('');
  }

  async function sendReply() {
    if (!selectedMessage || !replyText.trim()) return;
    
    setSendingReply(true);
    
    try {
      const result = await saveMessageReply({
        message_id: selectedMessage.id!,
        reply_text: replyText,
        sender_email: 'brito.dev@outlook.com',
        recipient_email: selectedMessage.email,
        subject: `Re: ${selectedMessage.subject}`
      });
      
      if (result.success) {
        // Send actual email via Outlook
        await sendOutlookEmail({
          to: selectedMessage.email,
          subject: `Re: ${selectedMessage.subject}`,
          body: replyText,
          threadId: selectedMessage.thread_id
        });
        
        toast({
          title: "Reply sent",
          description: "Your reply has been sent successfully.",
        });
        
        // Mark message as read and update UI
        await markAsRead(selectedMessage.id!);
        
        // Add the reply to the local state
        setConversations(prev => {
          const newReplies = [...(prev[selectedMessage.id!] || []), {
            message_id: selectedMessage.id!,
            reply_text: replyText,
            sender_email: 'brito.dev@outlook.com',
            recipient_email: selectedMessage.email,
            subject: `Re: ${selectedMessage.subject}`,
            sent_at: new Date().toISOString()
          }];
          
          return {
            ...prev,
            [selectedMessage.id!]: newReplies
          };
        });
        
        setReplying(false);
      } else {
        throw new Error(result.error || 'Failed to save reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingReply(false);
    }
  }
  
  async function sendOutlookEmail({ to, subject, body, threadId }: {
    to: string;
    subject: string;
    body: string;
    threadId?: string;
  }) {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          body,
          threadId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending Outlook email:', error);
      throw error;
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => router.push('/admin')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto"
          onClick={fetchMessages}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>
      
      <Alert className="mb-6">
        <AlertTitle><Info className="h-4 w-4" /> Email Integration Active</AlertTitle>
        <AlertDescription>
          When you reply to messages here, emails will be sent via your Outlook account (brito.dev@outlook.com). 
          If the recipient replies to that email, their response will be automatically added to this conversation history.
        </AlertDescription>
      </Alert>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-muted-foreground text-sm">When someone contacts you, their messages will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-medium">Inbox</h3>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedMessage?.id === message.id ? 'bg-muted' : ''
                    } ${!message.read ? 'border-l-4 border-primary' : ''}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium truncate">{message.name}</span>
                      {!message.read ? (
                        <Badge variant="default" className="ml-2">New</Badge>
                      ) : (
                        conversations[message.id!]?.length > 0 && (
                          <Badge variant="outline" className="ml-2">
                            {conversations[message.id!].length} {conversations[message.id!].length === 1 ? 'reply' : 'replies'}
                          </Badge>
                        )
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground truncate mb-1">
                      {message.subject}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {message.created_at && formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedMessage.subject}</CardTitle>
                      <CardDescription>
                        From: {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                      </CardDescription>
                      <div className="text-xs text-muted-foreground mt-1">
                        {selectedMessage.created_at && formatDistanceToNow(new Date(selectedMessage.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="space-x-2">
                      {!selectedMessage.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(selectedMessage.id!)}
                        >
                          <CheckCheck className="h-4 w-4 mr-2" />
                          Mark as Read
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Message</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this message and all its replies? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => document.querySelector<HTMLButtonElement>('[data-dialog-close]')?.click()}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                deleteMessage(selectedMessage.id!);
                                document.querySelector<HTMLButtonElement>('[data-dialog-close]')?.click();
                              }}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Original message */}
                  <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                  
                  {/* Conversation thread (replies) */}
                  {conversations[selectedMessage.id!]?.length > 0 && (
                    <div className="mt-6 border-t pt-4">
                      <h4 className="text-sm font-medium mb-4">Conversation History</h4>
                      <div className="space-y-4">
                        {conversations[selectedMessage.id!].map((reply, index) => (
                          <div 
                            key={index} 
                            className={`p-4 rounded-lg ${
                              reply.sender_email === 'brito.dev@outlook.com' 
                                ? 'bg-primary/10 ml-8' 
                                : 'bg-muted/50 mr-8'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">
                                {reply.sender_email === 'brito.dev@outlook.com' ? 'You' : selectedMessage.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {reply.sent_at && formatDistanceToNow(new Date(reply.sent_at), { addSuffix: true })}
                              </span>
                            </div>
                            <div className="whitespace-pre-wrap text-sm">
                              {reply.reply_text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Reply form */}
                  {replying ? (
                    <div className="mt-6">
                      <Label htmlFor="reply" className="mb-2 block">Your Reply</Label>
                      <Textarea
                        id="reply"
                        placeholder="Type your reply here..."
                        className="min-h-[150px]"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setReplying(false)}
                          disabled={sendingReply}
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={!replyText.trim() || sendingReply}
                          onClick={sendReply}
                        >
                          {sendingReply ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Reply
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      className="w-full mt-6"
                      onClick={() => handleReply(selectedMessage)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Select a message</p>
                  <p className="text-muted-foreground text-sm text-center">
                    Choose a message from the inbox to view its contents and reply.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 