import { AdminLayout } from "@/components/admin/admin-layout";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Photo, Category } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Pencil, Trash2, Star, MoreHorizontal } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function AdminPhotos() {
  const { toast } = useToast();
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  
  // Fetch photos
  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });
  
  // Fetch categories for display
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Delete photo mutation
  const { mutate: deletePhoto, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/photos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/photos/featured"] });
      toast({
        title: "Photo deleted",
        description: "The photo has been removed from your portfolio",
      });
      setPhotoToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete photo: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Toggle featured status mutation
  const { mutate: toggleFeatured } = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      await apiRequest("PUT", `/api/photos/${id}`, { featured });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/photos/featured"] });
      toast({
        title: "Photo updated",
        description: "Featured status has been updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update photo: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Get category name by ID
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId || !categories) return "Uncategorized";
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  return (
    <AdminLayout title="Manage Photos">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium">Photo Gallery</h2>
          <p className="text-muted-foreground">
            Add, edit, and delete photos in your portfolio.
          </p>
        </div>
        <Button onClick={() => setShowAddPhoto(true)}>
          Add New Photo
        </Button>
      </div>
      
      {/* Photos Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[100px]">Featured</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-12 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : photos && photos.length > 0 ? (
                photos.map(photo => (
                  <TableRow key={photo.id}>
                    <TableCell>
                      <div className="h-12 w-20 bg-muted rounded overflow-hidden">
                        <img 
                          src={photo.thumbnailUrl} 
                          alt={photo.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{photo.title}</TableCell>
                    <TableCell>{getCategoryName(photo.categoryId)}</TableCell>
                    <TableCell>{photo.location || "—"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={photo.featured ? "text-yellow-500" : "text-muted-foreground"}
                        onClick={() => toggleFeatured({ id: photo.id, featured: !photo.featured })}
                      >
                        <Star className={`h-5 w-5 ${photo.featured ? "fill-yellow-500" : ""}`} />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => {/* Edit photo functionality */}}
                          >
                            <Pencil className="mr-2 h-4 w-4" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => setPhotoToDelete(photo)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No photos found. Add some photos to your portfolio.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Photo Dialog */}
      <Dialog open={showAddPhoto} onOpenChange={setShowAddPhoto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Photo</DialogTitle>
            <DialogDescription>
              Upload a new photo to your portfolio. Fill in all the details below.
            </DialogDescription>
          </DialogHeader>
          
          <ImageUpload />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPhoto(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={photoToDelete !== null} onOpenChange={() => setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{photoToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (photoToDelete) {
                  deletePhoto(photoToDelete.id);
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
