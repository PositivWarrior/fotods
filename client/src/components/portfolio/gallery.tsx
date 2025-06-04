import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Category, Photo } from '@shared/schema';
import { EnhancedLightbox } from '@/components/ui/lightbox';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface GalleryProps {
	category?: string;
}

const IMAGES_PER_PAGE = 9;

export function Gallery({ category: categorySlugProp }: GalleryProps) {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE);

	const { ref: bottomRef, inView } = useInView();

	const queryKey = categorySlugProp
		? [`/api/photos/category/${categorySlugProp}`]
		: ['/api/photos'];

	const { data: photos, isLoading, error } = useQuery<Photo[]>({ queryKey });

	const { data: allCategories, isLoading: categoriesLoading } = useQuery<
		Category[]
	>({
		queryKey: ['/api/categories'],
	});

	const openLightbox = (index: number) => {
		setCurrentImageIndex(index);
		setLightboxOpen(true);
	};

	const sortedPhotos = (photos || []).sort((a, b) => {
		if (
			a.displayOrder !== null &&
			a.displayOrder !== undefined &&
			b.displayOrder !== null &&
			b.displayOrder !== undefined
		) {
			return a.displayOrder - b.displayOrder;
		}
		return a.id - b.id;
	});

	const currentCategoryForFilter =
		allCategories && categorySlugProp
			? allCategories.find((cat) => cat.slug === categorySlugProp)
			: null;

	const filteredPhotos =
		currentCategoryForFilter && allCategories
			? sortedPhotos.filter(
					(photo) => photo.categoryId === currentCategoryForFilter.id,
			  )
			: sortedPhotos;

	const visiblePhotos = filteredPhotos.slice(0, visibleCount);

	useEffect(() => {
		setVisibleCount(IMAGES_PER_PAGE);
	}, [categorySlugProp]);

	useEffect(() => {
		if (inView && visibleCount < filteredPhotos.length) {
			setTimeout(() => {
				setVisibleCount((prev) =>
					Math.min(prev + IMAGES_PER_PAGE, filteredPhotos.length),
				);
			}, 300);
		}
	}, [inView, filteredPhotos.length, visibleCount]);

	if (isLoading || (categorySlugProp && categoriesLoading)) {
		return <GallerySkeleton />;
	}

	if (error) {
		return (
			<div className="text-center py-10">
				<p className="text-red-500">Feil ved lasting av bilder.</p>
			</div>
		);
	}

	if (!photos || photos.length === 0) {
		return (
			<div className="text-center py-10">
				<p className="text-secondary">
					Ingen bilder funnet for denne kategorien.
				</p>
			</div>
		);
	}

	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
				{visiblePhotos.map((photo, index) => (
					<GalleryItem
						key={photo.id}
						photo={photo}
						index={index}
						onImageClick={() => openLightbox(index)}
					/>
				))}
			</div>

			{visibleCount < filteredPhotos.length && (
				<div
					ref={bottomRef}
					className="h-20 flex justify-center items-center"
				>
					<p className="text-secondary">Laster flere bilder...</p>
				</div>
			)}

			{lightboxOpen && (
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

function GalleryItem({ photo, onImageClick }: GalleryItemProps) {
	return (
		<motion.div
			className="group relative aspect-square overflow-hidden rounded-lg shadow-lg cursor-pointer"
			onClick={onImageClick}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			whileHover={{ scale: 1.03 }}
		>
			<LazyLoadImage
				alt={photo.title || 'Portfoliobilde'}
				effect="blur"
				src={photo.thumbnailUrl || photo.imageUrl}
				width="100%"
				height="100%"
				style={{ objectFit: 'cover', width: '100%', height: '100%' }}
				className="transition-transform duration-300 ease-in-out group-hover:scale-110"
			/>
			<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center p-4">
				<div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					{/* photo.title && (
						<h3 className="text-white text-lg font-semibold mb-1">
							{photo.title}
						</h3>
					) // Photo title display removed as per request */}
				</div>
			</div>
		</motion.div>
	);
}

function GallerySkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
			{Array.from({ length: IMAGES_PER_PAGE }).map((_, index) => (
				<div key={index} className="aspect-square">
					<Skeleton className="w-full h-full rounded-lg" />
				</div>
			))}
		</div>
	);
}
