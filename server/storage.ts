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
      { name: "Living Rooms", slug: "living-rooms" },
      { name: "Kitchens", slug: "kitchens" },
      { name: "Bathrooms", slug: "bathrooms" },
      { name: "Architecture", slug: "architecture" }
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
      {
        title: "Modern Scandinavian Living Room",
        description: "A bright, minimalist living room with natural light and clean lines",
        imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 1, // Living Rooms
        location: "Oslo, Norway",
        featured: true
      },
      {
        title: "Coastal Living Space",
        description: "Open concept living area with ocean views and natural materials",
        imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 1, // Living Rooms
        location: "Stockholm, Sweden",
        featured: false
      },
      {
        title: "Luxury Kitchen Design",
        description: "High-end kitchen with marble countertops and premium appliances",
        imageUrl: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 2, // Kitchens
        location: "Copenhagen, Denmark",
        featured: true
      },
      {
        title: "Minimalist Kitchen",
        description: "Clean lines and efficient design in this modern kitchen space",
        imageUrl: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 2, // Kitchens
        location: "Helsinki, Finland",
        featured: false
      },
      {
        title: "Spa-Inspired Bathroom",
        description: "Luxurious bathroom with freestanding tub and natural stone",
        imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 3, // Bathrooms
        location: "Oslo, Norway",
        featured: true
      },
      {
        title: "Contemporary Bathroom Design",
        description: "Modern fixtures and clean lines in this stylish bathroom",
        imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 3, // Bathrooms
        location: "Bergen, Norway",
        featured: false
      },
      {
        title: "Modern Apartment Building",
        description: "Contemporary multi-unit residential building with unique facade",
        imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 4, // Architecture
        location: "Stockholm, Sweden",
        featured: true
      },
      {
        title: "Residential House Design",
        description: "Contemporary single-family home featuring glass and wood elements",
        imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
        categoryId: 4, // Architecture
        location: "Copenhagen, Denmark",
        featured: false
      }
    ];
    
    // Add sample photos to storage
    samplePhotos.forEach(photo => {
      const now = new Date();
      this.createPhoto({
        ...photo,
        createdAt: now
      });
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
    const category: Category = { ...insertCategory, id };
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
    const photo: Photo = { ...insertPhoto, id, createdAt };
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
    const message: ContactMessage = { ...insertMessage, id, createdAt, read };
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
    const testimonial: Testimonial = { ...insertTestimonial, id };
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
