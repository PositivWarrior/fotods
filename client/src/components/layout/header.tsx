import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';
import { motion } from 'framer-motion';
import logoImage from '../../assets/logo_no_bg.png';

type NavItemWithChildren = {
	name: string;
	href: string;
	children?: Array<{ name: string; href: string }>;
};

export function Header() {
	const [location, navigate] = useLocation();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
	const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
	const mobileMenuRef = useRef<HTMLDivElement | null>(null);
	const mobileButtonRef = useRef<HTMLButtonElement | null>(null);
	const { user, logoutMutation } = useAuth();

	// Fetch all categories
	const { data: categories } = useQuery<Category[]>({
		queryKey: ['/api/categories'],
	});

	const mainCategories =
		categories?.filter((cat) => !cat.parentCategory) || [];
	const subcategories = categories?.filter((cat) => cat.parentCategory) || [];

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				activeDropdown &&
				dropdownRefs.current[activeDropdown] &&
				!dropdownRefs.current[activeDropdown]?.contains(
					event.target as Node,
				)
			) {
				setActiveDropdown(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, [activeDropdown]);

	// Close mobile menu when clicking outside
	useEffect(() => {
		const handleClickOutsideMobile = (event: MouseEvent) => {
			if (
				isMobileMenuOpen &&
				mobileMenuRef.current &&
				!mobileMenuRef.current.contains(event.target as Node) &&
				!mobileButtonRef.current?.contains(event.target as Node)
			) {
				setIsMobileMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutsideMobile);
		return () =>
			document.removeEventListener('mousedown', handleClickOutsideMobile);
	}, [isMobileMenuOpen]);

	// Organize navigation with dropdowns
	let navigation: NavItemWithChildren[] = [
		{ name: 'Hjem', href: '/' },
		{ name: 'Portefølje', href: '/portfolio' },
		{ name: 'Priser', href: '/priser' },
		{
			name: 'Bolig',
			href: '/portfolio/category/housing',
			children: [
				{
					name: 'Detaljer',
					href: '/portfolio/category/housing-details',
				},
				{
					name: 'Drone',
					href: '/portfolio/category/housing-drone',
				},
				{
					name: 'Kveldsbilder',
					href: '/portfolio/category/housing-evening',
				},
			],
		},
		{
			name: 'Næring',
			href: '/portfolio/category/business',
			children: [
				{
					name: 'Portretter',
					href: '/portfolio/category/business-portraits',
				},
			],
		},
		{
			name: 'Livsstil',
			href: '/portfolio/category/lifestyle',
			children: [
				{
					name: 'Portretter',
					href: '/portfolio/category/lifestyle-portraits',
				},
				{
					name: 'Bryllup',
					href: '/portfolio/category/lifestyle-weddings',
				},
			],
		},
		{ name: 'Om Meg', href: '/about' },
		{ name: 'Kontakt', href: '/contact' },
	];

	// Add admin panel link to navigation array only if user is an admin
	if (user && user.isAdmin) {
		navigation = [
			...navigation,
			{
				name: 'Admin',
				href: '/admin',
				children: [
					{ name: 'Dashboard', href: '/admin' },
					{ name: 'Photos', href: '/admin/photos' },
					{ name: 'Categories', href: '/admin/categories' },
					{ name: 'Testimonials', href: '/admin/testimonials' },
					{ name: 'Messages', href: '/admin/messages' },
				],
			},
		];
	}

	const isActive = (path: string) => {
		if (path === '/' && location === '/') return true;
		if (path !== '/' && location.startsWith(path)) return true;
		return false;
	};

	// Function to handle mobile link clicks
	const handleMobileLinkClick = (href: string) => {
		navigate(href);
		setActiveDropdown(null);
		setIsMobileMenuOpen(false);
	};

	return (
		<header
			className={`fixed top-0 w-full z-30 transition-all duration-300 ${
				isScrolled
					? 'bg-white shadow-sm'
					: 'bg-[hsl(84,25%,95%)]/90 backdrop-blur-sm'
			}`}
		>
			<div className="container mx-auto px-6 py-4">
				<nav className="flex justify-between items-center">
					<Link href="/" className="flex items-center gap-2">
						<div className="h-9 w-9">
							<motion.img
								src={logoImage}
								alt="FotoDS Logo"
								className="h-full w-full"
								initial={{ rotate: 0 }}
								whileHover={{ rotate: 15 }}
								transition={{ type: 'spring', stiffness: 300 }}
							/>
						</div>
						<span className="text-2xl font-poppins font-semibold tracking-wider">
							FotoDS
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden lg:flex items-center space-x-10">
						{navigation.map((item) => (
							<div
								key={item.name + '-desktop'}
								className="relative inline-block"
							>
								{item.children ? (
									<div
										ref={(el) =>
											(dropdownRefs.current[item.name] =
												el)
										}
										className="inline-block"
									>
										<button
											className={`flex items-center space-x-1 ${
												isActive(item.href)
													? 'text-primary'
													: 'text-secondary hover:text-primary'
											} transition-colors duration-300`}
											onClick={() =>
												setActiveDropdown(
													activeDropdown === item.name
														? null
														: item.name,
												)
											}
										>
											<span>{item.name}</span>
											<ChevronDown className="h-4 w-4" />
										</button>

										{activeDropdown === item.name && (
											<div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
												<Link
													href={item.href}
													className="block px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50"
													onClick={() =>
														setActiveDropdown(null)
													}
												>
													Alle {item.name}
												</Link>
												{item.children?.map((child) => (
													<Link
														key={child.name}
														href={child.href}
														className="block px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50"
														onClick={() =>
															setActiveDropdown(
																null,
															)
														}
													>
														{child.name}
													</Link>
												))}
											</div>
										)}
									</div>
								) : (
									<Link
										href={item.href}
										className={`${
											isActive(item.href)
												? 'text-primary'
												: 'text-secondary hover:text-primary'
										} transition-colors duration-300`}
									>
										{item.name}
									</Link>
								)}
							</div>
						))}

						{user ? (
							<Button
								variant="ghost"
								className="text-secondary hover:text-primary hover:bg-transparent p-0"
								onClick={() => logoutMutation.mutate()}
							>
								Logg Ut
							</Button>
						) : (
							<Link
								href="/auth"
								className="text-secondary hover:text-primary transition-colors duration-300"
							>
								Logg Inn
							</Link>
						)}
					</div>

					{/* Medium Screen Navigation */}
					<div className="hidden md:flex lg:hidden items-center space-x-6">
						{navigation
							.filter((item) =>
								['Portefølje', 'Kontakt', 'Om Meg'].includes(
									item.name,
								),
							)
							.map((item) => (
								<div
									key={item.name + '-medium'}
									className="relative inline-block"
								>
									{item.children ? (
										<div
											ref={(el) =>
												(dropdownRefs.current[
													item.name + '-medium'
												] = el)
											}
											className="inline-block"
										>
											<button
												className={`flex items-center space-x-1 ${
													isActive(item.href)
														? 'text-primary'
														: 'text-secondary hover:text-primary'
												} transition-colors duration-300`}
												onClick={() =>
													setActiveDropdown(
														activeDropdown ===
															item.name +
																'-medium'
															? null
															: item.name +
																	'-medium',
													)
												}
											>
												<span>{item.name}</span>
												<ChevronDown className="h-4 w-4" />
											</button>

											{activeDropdown ===
												item.name + '-medium' && (
												<div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
													<Link
														href={item.href}
														className="block px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50"
														onClick={() =>
															setActiveDropdown(
																null,
															)
														}
													>
														Alle {item.name}
													</Link>
													{item.children?.map(
														(child) => (
															<Link
																key={child.name}
																href={
																	child.href
																}
																className="block px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50"
																onClick={() =>
																	setActiveDropdown(
																		null,
																	)
																}
															>
																{child.name}
															</Link>
														),
													)}
												</div>
											)}
										</div>
									) : (
										<Link
											href={item.href}
											className={`${
												isActive(item.href)
													? 'text-primary'
													: 'text-secondary hover:text-primary'
											} transition-colors duration-300`}
										>
											{item.name}
										</Link>
									)}
								</div>
							))}
						{user ? (
							<Button
								variant="ghost"
								className="text-secondary hover:text-primary hover:bg-transparent p-0"
								onClick={() => logoutMutation.mutate()}
							>
								Logg Ut
							</Button>
						) : (
							<Link
								href="/auth"
								className="text-secondary hover:text-primary transition-colors duration-300"
							>
								Logg Inn
							</Link>
						)}
					</div>

					{/* Mobile Navigation Toggle */}
					<button
						ref={mobileButtonRef}
						className="lg:hidden text-primary"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</button>
				</nav>

				{/* Mobile Navigation Menu */}
				{isMobileMenuOpen && (
					<div
						ref={mobileMenuRef}
						className="lg:hidden bg-white py-4 space-y-3 mt-4 rounded-lg shadow-md"
					>
						{navigation.map((item) => (
							<div
								key={item.name + '-mobile'}
								className="text-center"
							>
								<Link
									href={item.href}
									className={`block py-2 ${
										isActive(item.href)
											? 'text-primary font-semibold'
											: 'text-secondary hover:text-primary'
									} transition-colors duration-300`}
									onClick={(e) => {
										e.preventDefault();
										handleMobileLinkClick(item.href);
									}}
								>
									{item.name}
								</Link>
							</div>
						))}

						{user ? (
							<div className="text-center">
								<Button
									variant="ghost"
									className="text-secondary hover:text-primary hover:bg-transparent p-0"
									onClick={() => {
										logoutMutation.mutate();
										setIsMobileMenuOpen(false);
									}}
								>
									Logg Ut
								</Button>
							</div>
						) : (
							<div className="text-center">
								<Link
									href="/auth"
									className={`block py-2 text-secondary hover:text-primary transition-colors duration-300`}
									onClick={(e) => {
										e.preventDefault();
										handleMobileLinkClick('/auth');
									}}
								>
									Logg Inn
								</Link>
							</div>
						)}
					</div>
				)}
			</div>
		</header>
	);
}
