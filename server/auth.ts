import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { storage } from './storage';
import { User } from '@shared/schema';

declare global {
	namespace Express {
		interface User {
			id: number;
			username: string;
			password: string;
			isAdmin: boolean;
		}
	}
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
	const salt = randomBytes(16).toString('hex');
	const buf = (await scryptAsync(password, salt, 64)) as Buffer;
	return `${buf.toString('hex')}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
	const [hashed, salt] = stored.split('.');
	const hashedBuf = Buffer.from(hashed, 'hex');
	const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
	return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
	// Initialize admin user with hashed password - This section might be redundant now or can be removed
	// if the LocalStrategy handles the creation and admin status of the two specific users.
	// For now, I will comment it out to avoid potential conflicts with the LocalStrategy's user creation.
	/*
	(async () => {
		const existingAdmin = await storage.getUserByUsername('admin');
		if (
			existingAdmin &&
			existingAdmin.password === 'admin_password_hash.salt'
		) {
			const user = await storage.getUser(existingAdmin.id);
			if (user) {
				const hashedPassword = await hashPassword('admin123');
				user.password = hashedPassword;
				user.isAdmin = true;
				await storage.updateUser(user.id, {
					password: user.password,
					isAdmin: user.isAdmin,
				});
			}
		}
	})();
	*/

	const sessionSettings: session.SessionOptions = {
		secret: process.env.SESSION_SECRET || 'fotods-secret-key',
		resave: false,
		saveUninitialized: false,
		store: storage.sessionStore,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
			secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
			sameSite: 'none', // Changed to 'none' for cross-site requests. Requires secure: true.
		},
	};

	app.set('trust proxy', 1);
	app.use(session(sessionSettings));
	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(
		new LocalStrategy(async (usernameInput, password, done) => {
			const username = usernameInput.toLowerCase();
			try {
				const user = await storage.getUserByUsername(username);

				if (!user) {
					// User not found
					return done(null, false, {
						message: 'Invalid credentials.',
					});
				}

				const passwordMatch = await comparePasswords(
					password,
					user.password,
				);

				if (!passwordMatch) {
					// Password does not match
					return done(null, false, {
						message: 'Invalid credentials.',
					});
				}

				if (!user.isAdmin) {
					// User is not an admin
					return done(null, false, {
						message: 'Access denied. User is not an administrator.',
					});
				}

				// User found, password matches, and user is an admin
				return done(null, user);
			} catch (err) {
				return done(err);
			}
		}),
	);

	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser(async (id: number, done) => {
		try {
			const user = await storage.getUser(id);
			done(null, user);
		} catch (err) {
			done(err);
		}
	});

	// app.post('/api/register', async (req, res, next) => { // Commenting out the register endpoint
	// 	try {
	// 		const existingUser = await storage.getUserByUsername(
	// 			req.body.username,
	// 		);
	// 		if (existingUser) {
	// 			return res
	// 				.status(400)
	// 				.json({ message: 'Username already exists' });
	// 		}
	//
	// 		const user = await storage.createUser({
	// 			...req.body,
	// 			password: await hashPassword(req.body.password),
	// 		});
	//
	// 		req.login(user, (err) => {
	// 			if (err) return next(err);
	// 			return res.status(201).json(user);
	// 		});
	// 	} catch (err) {
	// 		next(err);
	// 	}
	// });

	app.post(
		'/api/login',
		(req: Request, res: Response, next: NextFunction) => {
			passport.authenticate(
				'local',
				async (
					err: Error | null,
					user: Express.User | false | null,
					info: { message: string } | undefined,
				) => {
					if (err) return next(err);
					if (!user)
						return res
							.status(400)
							.json(info || { message: 'Invalid credentials' }); // Use info.message if available

					// The LocalStrategy now ensures that 'user' is an admin if authentication succeeds.
					// The following block for special admin checks is no longer needed.
					/*
					// Special case for adminkacpru@gmail.com - always ensure admin access
					if (
						user.username === 'adminkacpru@gmail.com' &&
						!user.isAdmin
					) {
						user.isAdmin = true;
						// Update the user in storage
						await storage.updateUser(user.id, { isAdmin: true });
					} else if (
						user.username === 'admindawid@gmail.com' &&
						!user.isAdmin
					) {
						user.isAdmin = true;
						// Update the user in storage
						await storage.updateUser(user.id, { isAdmin: true });
					}
					*/

					req.login(user, (err) => {
						if (err) return next(err);
						return res.status(200).json(user);
					});
				},
			)(req, res, next);
		},
	);

	app.post('/api/logout', (req, res, next) => {
		req.logout((err) => {
			if (err) return next(err);
			res.sendStatus(200);
		});
	});

	app.get('/api/user', (req, res) => {
		if (!req.isAuthenticated()) return res.sendStatus(401);
		res.json(req.user);
	});
}

// Middleware to check if user is admin
export function isAdmin(req: Request, res: Response, next: NextFunction) {
	if (!req.isAuthenticated() || !req.user.isAdmin) {
		return res
			.status(403)
			.json({ message: 'Unauthorized: Admin access required' });
	}
	next();
}
