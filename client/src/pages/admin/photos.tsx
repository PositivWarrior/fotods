import { AdminLayout } from "@/components/admin/admin-layout";
import { ImageUpload } from "@/components/admin/image-upload";
import { EditPhotoModal } from "@/components/admin/edit-photo-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Photo, Category } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Star, MoreHorizontal, GripVertical, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult,
  DroppableProvided,
  DraggableProvided 
} from "react-beautiful-dnd";

export default function AdminPhotos() {
  const { toast } = useToast();
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  const [photoToEdit, setPhotoToEdit] = useState<Photo | null>(null);
  const [orderedPhotos, setOrderedPhotos] = useState<Photo[]>([]);
  const [hasReordered, setHasReordered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Fetch photos
  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });
  
  // Initialize ordered photos when photos are loaded or category is changed
  useEffect(() => {
    if (photos) {
      // Filter by selected category if needed
      const filteredPhotos = selectedCategory === "all" 
        ? photos 
        : photos.filter(photo => {
            // Convert to string for comparison with selectedCategory which is a string
            return photo.categoryId?.toString() === selectedCategory;
          });
      
      // Sort by displayOrder if available, or fallback to id
      const sorted = [...filteredPhotos].sort((a, b) => {
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return a.displayOrder - b.displayOrder;
        }
        return a.id - b.id;
      });
      
      setOrderedPhotos(sorted);
      
      // Reset reordering state when category changes
      setHasReordered(false);
    }
  }, [photos, selectedCategory]);
  
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
  
  // Save photo order mutation
  const { mutate: savePhotoOrder, isPending: isSavingOrder } = useMutation({
    mutationFn: async (photos: Photo[]) => {
      const photoOrders = photos.map((photo, index) => ({
        id: photo.id,
        displayOrder: index
      }));
      
      // If a category is selected, include it in the request
      const payload = {
        photoOrders,
        categoryId: selectedCategory !== "all" ? parseInt(selectedCategory) : undefined 
      };
      
      await apiRequest("POST", `/api/photos/reorder`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      setHasReordered(false);
      toast({
        title: "Order updated",
        description: selectedCategory === "all" 
          ? "Photo display order has been saved" 
          : `Photo order in ${getCategoryName(parseInt(selectedCategory))} has been saved`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update photo order: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(orderedPhotos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setOrderedPhotos(items);
    setHasReordered(true);
  };
  
  // Get category name by ID
  const getCategoryName = (categoryId: number | null | undefined) => {
    if (categoryId === null || categoryId === undefined || !categories) return "Uncategorized";
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  return (
    <AdminLayout title="Manage Photos">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium">Photo Gallery</h2>
          <p className="text-muted-foreground">
            Add, edit, and delete photos in your portfolio. Drag photos to reorder them within a category.
          </p>
        </div>
        <div className="flex gap-2">
          {hasReordered && (
            <Button 
              onClick={() => savePhotoOrder(orderedPhotos)}
              disabled={isSavingOrder}
              className="gap-1"
            >
              {isSavingOrder ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Order
                </>
              )}
            </Button>
          )}
          <Button onClick={() => setShowAddPhoto(true)}>
            Add New Photo
          </Button>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Label htmlFor="category-filter" className="text-sm font-medium">
            Filter by Category:
          </Label>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Photos Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  
                  <TableHead className="w-[100px]">Featured</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                    <TableCell><Skeleton className="h-12 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : orderedPhotos.length > 0 ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="w-[100px]">Featured</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <Droppable droppableId="photos">
                  {(provided: DroppableProvided) => (
                    <TableBody 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {orderedPhotos.map((photo, index) => (
                        <Draggable 
                          key={photo.id.toString()} 
                          draggableId={photo.id.toString()} 
                          index={index}
                        >
                          {(dragProvided: DraggableProvided) => (
                            <TableRow 
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              className={hasReordered ? "bg-muted/30" : ""}
                            >
                              <TableCell {...dragProvided.dragHandleProps} className="cursor-grab">
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </TableCell>
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
                                      onClick={() => setPhotoToEdit(photo)}
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
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </Table>
            </DragDropContext>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  
                  <TableHead className="w-[100px]">Featured</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No photos found. Add some photos to your portfolio.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
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

      {/* Edit Photo Modal */}
      <EditPhotoModal 
        photo={photoToEdit}
        isOpen={photoToEdit !== null}
        onClose={() => setPhotoToEdit(null)}
      />
    </AdminLayout>
  );
}
