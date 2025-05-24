import { db } from './db';
import {
	users,
	categories,
	photos,
	contactMessages,
	testimonials,
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
import { IStorage } from './storage';
import { eq, and, or, asc, desc, like, not, inArray, sql } from 'drizzle-orm';
import createMemoryStore from 'memorystore';
import session from 'express-session';
import { supabase, getPathFromSupabaseUrl } from './supabaseClient';

const MemoryStore = createMemoryStore(session);

export class DrizzleStorage implements IStorage {
	sessionStore: InstanceType<typeof MemoryStore>;

	constructor() {
		// Session store remains in-memory for now.
		// Migrating session storage to PostgreSQL/Redis is a separate task.
		this.sessionStore = new MemoryStore({
			checkPeriod: 86400000, // 24 hours
		});
	}

	// User operations
	async getUser(id: number): Promise<User | undefined> {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.id, id))
			.limit(1);
		return result[0];
	}

	async getUserByUsername(username: string): Promise<User | undefined> {
		const lowerUsername = username.toLowerCase();
		const result = await db
			.select()
			.from(users)
			.where(eq(users.username, lowerUsername))
			.limit(1);
		return result[0];
	}

	async createUser(insertUser: InsertUser): Promise<User> {
		const lowerUsername = insertUser.username.toLowerCase();

		let calculatedIsAdmin =
			lowerUsername === 'adminkacpru@gmail.com' ||
			lowerUsername === 'admindawid@gmail.com';
		if (!calculatedIsAdmin) {
			const userCountResult = await db
				.select({ count: sql<number>`count(*)` })
				.from(users);
			if (userCountResult[0].count === 0) {
				calculatedIsAdmin = true;
			}
		}

		const result = await db
			.insert(users)
			.values({
				username: lowerUsername,
				password: insertUser.password, // Assuming password hashing is handled before calling this
				isAdmin: calculatedIsAdmin,
			})
			.returning();
		return result[0];
	}

	async updateUser(
		id: number,
		userUpdate: Partial<User>,
	): Promise<User | undefined> {
		if (userUpdate.username) {
			userUpdate.username = userUpdate.username.toLowerCase();
		}
		// Ensure that if password is part of userUpdate, it's already hashed.
		// The `isAdmin` field in `Partial<User>` refers to `users.is_admin` in the DB schema.
		const result = await db
			.update(users)
			.set(userUpdate)
			.where(eq(users.id, id))
			.returning();
		return result[0];
	}

	// Category operations
	async getCategories(): Promise<Category[]> {
		return db.select().from(categories).orderBy(asc(categories.name));
	}

	async getCategory(id: number): Promise<Category | undefined> {
		const result = await db
			.select()
			.from(categories)
			.where(eq(categories.id, id))
			.limit(1);
		return result[0];
	}

	async getCategoryBySlug(slug: string): Promise<Category | undefined> {
		const result = await db
			.select()
			.from(categories)
			.where(eq(categories.slug, slug))
			.limit(1);
		return result[0];
	}

	async createCategory(insertCategory: InsertCategory): Promise<Category> {
		const result = await db
			.insert(categories)
			.values(insertCategory)
			.returning();
		return result[0];
	}

	async updateCategory(
		id: number,
		categoryUpdate: Partial<InsertCategory>,
	): Promise<Category | undefined> {
		const result = await db
			.update(categories)
			.set(categoryUpdate)
			.where(eq(categories.id, id))
			.returning();
		return result[0];
	}

	async deleteCategory(id: number): Promise<boolean> {
		const photosInCategory = await db
			.select({ id: photos.id })
			.from(photos)
			.where(eq(photos.categoryId, id))
			.limit(1);
		if (photosInCategory.length > 0) {
			console.warn(
				`Attempted to delete category ${id} which still has photos. Deletion prevented or photos should be handled.`,
			);
			// Consider throwing an error or implementing cascading logic if photos should be deleted/uncategorized.
			// return false; // To prevent deletion
		}

		const result = await db
			.delete(categories)
			.where(eq(categories.id, id))
			.returning();
		return result.length > 0;
	}

	// Photo operations - TO BE IMPLEMENTED
	async getPhotos(): Promise<Photo[]> {
		console.warn('getPhotos not yet implemented in DrizzleStorage');
		return db.select().from(photos).orderBy(desc(photos.createdAt));
	}
	async getPhotosByCategory(categoryId: number): Promise<Photo[]> {
		console.warn(
			'getPhotosByCategory not yet implemented in DrizzleStorage',
		);
		return db
			.select()
			.from(photos)
			.where(eq(photos.categoryId, categoryId))
			.orderBy(asc(photos.displayOrder));
	}
	async getPhotosByCategorySlug(slug: string): Promise<Photo[]> {
		// 1. Find the main category by its slug
		const mainCategory = await this.getCategoryBySlug(slug);
		console.log(
			`[API /api/photos/category/${slug}] Main category found:`,
			mainCategory,
		);
		if (!mainCategory || typeof mainCategory.id !== 'number') return [];

		// 2. Find all direct subcategories of this main category
		const subCategories = await db
			.select()
			.from(categories)
			.where(eq(categories.parentCategory, mainCategory.slug)); // Match parentCategory with main category's slug
		console.log(
			`[API /api/photos/category/${slug}] Subcategories found:`,
			subCategories,
		);

		// 3. Collect all relevant category IDs
		const categoryIdsToFetch = [mainCategory.id];
		subCategories.forEach((subCat) => {
			if (typeof subCat.id === 'number') {
				// Ensure subCat.id is a number
				categoryIdsToFetch.push(subCat.id);
			}
		});
		console.log(
			`[API /api/photos/category/${slug}] Category IDs to fetch photos from:`,
			categoryIdsToFetch,
		);

		// 4. Fetch photos where categoryId is in the list of IDs
		if (categoryIdsToFetch.length === 0) return []; // Should not happen if mainCategory was found

		const resultPhotos = await db
			.select()
			.from(photos)
			.where(inArray(photos.categoryId, categoryIdsToFetch))
			.orderBy(asc(photos.displayOrder));
		console.log(
			`[API /api/photos/category/${slug}] Photos fetched:`,
			resultPhotos.map((p) => ({
				id: p.id,
				title: p.title,
				categoryId: p.categoryId,
			})),
		);
		return resultPhotos;
	}
	async getFeaturedPhotos(): Promise<Photo[]> {
		console.warn('getFeaturedPhotos not yet implemented in DrizzleStorage');
		return db
			.select()
			.from(photos)
			.where(eq(photos.featured, true))
			.orderBy(asc(photos.displayOrder));
	}
	async getPhoto(id: number): Promise<Photo | undefined> {
		console.warn('getPhoto not yet implemented in DrizzleStorage');
		const result = await db
			.select()
			.from(photos)
			.where(eq(photos.id, id))
			.limit(1);
		return result[0];
	}
	async createPhoto(photoData: InsertPhoto): Promise<Photo> {
		console.warn('createPhoto not yet implemented in DrizzleStorage');
		const photosInDb = await db
			.select({ count: sql<number>`count(*)` })
			.from(photos);
		const displayOrder = photoData.displayOrder ?? photosInDb[0].count + 1;

		const result = await db
			.insert(photos)
			.values({ ...photoData, displayOrder })
			.returning();
		return result[0];
	}
	async updatePhoto(
		id: number,
		photoUpdate: Partial<InsertPhoto>,
	): Promise<Photo | undefined> {
		console.warn('updatePhoto with Supabase storage considerations');

		// If imageUrl or thumbnailUrl is being updated, delete the old file(s) from Supabase
		if (photoUpdate.imageUrl || photoUpdate.thumbnailUrl) {
			const currentPhoto = await this.getPhoto(id);
			if (currentPhoto) {
				const filesToDelete: string[] = [];
				if (
					photoUpdate.imageUrl &&
					currentPhoto.imageUrl &&
					photoUpdate.imageUrl !== currentPhoto.imageUrl
				) {
					const oldPath = getPathFromSupabaseUrl(
						currentPhoto.imageUrl,
					);
					if (oldPath) filesToDelete.push(oldPath);
				}
				if (
					photoUpdate.thumbnailUrl &&
					currentPhoto.thumbnailUrl &&
					photoUpdate.thumbnailUrl !== currentPhoto.thumbnailUrl
				) {
					// Avoid double-deleting if thumbnail was same as main image and main image is also changing
					const oldThumbPath = getPathFromSupabaseUrl(
						currentPhoto.thumbnailUrl,
					);
					if (
						oldThumbPath &&
						(!photoUpdate.imageUrl ||
							oldThumbPath !==
								getPathFromSupabaseUrl(currentPhoto.imageUrl))
					) {
						filesToDelete.push(oldThumbPath);
					}
				}

				if (filesToDelete.length > 0) {
					// Use the bucket name you configured in routes.ts (e.g., "photos")
					const { error: deleteError } = await supabase.storage
						.from('photos') // Replace "photos" with your actual bucket name
						.remove(filesToDelete);
					if (deleteError) {
						console.error(
							'Error deleting old photo(s) from Supabase during update:',
							deleteError,
						);
						// Decide if this should block the update or just log
					}
				}
			}
		}

		const result = await db
			.update(photos)
			.set(photoUpdate)
			.where(eq(photos.id, id))
			.returning();
		return result[0];
	}
	async deletePhoto(id: number): Promise<boolean> {
		console.warn('deletePhoto with Supabase storage considerations');

		// First, get the photo details to find the image URLs
		const photoToDelete = await this.getPhoto(id);
		if (!photoToDelete) {
			console.log(`Photo with id ${id} not found for deletion.`);
			return false;
		}

		const filesToDelete: string[] = [];
		if (photoToDelete.imageUrl) {
			const imagePath = getPathFromSupabaseUrl(photoToDelete.imageUrl);
			if (imagePath) filesToDelete.push(imagePath);
		}
		if (
			photoToDelete.thumbnailUrl &&
			photoToDelete.thumbnailUrl !== photoToDelete.imageUrl
		) {
			// Only add thumbnail if it's different from the main image to avoid double delete attempts
			const thumbPath = getPathFromSupabaseUrl(
				photoToDelete.thumbnailUrl,
			);
			if (thumbPath) filesToDelete.push(thumbPath);
		}

		if (filesToDelete.length > 0) {
			// Use the bucket name you configured in routes.ts (e.g., "photos")
			const { error: deleteError } = await supabase.storage
				.from('photos') // Replace "photos" with your actual bucket name
				.remove(filesToDelete);
			if (deleteError) {
				console.error(
					'Error deleting photo(s) from Supabase:',
					deleteError,
				);
				// Decide if this should prevent DB deletion or just log. For now, we log and proceed.
			}
		}

		// Then, delete the photo record from the database
		const result = await db
			.delete(photos)
			.where(eq(photos.id, id))
			.returning();
		return result.length > 0;
	}
	async updatePhotoOrder(
		photoOrders: { id: number; displayOrder: number }[],
	): Promise<boolean> {
		console.warn('updatePhotoOrder not yet implemented in DrizzleStorage');
		try {
			for (const order of photoOrders) {
				await db
					.update(photos)
					.set({ displayOrder: order.displayOrder })
					.where(eq(photos.id, order.id));
			}
			return true;
		} catch (error) {
			console.error('Error updating photo order:', error);
			return false;
		}
	}
	async updatePhotoCategoryOrder(
		photoOrders: { id: number; displayOrder: number }[],
		categoryId: number,
	): Promise<boolean> {
		console.warn(
			'updatePhotoCategoryOrder not yet implemented in DrizzleStorage',
		);
		try {
			for (const order of photoOrders) {
				await db
					.update(photos)
					.set({ displayOrder: order.displayOrder })
					.where(
						and(
							eq(photos.id, order.id),
							eq(photos.categoryId, categoryId),
						),
					);
			}
			return true;
		} catch (error) {
			console.error(
				`Error updating photo order for category ${categoryId}:`,
				error,
			);
			return false;
		}
	}

	// Contact operations - TO BE IMPLEMENTED
	async getContactMessages(): Promise<ContactMessage[]> {
		console.warn(
			'getContactMessages not yet implemented in DrizzleStorage',
		);
		return db
			.select()
			.from(contactMessages)
			.orderBy(desc(contactMessages.createdAt));
	}
	async getContactMessage(id: number): Promise<ContactMessage | undefined> {
		console.warn('getContactMessage not yet implemented in DrizzleStorage');
		const result = await db
			.select()
			.from(contactMessages)
			.where(eq(contactMessages.id, id))
			.limit(1);
		return result[0];
	}
	async createContactMessage(
		message: InsertContact,
	): Promise<ContactMessage> {
		console.warn(
			'createContactMessage not yet implemented in DrizzleStorage',
		);
		const result = await db
			.insert(contactMessages)
			.values(message)
			.returning();
		return result[0];
	}
	async markContactMessageAsRead(
		id: number,
	): Promise<ContactMessage | undefined> {
		console.warn(
			'markContactMessageAsRead not yet implemented in DrizzleStorage',
		);
		const result = await db
			.update(contactMessages)
			.set({ read: true })
			.where(eq(contactMessages.id, id))
			.returning();
		return result[0];
	}
	async deleteContactMessage(id: number): Promise<boolean> {
		console.warn(
			'deleteContactMessage not yet implemented in DrizzleStorage',
		);
		const result = await db
			.delete(contactMessages)
			.where(eq(contactMessages.id, id))
			.returning();
		return result.length > 0;
	}

	// Testimonial operations - TO BE IMPLEMENTED
	async getTestimonials(): Promise<Testimonial[]> {
		console.warn('getTestimonials not yet implemented in DrizzleStorage');
		return db.select().from(testimonials).orderBy(asc(testimonials.name));
	}
	async getActiveTestimonials(): Promise<Testimonial[]> {
		console.warn(
			'getActiveTestimonials not yet implemented in DrizzleStorage',
		);
		return db
			.select()
			.from(testimonials)
			.where(eq(testimonials.isActive, true))
			.orderBy(asc(testimonials.name));
	}
	async getTestimonial(id: number): Promise<Testimonial | undefined> {
		console.warn('getTestimonial not yet implemented in DrizzleStorage');
		const result = await db
			.select()
			.from(testimonials)
			.where(eq(testimonials.id, id))
			.limit(1);
		return result[0];
	}
	async createTestimonial(
		testimonialData: InsertTestimonial,
	): Promise<Testimonial> {
		console.warn('createTestimonial not yet implemented in DrizzleStorage');
		const result = await db
			.insert(testimonials)
			.values(testimonialData)
			.returning();
		return result[0];
	}
	async updateTestimonial(
		id: number,
		testimonialUpdate: Partial<InsertTestimonial>,
	): Promise<Testimonial | undefined> {
		console.warn('updateTestimonial not yet implemented in DrizzleStorage');
		const result = await db
			.update(testimonials)
			.set(testimonialUpdate)
			.where(eq(testimonials.id, id))
			.returning();
		return result[0];
	}
	async deleteTestimonial(id: number): Promise<boolean> {
		console.warn('deleteTestimonial not yet implemented in DrizzleStorage');
		const result = await db
			.delete(testimonials)
			.where(eq(testimonials.id, id))
			.returning();
		return result.length > 0;
	}
}
