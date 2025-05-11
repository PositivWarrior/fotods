import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Category, InsertPhoto } from "@shared/schema";
import { Loader2 } from "lucide-react";

export function ImageUpload() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [location, setLocation] = useState("");
  const [featured, setFeatured] = useState(false);

  // Fetch categories for the dropdown
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Create a new photo
  const { mutate: createPhoto, isPending } = useMutation({
    mutationFn: async (photoData: InsertPhoto) => {
      const res = await apiRequest("POST", "/api/photos", photoData);
      return res.json();
    },
    onSuccess: () => {
      // Reset form and invalidate photos query
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/photos/featured"] });
      
      toast({
        title: "Success",
        description: "Photo has been added to the portfolio",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to upload photo: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setThumbnailUrl("");
    setCategoryId("");
    setLocation("");
    setFeatured(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !imageUrl || !thumbnailUrl || !categoryId) {
      return toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }

    // Converting categoryId to number
    createPhoto({
      title,
      description,
      imageUrl,
      thumbnailUrl,
      categoryId: parseInt(categoryId),
      location,
      featured,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Photo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Photo Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Modern Living Room - Oslo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Oslo, Norway"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of the photo..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Full Size Image URL *</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/full-image.jpg"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail Image URL *</Label>
              <Input
                id="thumbnailUrl"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://example.com/thumbnail.jpg"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesLoading ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : (
                  categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={featured}
              onCheckedChange={(checked) => setFeatured(checked as boolean)}
            />
            <Label htmlFor="featured" className="cursor-pointer">Featured photo (shown on homepage)</Label>
          </div>
          
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Uploading...
              </>
            ) : (
              "Add Photo"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
