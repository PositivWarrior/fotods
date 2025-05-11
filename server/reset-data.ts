import { storage } from "./storage";

// This function will add more photos directly to the Business category
export async function addMissingPhotos() {
  console.log("Adding missing Business category photos...");
  
  // Add Business photos (categoryId: 7)
  const businessPhotos = [
    {
      title: "Corporate Meeting Room",
      description: "Modern conference room with natural lighting",
      imageUrl: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
      categoryId: 7,
      location: "Copenhagen, Denmark",
      featured: false
    },
    {
      title: "Business Lobby",
      description: "Elegant company reception area with modern design",
      imageUrl: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
      categoryId: 7,
      location: "Bergen, Norway",
      featured: false
    },
    {
      title: "Office Workspace",
      description: "Contemporary open workspace environment",
      imageUrl: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
      categoryId: 7,
      location: "Oslo, Norway",
      featured: false
    }
  ];
  
  for (const photo of businessPhotos) {
    await storage.createPhoto(photo);
  }
  
  console.log("Successfully added Business category photos!");
}

// Run the function on import
addMissingPhotos().catch(error => {
  console.error("Error adding photos:", error);
});