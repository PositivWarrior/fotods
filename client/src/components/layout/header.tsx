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
		{
			name: 'Bolig',
			href: '/portfolio/category/housing',
		},
		{
			name: 'Kveldsbilder',
			href: '/portfolio/category/housing-evening',
		},
		{
			name: 'Drone',
			href: '/portfolio/category/housing-drone',
		},
		{ name: 'Video', href: '/portfolio/category/video' },
		{
			name: 'Portretter',
			href: '/portfolio/category/business',
		},
		{ name: 'Priser', href: '/priser' },
		{ name: 'Kontakt', href: '/contact' },
	];

	// Add admin panel link to navigation array only if user is an admin
	if (user && user.isAdmin) {
		navigation = [
			...navigation,
			{
				name: 'Admin',
				href: '/admin',
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
											<div
												className={`absolute ${
													item.name === 'Admin'
														? 'right-0'
														: 'left-0'
												} mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50`}
											>
												{item.name !== 'Admin' && (
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
												)}
												{item.children?.map((child) =>
													child.href ===
													'#admin-logout' ? (
														<button
															key={child.name}
															className="block w-full text-left px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50"
															onClick={() => {
																logoutMutation.mutate();
																setActiveDropdown(
																	null,
																);
															}}
														>
															{child.name}
														</button>
													) : (
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

						{!user ? (
							<Link
								href="/auth"
								className="text-secondary hover:text-primary transition-colors duration-300"
							>
								Logg Inn
							</Link>
						) : (
							user &&
							!user.isAdmin && (
								<Button
									variant="ghost"
									className="text-secondary hover:text-primary hover:bg-transparent p-0"
									onClick={() => logoutMutation.mutate()}
								>
									Logg Ut
								</Button>
							)
						)}
					</div>

					{/* Medium Screen Navigation */}
					<div className="hidden md:flex lg:hidden items-center space-x-6">
						{navigation
							.filter((item) =>
								[
									'Bolig',
									'Portretter',
									'Kveldsbilder',
									'Drone',
									'Kontakt',
									'Admin',
								].includes(item.name),
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
													{item.name !== 'Admin' && (
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
													)}
													{item.children?.map(
														(child) =>
															child.href ===
															'#admin-logout' ? (
																<button
																	key={
																		child.name
																	}
																	className="block w-full text-left px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50"
																	onClick={() => {
																		logoutMutation.mutate();
																		setActiveDropdown(
																			null,
																		);
																	}}
																>
																	{child.name}
																</button>
															) : (
																<Link
																	key={
																		child.name
																	}
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
						{!user ? (
							<Link
								href="/auth"
								className="text-secondary hover:text-primary transition-colors duration-300"
							>
								Logg Inn
							</Link>
						) : (
							user &&
							!user.isAdmin && (
								<Button
									variant="ghost"
									className="text-secondary hover:text-primary hover:bg-transparent p-0"
									onClick={() => logoutMutation.mutate()}
								>
									Logg Ut
								</Button>
							)
						)}
					</div>

					{/* Mobile Navigation Toggle */}
					<button
						ref={mobileButtonRef}
						className="lg:hidden text-primary"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label="Toggle navigation menu"
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
						className={`lg:hidden absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-40 transform transition-transform duration-300 ease-in-out ${
							isMobileMenuOpen
								? 'translate-x-0'
								: 'translate-x-full'
						}`}
						ref={mobileMenuRef}
					>
						{navigation.map((item) => (
							<div key={item.name + '-mobile-main'}>
								{item.children ? (
									<>
										<button
											className={`w-full text-left flex items-center justify-between px-4 py-2 text-lg font-medium ${
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
											{item.name}
											<ChevronDown
												className={`h-5 w-5 transition-transform duration-200 ${
													activeDropdown === item.name
														? 'rotate-180'
														: ''
												}`}
											/>
										</button>
										{activeDropdown === item.name && (
											<div className="pl-4 border-l-2 border-gray-200 ml-2">
												{item.name !== 'Admin' && (
													<Link
														href={item.href}
														className="block px-4 py-2 text-md font-medium text-secondary hover:text-primary transition-colors duration-300"
														onClick={() =>
															handleMobileLinkClick(
																item.href,
															)
														}
													>
														Alle {item.name}
													</Link>
												)}
												{item.children.map((child) =>
													child.href ===
													'#admin-logout' ? (
														<button
															key={child.name}
															className="block w-full text-left px-4 py-2 text-md font-medium text-secondary hover:text-primary transition-colors duration-300"
															onClick={() => {
																logoutMutation.mutate();
																setActiveDropdown(
																	null,
																);
																setIsMobileMenuOpen(
																	false,
																);
															}}
														>
															{child.name}
														</button>
													) : (
														<Link
															key={child.name}
															href={child.href}
															className="block px-4 py-2 text-md font-medium text-secondary hover:text-primary transition-colors duration-300"
															onClick={() =>
																handleMobileLinkClick(
																	child.href,
																)
															}
														>
															{child.name}
														</Link>
													),
												)}
											</div>
										)}
									</>
								) : (
									<Link
										href={item.href}
										className={`block px-4 py-2 text-lg font-medium transition-colors duration-300 ${
											isActive(item.href)
												? 'text-primary'
												: 'text-secondary hover:text-primary'
										}`}
										onClick={() =>
											handleMobileLinkClick(item.href)
										}
									>
										{item.name}
									</Link>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</header>
	);
}
