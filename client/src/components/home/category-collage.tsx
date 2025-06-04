import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Category, Photo } from '@shared/schema';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CategoryCollage() {
	const { data: categories, isLoading: categoriesLoading } = useQuery<
		Category[]
	>({
		queryKey: ['/api/categories'],
	});

	const { data: photos, isLoading: photosLoading } = useQuery<Photo[]>({
		queryKey: ['/api/photos'],
	});

	// Displaying specific main categories in the collage: Bolig, Kveldsbilder, Drone
	const mainCategoryNames = ['Bolig', 'Kveldsbilder', 'Drone'];
	const mainCategories = categories
		? (mainCategoryNames
				.map((name) => categories.find((cat) => cat.name === name))
				.filter(Boolean) as Category[])
		: [];

	console.log(
		'[Collage] Filtered mainCategories to display:',
		mainCategories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
	);

	if (categoriesLoading || photosLoading) {
		return (
			<section className="py-16 bg-muted">
				<div className="container mx-auto px-6">
					<div className="py-10 text-center text-muted-foreground">
						Laster galleriinnhold...
					</div>
				</div>
			</section>
		);
	}

	// Returns photos for a given category and its subcategories
	const getCategoryPhotos = (categoryId: number, limit = 4) => {
		const categoryForLog = categories?.find((c) => c.id === categoryId);
		const categoryName = categoryForLog?.name || `ID ${categoryId}`;

		console.log(
			`[Collage] Getting photos for COLLAGE TILE category: ${categoryName} (ID: ${categoryId})`,
		);

		// Get direct photos of this category. For the collage tiles, we are intentionally
		// not including photos from sub-categories to keep each tile specific.
		let directPhotos =
			photos?.filter((photo) => photo.categoryId === categoryId) || [];

		console.log(
			`[Collage] Direct photos for ${categoryName} (before featured sort):`,
			directPhotos.map((p) => ({ title: p.title, featured: p.featured })),
		);

		// Prioritize featured photos
		const featuredPhotos = directPhotos.filter((photo) => photo.featured);
		const nonFeaturedPhotos = directPhotos.filter(
			(photo) => !photo.featured,
		);

		let combined = [...featuredPhotos, ...nonFeaturedPhotos];
		console.log(
			`[Collage] Photos for ${categoryName} (AFTER featured sort, before limit):`,
			combined.map((p) => p.title),
		);

		// Return limited number of photos
		const finalPhotos =
			combined.length > limit ? combined.slice(0, limit) : combined;
		console.log(
			`[Collage] Final photos for ${categoryName} (limited to ${limit}):`,
			finalPhotos.map((p) => p.title),
		);

		return finalPhotos;
	};

	return (
		<section className="py-16 bg-muted">
			<div className="container mx-auto px-6">
				<h2 className="text-3xl font-poppins font-semibold text-center mb-16">
					Våre Fototjenester
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
					{mainCategories.map((category) => {
						const categoryPhotos = getCategoryPhotos(
							category.id,
							4,
						);

						if (categoryPhotos.length === 0) return null;

						// Main photo is first, smaller ones are the next three
						const mainPhoto = categoryPhotos[0];
						const smallPhotos = categoryPhotos.slice(1, 4);

						return (
							<motion.div
								key={category.id}
								className="flex flex-col h-full"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								viewport={{ once: true }}
							>
								<h3 className="text-xl font-poppins font-medium mb-5 text-primary">
									{category.name}
								</h3>

								{/* Main photo on top with frame */}
								<div className="mb-1 p-1 bg-black">
									<div className="overflow-hidden">
										<img
											src={mainPhoto.thumbnailUrl}
											alt={mainPhoto.title}
											className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-500"
										/>
									</div>
								</div>

								{/* Three smaller photos at the bottom */}
								<div className="grid grid-cols-3 mb-6">
									{/* Ensure we always have 3 photos by duplicating if needed */}
									{[
										...smallPhotos,
										...smallPhotos,
										...smallPhotos,
									]
										.slice(0, 3)
										.map((photo, index) => (
											<div
												key={`${photo.id}-${index}`}
												className={`p-1 bg-black overflow-hidden ${
													index > 0
														? 'border-l border-white'
														: ''
												}`}
											>
												<img
													src={photo.thumbnailUrl}
													alt={photo.title}
													className="w-full h-24 object-cover transform hover:scale-105 transition-transform duration-500"
												/>
											</div>
										))}
								</div>

								{/* Link to the specific category page */}
								<Link
									href={`/portfolio/${category.slug}`}
									className="inline-flex items-center mt-auto text-primary hover:text-secondary font-medium transition-colors"
								>
									<span>Se {category.name} Galleri</span>
									<ArrowRight className="w-4 h-4 ml-1" />
								</Link>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
