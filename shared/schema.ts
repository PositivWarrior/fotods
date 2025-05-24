import {
	pgTable,
	text,
	serial,
	integer,
	boolean,
	timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table for authentication
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	username: text('username').notNull().unique(),
	password: text('password').notNull(),
	isAdmin: boolean('is_admin').default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
	username: true,
	password: true,
});

// Categories for photo organization
export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique(),
	parentCategory: text('parent_category'),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
	name: true,
	slug: true,
	parentCategory: true,
});

// Photos table for portfolio items
export const photos = pgTable('photos', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	imageUrl: text('image_url').notNull(),
	thumbnailUrl: text('thumbnail_url').notNull(),
	categoryId: integer('category_id').references(() => categories.id, {
		onDelete: 'cascade',
	}),
	featured: boolean('featured').default(false).notNull(),
	location: text('location'),
	displayOrder: integer('display_order').default(0).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
	id: true,
	createdAt: true,
});

// Contact message storage
export const contactMessages = pgTable('contact_messages', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	phone: text('phone'),
	service: text('service'),
	message: text('message').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	read: boolean('read').default(false).notNull(),
});

export const insertContactSchema = createInsertSchema(contactMessages).omit({
	id: true,
	createdAt: true,
	read: true,
});

// Testimonials
export const testimonials = pgTable('testimonials', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	role: text('role'),
	content: text('content').notNull(),
	rating: integer('rating').notNull(),
	isActive: boolean('is_active').default(true).notNull(),
});

// Define the full insert schema first
const fullInsertTestimonialSchema = createInsertSchema(testimonials);

// Then pick fields and modify as needed
export const insertTestimonialSchema = fullInsertTestimonialSchema
	.pick({
		name: true,
		role: true,
		content: true,
		rating: true,
		isActive: true,
	})
	.extend({
		role: fullInsertTestimonialSchema.shape.role.optional().nullable(),
	});

// Types for easier use in the app
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
