import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Category, Photo } from '@shared/schema';
import { EnhancedLightbox } from '@/components/ui/lightbox';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ChevronDown } from 'lucide-react';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface GalleryProps {
	category?: string;
}

// Number of images to load at once for infinite scroll
const IMAGES_PER_PAGE = 6;

export function Gallery({ category: categorySlugProp }: GalleryProps) {
	const [activeFilter, setActiveFilter] = useState<string>('all');
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
	const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

	// Ref for bottom loader element
	const { ref: bottomRef, inView } = useInView();

	// Fetch categories for filtering
	const { data: categories } = useQuery<Category[]>({
		queryKey: ['/api/categories'],
	});

	// Get main categories and subcategories
	const mainCategories =
		categories?.filter((cat) => !cat.parentCategory) || [];
	const subcategories = categories?.filter((cat) => cat.parentCategory) || [];

	// Fetch photos based on category or all photos
	const queryKey = categorySlugProp
		? [`/api/photos/category/${categorySlugProp}`]
		: ['/api/photos'];

	const { data: photos, isLoading } = useQuery<Photo[]>({
		queryKey,
	});

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

	// Function to handle lightbox
	const openLightbox = (index: number) => {
		setCurrentImageIndex(index);
		setLightboxOpen(true);
	};

	// Filter photos based on active category, but don't apply additional filtering if already filtered by URL
	// Then sort by displayOrder for proper ordering
	const filteredPhotos = (
		categorySlugProp
			? photos || []
			: photos?.filter((photo) => {
					if (activeFilter === 'all') return true;
					return photo.categoryId === parseInt(activeFilter);
			  }) || []
	).sort((a, b) => {
		// Sort by displayOrder if available, or fallback to id
		if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
			return a.displayOrder - b.displayOrder;
		}
		return a.id - b.id;
	});

	// Visible photos subset for infinite loading
	const visiblePhotos = filteredPhotos.slice(0, visibleCount);

	// Reset visible count when filter changes
	useEffect(() => {
		setVisibleCount(IMAGES_PER_PAGE);
	}, [activeFilter, categorySlugProp]);

	// Handle infinite scroll loading
	useEffect(() => {
		if (inView && visibleCount < filteredPhotos.length) {
			// Add more photos when scrolled to bottom
			setTimeout(() => {
				setVisibleCount((prev) =>
					Math.min(prev + IMAGES_PER_PAGE, filteredPhotos.length),
				);
			}, 300);
		}
	}, [inView, filteredPhotos.length, visibleCount]);

	// Update active filter when category prop changes
	useEffect(() => {
		if (categorySlugProp && categories) {
			const categoryObj = categories.find(
				(cat) => cat.slug === categorySlugProp,
			);
			if (categoryObj) {
				setActiveFilter(categoryObj.id.toString());
			} else {
				setActiveFilter('all');
			}
		} else {
			setActiveFilter('all');
		}

		// Also reset visible count when category or filter changes
		setVisibleCount(IMAGES_PER_PAGE);
	}, [categorySlugProp, categories]);

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

	// Check if current path matches
	const isPathActive = (path: string) => {
		// Check if the current browser path exactly matches or starts with the item's href
		// This makes it more robust for parent categories with children
		const currentPath = window.location.pathname;
		if (path === '/portfolio' && currentPath === '/portfolio') return true; // Exact match for "All"
		return currentPath.startsWith(path) && path !== '/portfolio';
	};

	return (
		<div>
			{/* Category Dropdown Navigation */}
			<div className="flex flex-wrap justify-center mb-10 space-x-8">
				{navigation.map((item) => (
					<div key={item.name} className="relative">
						{item.children ? (
							<div
								ref={(el) =>
									(dropdownRefs.current[item.name] = el)
								}
								className="inline-block"
							>
								<button
									className={`flex items-center space-x-1 ${
										isPathActive(item.href) // Use isPathActive for robust check
											? 'text-primary font-medium'
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
								className={`${
									isPathActive(item.href)
										? 'text-primary font-medium'
										: 'text-secondary hover:text-primary'
								} transition-colors duration-300 px-3 py-1`} // Added some padding for non-dropdown links
							>
								{item.name}
							</Link>
						)}
					</div>
				))}
			</div>

			{/* Gallery Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{isLoading ? (
					// Loading skeletons
					Array.from({ length: 6 }).map((_, index) => (
						<GallerySkeleton key={index} />
					))
				) : visiblePhotos.length ? (
					// Actual photos with lazy loading
					visiblePhotos.map((photo, index) => (
						<GalleryItem
							key={photo.id}
							photo={photo}
							index={index}
							onImageClick={() => openLightbox(index)}
						/>
					))
				) : (
					// No photos state
					<div className="col-span-3 text-center py-10">
						<p className="text-secondary">
							Ingen bilder tilgjengelig i denne kategorien.
						</p>
					</div>
				)}
			</div>

			{/* Loader for infinite scroll */}
			{!isLoading && visibleCount < filteredPhotos.length && (
				<div ref={bottomRef} className="py-8 flex justify-center">
					<Skeleton className="h-10 w-10 rounded-full" />
				</div>
			)}

			{/* Enhanced Lightbox with navigation */}
			{filteredPhotos.length > 0 && (
				<EnhancedLightbox
					isOpen={lightboxOpen}
					photos={filteredPhotos}
					currentIndex={currentImageIndex}
					onClose={() => setLightboxOpen(false)}
				/>
			)}
		</div>
	);
}

interface GalleryItemProps {
	photo: Photo;
	index: number;
	onImageClick: () => void;
}

function GalleryItem({ photo, index, onImageClick }: GalleryItemProps) {
	// Find category name
	const { data: categoriesData } = useQuery<Category[]>({
		queryKey: ['/api/categories'],
	});

	const photoCategory = categoriesData?.find(
		(cat) => cat.id === photo.categoryId,
	);

	// Detect when item is in view for animation
	const { ref, inView } = useInView({
		threshold: 0.1,
		triggerOnce: true,
	});

	return (
		<motion.div
			ref={ref}
			className="gallery-item"
			initial={{ opacity: 0, y: 20 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration: 0.4, delay: 0.1 }}
		>
			<div
				className="overflow-hidden cursor-pointer gallery-img rounded-sm"
				onClick={onImageClick}
			>
				<LazyLoadImage
					src={photo.thumbnailUrl}
					alt={photo.title}
					effect="blur"
					threshold={300}
					wrapperClassName="w-full h-64"
					className="w-full h-64 object-cover"
					placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YyZjJmMiIvPjwvc3ZnPg=="
				/>
			</div>
			<h3 className="font-poppins font-medium mt-3 text-primary">
				{photo.title}
			</h3>
			<p className="text-secondary text-sm">
				{photoCategory?.name || 'Ukategorisert'}
			</p>
			{photo.location && (
				<p className="text-secondary text-sm">{photo.location}</p>
			)}
		</motion.div>
	);
}

function GallerySkeleton() {
	return (
		<div className="gallery-item">
			<Skeleton className="w-full h-64 rounded-sm" />
			<Skeleton className="h-6 w-3/4 mt-3" />
			<Skeleton className="h-4 w-1/2 mt-1" />
		</div>
	);
}
