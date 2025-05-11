import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Testimonial, insertTestimonialSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Pencil, Trash2, Plus, Star, ToggleLeft, ToggleRight } from "lucide-react";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Extend the testimonial schema with validation
const testimonialFormSchema = insertTestimonialSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  content: z.string().min(20, "Testimonial must be at least 20 characters"),
  rating: z.coerce.number().int().min(1).max(5),
  isActive: z.boolean(),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

export default function AdminTestimonials() {
  const { toast } = useToast();
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  
  // Form setup
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      role: "",
      content: "",
      rating: 5,
      isActive: true,
    },
  });
  
  // Fetch testimonials
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
  });
  
  // Create testimonial mutation
  const { mutate: createTestimonial, isPending: isCreating } = useMutation({
    mutationFn: async (data: TestimonialFormValues) => {
      const res = await apiRequest("POST", "/api/testimonials", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Testimonial created",
        description: "New testimonial has been added successfully",
      });
      setShowAddTestimonial(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create testimonial: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Update testimonial mutation
  const { mutate: updateTestimonial, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TestimonialFormValues }) => {
      const res = await apiRequest("PUT", `/api/testimonials/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Testimonial updated",
        description: "The testimonial has been updated successfully",
      });
      setEditingTestimonial(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update testimonial: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete testimonial mutation
  const { mutate: deleteTestimonial, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Testimonial deleted",
        description: "The testimonial has been removed",
      });
      setTestimonialToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete testimonial: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Toggle active status mutation
  const { mutate: toggleActive } = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await apiRequest("PUT", `/api/testimonials/${id}`, { isActive });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Testimonial updated",
        description: "The visibility has been updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update testimonial: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  function onSubmit(data: TestimonialFormValues) {
    if (editingTestimonial) {
      updateTestimonial({ id: editingTestimonial.id, data });
    } else {
      createTestimonial(data);
    }
  }
  
  // Set up edit form
  const startEditing = (testimonial: Testimonial) => {
    form.reset({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      isActive: testimonial.isActive,
    });
    setEditingTestimonial(testimonial);
  };

  return (
    <AdminLayout title="Manage Testimonials">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium">Testimonials</h2>
          <p className="text-muted-foreground">
            Manage client testimonials displayed on your website.
          </p>
        </div>
        <Button onClick={() => {
          form.reset({
            name: "",
            role: "",
            content: "",
            rating: 5,
            isActive: true,
          });
          setShowAddTestimonial(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </div>
      
      {/* Testimonials Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : testimonials && testimonials.length > 0 ? (
                testimonials.map(testimonial => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">{testimonial.name}</TableCell>
                    <TableCell>{testimonial.role}</TableCell>
                    <TableCell>
                      <div className="flex text-yellow-500">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleActive({ 
                            id: testimonial.id, 
                            isActive: !testimonial.isActive 
                          })}
                          className="flex items-center space-x-1 text-sm"
                        >
                          {testimonial.isActive ? (
                            <>
                              <ToggleRight className="h-4 w-4 text-green-500" />
                              <span className="text-green-700">Visible</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Hidden</span>
                            </>
                          )}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => startEditing(testimonial)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setTestimonialToDelete(testimonial)}
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
                  <TableCell colSpan={5} className="text-center py-6">
                    No testimonials found. Add client testimonials to display on your website.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add/Edit Testimonial Dialog */}
      <Dialog 
        open={showAddTestimonial || editingTestimonial !== null} 
        onOpenChange={(open) => {
          if (!open) {
            setShowAddTestimonial(false);
            setEditingTestimonial(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
            <DialogDescription>
              {editingTestimonial
                ? "Update the testimonial details below."
                : "Add a new client testimonial to display on your website."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Anna Johansen" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Role/Company</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Real Estate Agency Owner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testimonial Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What the client said about your services..." 
                        {...field} 
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (1-5 stars)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating} {rating === 1 ? 'Star' : 'Stars'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Visible on website</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        When active, this testimonial will be displayed on the website.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddTestimonial(false);
                    setEditingTestimonial(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating 
                    ? "Saving..." 
                    : editingTestimonial 
                    ? "Update Testimonial" 
                    : "Add Testimonial"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={testimonialToDelete !== null} onOpenChange={() => setTestimonialToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the testimonial from {testimonialToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (testimonialToDelete) {
                  deleteTestimonial(testimonialToDelete.id);
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
