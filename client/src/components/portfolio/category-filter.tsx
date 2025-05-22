import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export function CategoryFilter() {
	const [location] = useLocation();
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
	const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

	// Fetch all categories
	const { data: categories } = useQuery<Category[]>({
		queryKey: ['/api/categories'],
	});

	const mainCategories =
		categories?.filter((cat) => !cat.parentCategory) || [];
	const subcategories = categories?.filter((cat) => cat.parentCategory) || [];

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

	// Define navigation structure with dropdowns
	const navigation = [
		{
			name: 'Alle',
			href: '/portfolio',
		},
		{
			name: 'Bolig',
			href: '/portfolio/category/housing',
			children: [
				{
					name: 'Detaljer',
					href: '/portfolio/category/housing-details',
				},
				{ name: 'Drone', href: '/portfolio/category/housing-drone' },
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
					href: '/portfolio/category/lifestyle-wedding',
				},
			],
		},
	];

	const isActive = (path: string) => {
		return location === path;
	};

	return (
		<div className="flex flex-wrap justify-center gap-6 mb-12">
			{navigation.map((item) => (
				<div key={item.name} className="relative inline-block">
					{item.children ? (
						<div
							ref={(el) => (dropdownRefs.current[item.name] = el)}
							className="inline-block"
						>
							<button
								className={`flex items-center space-x-1 px-4 py-2 rounded-md border ${
									location.includes(item.href)
										? 'border-primary text-primary bg-primary/5'
										: 'border-gray-200 text-secondary hover:text-primary hover:border-primary/30'
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
								<ChevronDown
									className={`h-4 w-4 transition-transform ${
										activeDropdown === item.name
											? 'rotate-180'
											: ''
									}`}
								/>
							</button>

							{activeDropdown === item.name && (
								<motion.div
									className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2 }}
								>
									<Link
										href={item.href}
										className="block px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50"
										onClick={() => setActiveDropdown(null)}
									>
										Alle {item.name}
									</Link>
									{item.children?.map((child) => (
										<Link
											key={child.name}
											href={child.href}
											className="block px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50"
											onClick={() =>
												setActiveDropdown(null)
											}
										>
											{child.name}
										</Link>
									))}
								</motion.div>
							)}
						</div>
					) : (
						<Link
							href={item.href}
							className={`inline-block px-4 py-2 rounded-md border ${
								isActive(item.href)
									? 'border-primary text-primary bg-primary/5'
									: 'border-gray-200 text-secondary hover:text-primary hover:border-primary/30'
							} transition-colors duration-300`}
						>
							{item.name}
						</Link>
					)}
				</div>
			))}
		</div>
	);
}
