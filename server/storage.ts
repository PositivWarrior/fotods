import { 
  User, InsertUser, Category, InsertCategory, 
  Photo, InsertPhoto, ContactMessage, InsertContact,
  Testimonial, InsertTestimonial
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Photo operations
  getPhotos(): Promise<Photo[]>;
  getPhotosByCategory(categoryId: number): Promise<Photo[]>;
  getPhotosByCategorySlug(slug: string): Promise<Photo[]>;
  getFeaturedPhotos(): Promise<Photo[]>;
  getPhoto(id: number): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(id: number, photo: Partial<InsertPhoto>): Promise<Photo | undefined>;
  deletePhoto(id: number): Promise<boolean>;
  updatePhotoOrder(photoOrders: {id: number, displayOrder: number}[]): Promise<boolean>;
  
  // Contact operations
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContact): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<boolean>;
  
  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  getActiveTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
  
  // Session store for authentication
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private photos: Map<number, Photo>;
  private contactMessages: Map<number, ContactMessage>;
  private testimonials: Map<number, Testimonial>;
  
  sessionStore: session.SessionStore;
  
  private userId: number;
  private categoryId: number;
  private photoId: number;
  private contactMessageId: number;
  private testimonialId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.photos = new Map();
    this.contactMessages = new Map();
    this.testimonials = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.photoId = 1;
    this.contactMessageId = 1;
    this.testimonialId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Initialize with default data
    this.initializeData();
  }

  private initializeData() {
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "admin_password_hash.salt", // This will be properly hashed in auth.ts
    }).then(user => {
      // Update the user to be admin
      this.users.set(user.id, { ...user, isAdmin: true });
    });
    
    // Create default categories
    const categories = [
      { name: "Lifestyle", slug: "lifestyle" },
      { name: "Portraits", slug: "portraits", parentCategory: "lifestyle" },
      { name: "Weddings", slug: "weddings", parentCategory: "lifestyle" },
      { name: "Housing", slug: "housing" },
      { name: "Nighttime", slug: "nighttime", parentCategory: "housing" },
      { name: "Drone", slug: "drone", parentCategory: "housing" },
      { name: "Business", slug: "business" }
    ];
    
    categories.forEach(cat => this.createCategory(cat));
    
    // Create default testimonials
    const testimonials = [
      {
        name: "Anna Johansen",
        role: "Real Estate Agency Owner",
        content: "Dawid's photography breathed life into our property listings. His attention to detail and ability to capture spaces at their best has significantly improved our engagement and sales.",
        rating: 5,
        isActive: true
      },
      {
        name: "Marcus Larsen",
        role: "Interior Designer",
        content: "Working with FotoDS has been a game-changer for our design firm. Dawid understands how to showcase our designs in the most flattering and authentic way possible.",
        rating: 5,
        isActive: true
      },
      {
        name: "Sofia Eriksen",
        role: "Architect",
        content: "The photographs Dawid created of our new development project exceeded our expectations. His images perfectly captured the architectural vision we were trying to convey.",
        rating: 5,
        isActive: true
      }
    ];
    
    testimonials.forEach(testimonial => this.createTestimonial(testimonial));
    
    // Create sample photos for each category
    const samplePhotos = [
      // Lifestyle - Portraits
      {
        title: "Professional Headshot",
        description: "Professional studio portrait with natural lighting",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 2, // Portraits
        location: "Oslo, Norway",
        featured: true
      },
      {
        title: "Environmental Portrait",
        description: "Natural portrait in urban setting",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 2, // Portraits
        location: "Stockholm, Sweden",
        featured: false
      },
      
      // Lifestyle - Weddings
      {
        title: "Wedding Ceremony",
        description: "Intimate wedding ceremony at sunset",
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 3, // Weddings
        location: "Copenhagen, Denmark",
        featured: true
      },
      {
        title: "Bridal Portrait",
        description: "Elegant bridal portrait with natural light",
        imageUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 3, // Weddings
        location: "Helsinki, Finland",
        featured: false
      },
      
      // Housing - Nighttime
      {
        title: "Modern Home at Night",
        description: "Contemporary residence with dramatic night lighting",
        imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 5, // Nighttime
        location: "Oslo, Norway",
        featured: true
      },
      {
        title: "City Apartment Evening View",
        description: "Urban apartment with city lights backdrop",
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 5, // Nighttime
        location: "Bergen, Norway",
        featured: false
      },
      
      // Housing - Drone
      {
        title: "Aerial Estate View",
        description: "Drone photograph of luxury estate and surroundings",
        imageUrl: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 6, // Drone
        location: "Stockholm, Sweden",
        featured: true
      },
      {
        title: "Coastal Property Aerial",
        description: "Seaside residence captured from above",
        imageUrl: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 6, // Drone
        location: "Copenhagen, Denmark",
        featured: false
      },
      
      // Business
      {
        title: "Corporate Headquarters",
        description: "Modern office building exterior for corporate client",
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 7, // Business
        location: "Oslo, Norway",
        featured: true
      },
      {
        title: "Executive Office Interior",
        description: "Professional office space with elegant design",
        imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 7, // Business
        location: "Stockholm, Sweden",
        featured: false
      },
      {
        title: "Corporate Meeting Room",
        description: "Modern conference room with natural lighting",
        imageUrl: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 7, // Business
        location: "Copenhagen, Denmark",
        featured: false
      },
      {
        title: "Business Lobby",
        description: "Elegant company reception area with modern design",
        imageUrl: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 7, // Business
        location: "Bergen, Norway",
        featured: false
      }
    ];
    
    // Add sample photos to storage
    samplePhotos.forEach(photo => {
      // Remove createdAt from the sample data as it's automatically added by createPhoto
      const { createdAt, ...photoData } = photo as any;
      this.createPhoto(photoData);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      parentCategory: insertCategory.parentCategory || null 
    };
    this.categories.set(id, category);
    return category;
  }
  
  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) return undefined;
    
    const updatedCategory = { ...existingCategory, ...categoryUpdate };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Photo operations
  async getPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values());
  }
  
  async getPhotosByCategory(categoryId: number): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(
      (photo) => photo.categoryId === categoryId,
    );
  }
  
  async getPhotosByCategorySlug(slug: string): Promise<Photo[]> {
    const category = await this.getCategoryBySlug(slug);
    if (!category) return [];
    
    return Array.from(this.photos.values()).filter(
      (photo) => photo.categoryId === category.id,
    );
  }
  
  async getFeaturedPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(
      (photo) => photo.featured,
    );
  }
  
  async getPhoto(id: number): Promise<Photo | undefined> {
    return this.photos.get(id);
  }
  
  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = this.photoId++;
    const createdAt = new Date();
    
    // Get the highest current display order to place new photo at the end
    const photos = Array.from(this.photos.values());
    const maxOrder = photos.length > 0 
      ? Math.max(...photos.map(p => p.displayOrder || 0)) 
      : 0;
    
    const photo: Photo = { 
      ...insertPhoto, 
      id, 
      createdAt,
      displayOrder: insertPhoto.displayOrder ?? maxOrder + 1,
      description: insertPhoto.description || null,
      categoryId: insertPhoto.categoryId || null,
      location: insertPhoto.location || null,
      featured: insertPhoto.featured || false
    };
    this.photos.set(id, photo);
    return photo;
  }
  
  async updatePhoto(id: number, photoUpdate: Partial<InsertPhoto>): Promise<Photo | undefined> {
    const existingPhoto = this.photos.get(id);
    if (!existingPhoto) return undefined;
    
    const updatedPhoto = { ...existingPhoto, ...photoUpdate };
    this.photos.set(id, updatedPhoto);
    return updatedPhoto;
  }
  
  async deletePhoto(id: number): Promise<boolean> {
    return this.photos.delete(id);
  }
  
  async updatePhotoOrder(photoOrders: { id: number, displayOrder: number }[]): Promise<boolean> {
    try {
      // Update the display order for each photo
      for (const { id, displayOrder } of photoOrders) {
        const photo = await this.getPhoto(id);
        if (photo) {
          await this.updatePhoto(id, { displayOrder });
        }
      }
      return true;
    } catch (error) {
      console.error("Error updating photo order:", error);
      return false;
    }
  }
  
  // Contact operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }
  
  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }
  
  async createContactMessage(insertMessage: InsertContact): Promise<ContactMessage> {
    const id = this.contactMessageId++;
    const createdAt = new Date();
    const read = false;
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      createdAt, 
      read,
      phone: insertMessage.phone || null,
      service: insertMessage.service || null
    };
    this.contactMessages.set(id, message);
    return message;
  }
  
  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const existingMessage = this.contactMessages.get(id);
    if (!existingMessage) return undefined;
    
    const updatedMessage = { ...existingMessage, read: true };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  async deleteContactMessage(id: number): Promise<boolean> {
    return this.contactMessages.delete(id);
  }
  
  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async getActiveTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(
      (testimonial) => testimonial.isActive,
    );
  }
  
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialId++;
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id,
      isActive: insertTestimonial.isActive !== undefined ? insertTestimonial.isActive : true 
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  async updateTestimonial(id: number, testimonialUpdate: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const existingTestimonial = this.testimonials.get(id);
    if (!existingTestimonial) return undefined;
    
    const updatedTestimonial = { ...existingTestimonial, ...testimonialUpdate };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }
}

export const storage = new MemStorage();
