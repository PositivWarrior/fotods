import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Category, Photo } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Switch } from "@/components/ui/switch";

interface EditPhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditPhotoModal({ photo, isOpen, onClose }: EditPhotoModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(photo?.title || "");
  const [description, setDescription] = useState(photo?.description || "");
  const [categoryId, setCategoryId] = useState<string>(photo?.categoryId?.toString() || "");
  const [isFeatured, setIsFeatured] = useState(photo?.featured || false);

  // Reset form values when photo changes
  useEffect(() => {
    if (photo) {
      setTitle(photo.title);
      setDescription(photo.description || "");
      setCategoryId(photo.categoryId?.toString() || "");
      setIsFeatured(photo.featured || false);
    }
  }, [photo]);

  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Update photo mutation
  const updatePhotoMutation = useMutation({
    mutationFn: async (updatedPhoto: Partial<Photo>) => {
      const res = await apiRequest("PATCH", `/api/photos/${photo?.id}`, updatedPhoto);
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate photo queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/photos/featured"] });
      if (categoryId) {
        queryClient.invalidateQueries({ 
          queryKey: [`/api/photos/category/${categories?.find(cat => cat.id.toString() === categoryId)?.slug}`] 
        });
      }
      
      toast({
        title: "Success",
        description: "Photo updated successfully!",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update photo: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) return;
    
    updatePhotoMutation.mutate({
      title,
      description,
      categoryId: categoryId ? parseInt(categoryId) : null,
      featured: isFeatured
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Photo</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={categoryId}
                onValueChange={setCategoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="featured" 
                checked={isFeatured} 
                onCheckedChange={setIsFeatured}
              />
              <Label htmlFor="featured">Featured on Homepage <span className="text-yellow-500">(marked with <Star className="h-4 w-4 inline fill-yellow-500" />)</span></Label>
            </div>
            
            {photo?.imageUrl && (
              <div className="mt-2">
                <Label>Preview</Label>
                <div className="mt-1 relative h-40 overflow-hidden rounded-md">
                  <img 
                    src={photo.imageUrl} 
                    alt={title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={updatePhotoMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={updatePhotoMutation.isPending}
            >
              {updatePhotoMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}