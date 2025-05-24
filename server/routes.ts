import type { Express, Request } from 'express';
import { createServer, type Server } from 'http';
import { storage as dataStorage } from './storage';
import { setupAuth, isAdmin } from './auth';
import { supabase } from './supabaseClient'; // Import Supabase client
import {
	insertCategorySchema,
	insertPhotoSchema,
	insertContactSchema,
	insertTestimonialSchema,
} from '@shared/schema';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import { addMissingPhotos } from './reset-data';

export async function registerRoutes(app: Express): Promise<Server> {
	// Set up authentication
	setupAuth(app);

	// Configure multer for file uploads
	// Store uploaded files in memory for Supabase upload
	const fileStorage = multer.memoryStorage(); // Use memoryStorage

	// File upload size limits
	const upload = multer({
		storage: fileStorage,
		limits: {
			fileSize: 10 * 1024 * 1024, // 10MB max file size
		},
		fileFilter: (req, file, cb) => {
			// Accept only image files
			if (!file.mimetype.startsWith('image/')) {
				return cb(new Error('Only image files are allowed'));
			}
			cb(null, true);
		},
	});

	// API Routes
	// Categories
	app.get('/api/categories', async (req, res) => {
		try {
			const categories = await dataStorage.getCategories();
			res.json(categories);
		} catch (error) {
			res.status(500).json({ message: 'Failed to fetch categories' });
		}
	});

	app.get('/api/categories/:slug', async (req, res) => {
		try {
			const category = await dataStorage.getCategoryBySlug(
				req.params.slug,
			);
			if (!category) {
				return res.status(404).json({ message: 'Category not found' });
			}
			res.json(category);
		} catch (error) {
			res.status(500).json({ message: 'Failed to fetch category' });
		}
	});

	app.post('/api/categories', isAdmin, async (req, res) => {
		try {
			const validatedData = insertCategorySchema.parse(req.body);
			const category = await dataStorage.createCategory(validatedData);
			res.status(201).json(category);
		} catch (error) {
			if (error instanceof ZodError) {
				return res
					.status(400)
					.json({ message: fromZodError(error).message });
			}
			res.status(500).json({ message: 'Failed to create category' });
		}
	});

	app.put('/api/categories/:id', isAdmin, async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const validatedData = insertCategorySchema
				.partial()
				.parse(req.body);
			const category = await dataStorage.updateCategory(
				id,
				validatedData,
			);

			if (!category) {
				return res.status(404).json({ message: 'Category not found' });
			}

			res.json(category);
		} catch (error) {
			if (error instanceof ZodError) {
				return res
					.status(400)
					.json({ message: fromZodError(error).message });
			}
			res.status(500).json({ message: 'Failed to update category' });
		}
	});

	app.delete('/api/categories/:id', isAdmin, async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const success = await dataStorage.deleteCategory(id);

			if (!success) {
				return res.status(404).json({ message: 'Category not found' });
			}

			res.sendStatus(204);
		} catch (error) {
			res.status(500).json({ message: 'Failed to delete category' });
		}
	});

	// Photos
	app.get('/api/photos', async (req, res) => {
		try {
			const photos = await dataStorage.getPhotos();
			res.json(photos);
		} catch (error) {
			res.status(500).json({ message: 'Failed to fetch photos' });
		}
	});

	app.get('/api/photos/featured', async (req, res) => {
		try {
			const photos = await dataStorage.getFeaturedPhotos();
			res.json(photos);
		} catch (error) {
			res.status(500).json({
				message: 'Failed to fetch featured photos',
			});
		}
	});

	app.get('/api/photos/category/:slug', async (req, res) => {
		try {
			const photos = await dataStorage.getPhotosByCategorySlug(
				req.params.slug,
			);
			res.json(photos);
		} catch (error) {
			res.status(500).json({
				message: 'Failed to fetch photos by category',
			});
		}
	});

	app.get('/api/photos/:id', async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const photo = await dataStorage.getPhoto(id);

			if (!photo) {
				return res.status(404).json({ message: 'Photo not found' });
			}

			res.json(photo);
		} catch (error) {
			res.status(500).json({ message: 'Failed to fetch photo' });
		}
	});

	// File upload endpoint
	app.post(
		'/api/upload',
		isAdmin,
		upload.fields([
			{ name: 'mainImage', maxCount: 1 },
			{ name: 'thumbnailImage', maxCount: 1 },
		]),
		async (req, res) => {
			try {
				const files = req.files as {
					[fieldname: string]: Express.Multer.File[];
				};

				if (!files || !files.mainImage || !files.mainImage[0]) {
					return res
						.status(400)
						.json({ message: 'No main image uploaded' });
				}

				const mainImageFile = files.mainImage[0];
				const mainImageName = `${Date.now()}-${randomUUID()}-${
					mainImageFile.originalname
				}`;
				const { data: mainImageData, error: mainImageError } =
					await supabase.storage
						.from('photos') // Replace "photos" with your actual bucket name if different
						.upload(mainImageName, mainImageFile.buffer, {
							contentType: mainImageFile.mimetype,
							upsert: false, // true to overwrite, false to error if file exists
						});

				if (mainImageError) {
					console.error(
						'Supabase main image upload error:',
						mainImageError,
					);
					return res
						.status(500)
						.json({
							message: `Failed to upload main image: ${mainImageError.message}`,
						});
				}
				// Construct the public URL for the main image
				const { data: mainImagePublicUrlData } = supabase.storage
					.from('photos') // Replace "photos" with your actual bucket name
					.getPublicUrl(mainImageData.path);
				const mainImageUrl = mainImagePublicUrlData.publicUrl;

				let thumbnailUrl = mainImageUrl; // Default to main image URL

				if (files.thumbnailImage && files.thumbnailImage[0]) {
					const thumbnailFile = files.thumbnailImage[0];
					const thumbnailName = `${Date.now()}-${randomUUID()}-${
						thumbnailFile.originalname
					}`;
					const { data: thumbnailData, error: thumbnailError } =
						await supabase.storage
							.from('photos') // Replace "photos" with your actual bucket name
							.upload(thumbnailName, thumbnailFile.buffer, {
								contentType: thumbnailFile.mimetype,
								upsert: false,
							});

					if (thumbnailError) {
						console.error(
							'Supabase thumbnail upload error:',
							thumbnailError,
						);
						// Decide if this is a critical error. For now, we'll proceed with main image URL for thumbnail.
						// Optionally, clean up the already uploaded main image if thumbnail upload is critical.
					} else {
						const { data: thumbPublicUrlData } = supabase.storage
							.from('photos') // Replace "photos" with your actual bucket name
							.getPublicUrl(thumbnailData.path);
						thumbnailUrl = thumbPublicUrlData.publicUrl;
					}
				}

				res.status(200).json({
					imageUrl: mainImageUrl,
					thumbnailUrl: thumbnailUrl,
				});
			} catch (error) {
				console.error('Upload error:', error);
				res.status(500).json({
					message:
						error instanceof Error
							? error.message
							: 'Failed to upload files',
				});
			}
		},
	);

	// Create photo endpoint
	app.post('/api/photos', isAdmin, async (req, res) => {
		try {
			const validatedData = insertPhotoSchema.parse(req.body);
			const photo = await dataStorage.createPhoto(validatedData);
			res.status(201).json(photo);
		} catch (error) {
			if (error instanceof ZodError) {
				return res
					.status(400)
					.json({ message: fromZodError(error).message });
			}
			res.status(500).json({ message: 'Failed to create photo' });
		}
	});

	app.put('/api/photos/:id', isAdmin, async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const validatedData = insertPhotoSchema.partial().parse(req.body);
			const photo = await dataStorage.updatePhoto(id, validatedData);

			if (!photo) {
				return res.status(404).json({ message: 'Photo not found' });
			}

			res.json(photo);
		} catch (error) {
			if (error instanceof ZodError) {
				return res
					.status(400)
					.json({ message: fromZodError(error).message });
			}
			res.status(500).json({ message: 'Failed to update photo' });
		}
	});

	// Reorder photos endpoint
	app.post('/api/photos/reorder', isAdmin, async (req, res) => {
		try {
			const { photoOrders, categoryId } = req.body;

			if (!Array.isArray(photoOrders)) {
				return res
					.status(400)
					.json({ message: 'photoOrders must be an array' });
			}

			// Validate array items
			for (const item of photoOrders) {
				if (
					typeof item !== 'object' ||
					!item.id ||
					typeof item.displayOrder !== 'number'
				) {
					return res.status(400).json({
						message:
							'Each item must have an id and displayOrder number',
					});
				}
			}

			// If categoryId is provided, we're reordering within a specific category
			const success = categoryId
				? await dataStorage.updatePhotoCategoryOrder(
						photoOrders,
						categoryId,
				  )
				: await dataStorage.updatePhotoOrder(photoOrders);

			if (!success) {
				return res
					.status(500)
					.json({ message: 'Failed to update photo order' });
			}

			res.status(200).json({
				message: categoryId
					? `Photo order in category ${categoryId} updated successfully`
					: 'Photo order updated successfully',
			});
		} catch (error) {
			console.error('Error reordering photos:', error);
			res.status(500).json({ message: 'Failed to reorder photos' });
		}
	});

	app.delete('/api/photos/:id', isAdmin, async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const success = await dataStorage.deletePhoto(id);

			if (!success) {
				return res.status(404).json({ message: 'Photo not found' });
			}

			res.sendStatus(204);
		} catch (error) {
			res.status(500).json({ message: 'Failed to delete photo' });
		}
	});

	// Contact Messages
	app.post('/api/contact', async (req, res) => {
		try {
			const validatedData = insertContactSchema.parse(req.body);
			const contactMessage = await dataStorage.createContactMessage(
				validatedData,
			);
			res.status(201).json({
				message:
					"Your message has been sent successfully! We'll get back to you soon.",
				id: contactMessage.id,
			});
		} catch (error) {
			if (error instanceof ZodError) {
				return res
					.status(400)
					.json({ message: fromZodError(error).message });
			}
			res.status(500).json({
				message: 'Failed to send message. Please try again.',
			});
		}
	});

	app.get('/api/contact', isAdmin, async (req, res) => {
		try {
			const contactMessages = await dataStorage.getContactMessages();
			res.json(contactMessages);
		} catch (error) {
			res.status(500).json({
				message: 'Failed to fetch contact messages',
			});
		}
	});

	app.patch('/api/contact/:id/read', isAdmin, async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const contactMessage = await dataStorage.markContactMessageAsRead(
				id,
			);

			if (!contactMessage) {
				return res
					.status(404)
					.json({ message: 'Contact message not found' });
			}

			res.json(contactMessage);
		} catch (error) {
			res.status(500).json({ message: 'Failed to mark message as read' });
		}
	});

	app.delete('/api/contact/:id', isAdmin, async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const success = await dataStorage.deleteContactMessage(id);

			if (!success) {
				return res
					.status(404)
					.json({ message: 'Contact message not found' });
			}

			res.sendStatus(204);
		} catch (error) {
			res.status(500).json({
				message: 'Failed to delete contact message',
			});
		}
	});

	// Testimonials
	app.get('/api/testimonials', async (req, res) => {
		try {
			const testimonials = await dataStorage.getActiveTestimonials();
			res.json(testimonials);
		} catch (error) {
			res.status(500).json({ message: 'Failed to fetch testimonials' });
		}
	});

	app.get('/api/admin/testimonials', isAdmin, async (req, res) => {
		try {
			const testimonials = await dataStorage.getTestimonials();
			res.json(testimonials);
		} catch (error) {
			res.status(500).json({ message: 'Failed to fetch testimonials' });
		}
	});

	// Public testimonial submission route
	app.post('/api/testimonials/submit', async (req, res) => {
		try {
			// Mark testimonials as not active by default
			const validatedData = insertTestimonialSchema.parse({
				...req.body,
				isActive: false,
			});
			const testimonial = await dataStorage.createTestimonial(
				validatedData,
			);
			res.status(201).json(testimonial);
		} catch (error) {
			if (error instanceof ZodError) {
				return res
					.status(400)
					.json({ message: fromZodError(error).message });
			}
			res.status(500).json({ message: 'Failed to submit testimonial' });
		}
	});

	// Admin testimonial creation route
	app.post('/api/testimonials', isAdmin, async (req, res) => {
		try {
			const validatedData = insertTestimonialSchema.parse(req.body);
			const testimonial = await dataStorage.createTestimonial(
				validatedData,
			);
			res.status(201).json(testimonial);
		} catch (error) {
			if (error instanceof ZodError) {
				return res
					.status(400)
					.json({ message: fromZodError(error).message });
			}
			res.status(500).json({ message: 'Failed to create testimonial' });
		}
	});

	app.put('/api/testimonials/:id', isAdmin, async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const validatedData = insertTestimonialSchema
				.partial()
				.parse(req.body);
			const testimonial = await dataStorage.updateTestimonial(
				id,
				validatedData,
			);

			if (!testimonial) {
				return res
					.status(404)
					.json({ message: 'Testimonial not found' });
			}

			res.json(testimonial);
		} catch (error) {
			if (error instanceof ZodError) {
				return res
					.status(400)
					.json({ message: fromZodError(error).message });
			}
			res.status(500).json({ message: 'Failed to update testimonial' });
		}
	});

	app.delete('/api/testimonials/:id', isAdmin, async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const success = await dataStorage.deleteTestimonial(id);

			if (!success) {
				return res
					.status(404)
					.json({ message: 'Testimonial not found' });
			}

			res.sendStatus(204);
		} catch (error) {
			res.status(500).json({ message: 'Failed to delete testimonial' });
		}
	});

	// Development Helpers
	app.post('/api/reset-data', isAdmin, async (req, res) => {
		try {
			await addMissingPhotos();
			res.status(200).json({
				message: 'Successfully added missing photos',
			});
		} catch (error) {
			console.error('Reset data error:', error);
			res.status(500).json({
				message:
					error instanceof Error
						? error.message
						: 'Failed to reset data',
			});
		}
	});

	// Create HTTP server
	const httpServer = createServer(app);
	return httpServer;
}
