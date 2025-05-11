import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ContactMessage } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Trash2, Mail, MailOpen, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminMessages() {
  const { toast } = useToast();
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch contact messages
  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact"],
  });
  
  // Mark as read mutation
  const { mutate: markAsRead } = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/contact/${id}/read`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to mark message as read: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete message mutation
  const { mutate: deleteMessage, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contact/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      toast({
        title: "Message deleted",
        description: "The message has been removed",
      });
      setMessageToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete message: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Filter messages by search term
  const filteredMessages = messages?.filter(message => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      message.name.toLowerCase().includes(searchLower) ||
      message.email.toLowerCase().includes(searchLower) ||
      message.message.toLowerCase().includes(searchLower) ||
      (message.service && message.service.toLowerCase().includes(searchLower))
    );
  });
  
  // Format date for display
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // View message details
  const viewMessage = (message: ContactMessage) => {
    setViewingMessage(message);
    
    // Mark as read if not already read
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  return (
    <AdminLayout title="Contact Messages">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium">Messages</h2>
          <p className="text-muted-foreground">
            Manage inquiries from your contact form.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-9 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Messages Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-4 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : filteredMessages && filteredMessages.length > 0 ? (
                filteredMessages.map(message => (
                  <TableRow 
                    key={message.id} 
                    className={message.read ? "" : "bg-blue-50 hover:bg-blue-100"}
                  >
                    <TableCell>
                      {message.read ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-blue-600" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>
                      {message.service ? (
                        <Badge variant="outline" className="capitalize">
                          {message.service.replace(/-/g, ' ')}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{formatDate(message.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewMessage(message)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setMessageToDelete(message)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    {searchTerm ? "No messages match your search." : "No messages received yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Message Detail Dialog */}
      <Dialog open={viewingMessage !== null} onOpenChange={(open) => !open && setViewingMessage(null)}>
        <DialogContent className="max-w-md">
          {viewingMessage && (
            <>
              <DialogHeader>
                <DialogTitle>Message from {viewingMessage.name}</DialogTitle>
                <DialogDescription>
                  Received on {formatDate(viewingMessage.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-2">
                <div>
                  <h4 className="text-sm font-medium">Contact Information:</h4>
                  <p className="text-sm">{viewingMessage.email}</p>
                  {viewingMessage.phone && (
                    <p className="text-sm">{viewingMessage.phone}</p>
                  )}
                </div>
                
                {viewingMessage.service && (
                  <div>
                    <h4 className="text-sm font-medium">Service Requested:</h4>
                    <Badge variant="outline" className="mt-1 capitalize">
                      {viewingMessage.service.replace(/-/g, ' ')}
                    </Badge>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium">Message:</h4>
                  <div className="mt-1 bg-muted p-3 rounded-md text-sm">
                    {viewingMessage.message}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setViewingMessage(null)}
                >
                  Close
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    setMessageToDelete(viewingMessage);
                    setViewingMessage(null);
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={messageToDelete !== null} onOpenChange={() => setMessageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message from {messageToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (messageToDelete) {
                  deleteMessage(messageToDelete.id);
                }
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
