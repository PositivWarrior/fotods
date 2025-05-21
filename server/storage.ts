import {
	User,
	InsertUser,
	Category,
	InsertCategory,
	Photo,
	InsertPhoto,
	ContactMessage,
	InsertContact,
	Testimonial,
	InsertTestimonial,
} from '../shared/schema';
import createMemoryStore from 'memorystore';
import session from 'express-session';
import { DrizzleStorage } from './drizzleStorage';

const MemoryStore = createMemoryStore(session);

export interface IStorage {
	// User operations
	getUser(id: number): Promise<User | undefined>;
	getUserByUsername(username: string): Promise<User | undefined>;
	createUser(user: InsertUser): Promise<User>;
	updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

	// Category operations
	getCategories(): Promise<Category[]>;
	getCategory(id: number): Promise<Category | undefined>;
	getCategoryBySlug(slug: string): Promise<Category | undefined>;
	createCategory(category: InsertCategory): Promise<Category>;
	updateCategory(
		id: number,
		category: Partial<InsertCategory>,
	): Promise<Category | undefined>;
	deleteCategory(id: number): Promise<boolean>;

	// Photo operations
	getPhotos(): Promise<Photo[]>;
	getPhotosByCategory(categoryId: number): Promise<Photo[]>;
	getPhotosByCategorySlug(slug: string): Promise<Photo[]>;
	getFeaturedPhotos(): Promise<Photo[]>;
	getPhoto(id: number): Promise<Photo | undefined>;
	createPhoto(photo: InsertPhoto): Promise<Photo>;
	updatePhoto(
		id: number,
		photo: Partial<InsertPhoto>,
	): Promise<Photo | undefined>;
	deletePhoto(id: number): Promise<boolean>;
	updatePhotoOrder(
		photoOrders: { id: number; displayOrder: number }[],
	): Promise<boolean>;
	updatePhotoCategoryOrder(
		photoOrders: { id: number; displayOrder: number }[],
		categoryId: number,
	): Promise<boolean>;

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
	updateTestimonial(
		id: number,
		testimonial: Partial<InsertTestimonial>,
	): Promise<Testimonial | undefined>;
	deleteTestimonial(id: number): Promise<boolean>;

	// Session store for authentication
	sessionStore: InstanceType<typeof MemoryStore>;
}

export const storage = new DrizzleStorage();
