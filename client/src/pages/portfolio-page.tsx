import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Gallery } from '@/components/portfolio/gallery';
import { CategoryFilter } from '@/components/portfolio/category-filter';
import { useLocation, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';
import { motion } from 'framer-motion';

export default function PortfolioPage() {
	// Get category from route parameters - check both patterns
	const [matchesFirstPattern, paramsFirstPattern] = useRoute(
		'/portfolio/category/:category',
	);
	const [matchesSecondPattern, paramsSecondPattern] = useRoute(
		'/portfolio/:category',
	);

	// Parse URL search parameters as fallback
	const [location] = useLocation();
	const searchParams = new URLSearchParams(location.split('?')[1] || '');

	// Use the category from any matching route pattern, otherwise check query params
	const categorySlug =
		(matchesFirstPattern && paramsFirstPattern?.category) ||
		(matchesSecondPattern && paramsSecondPattern?.category) ||
		searchParams.get('category');

	// Fetch category details if slug is provided
	const { data: categories } = useQuery<Category[]>({
		queryKey: ['/api/categories'],
	});

	const activeCategory = categories?.find((cat) => cat.slug === categorySlug);

	// Scroll to top on page load
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<>
			<Helmet>
				<title>
					{activeCategory
						? `${activeCategory.name} Fotografering | FotoDS Portefølje`
						: 'Portefølje | FotoDS - Dawid Siedlec Fotografi'}
				</title>
				<meta
					name="description"
					content={`Se profesjonell ${
						activeCategory?.name || 'interiør'
					}fotografering av Dawid Siedlec. Høykvalitetsbilder som viser vakre rom og arkitektoniske detaljer.`}
				/>
				<meta
					property="og:title"
					content={`${
						activeCategory?.name || 'Portefølje'
					} | FotoDS - Dawid Siedlec Fotografi`}
				/>
				<meta
					property="og:description"
					content={`Se profesjonell ${
						activeCategory?.name || 'interiør'
					}fotografering av Dawid Siedlec. Høykvalitetsbilder som viser vakre rom og arkitektoniske detaljer.`}
				/>
				<meta property="og:type" content="website" />
			</Helmet>

			<Header />

			<main>
				{/* Portfolio Hero */}
				<section className="pt-32 pb-20 bg-muted">
					<div className="container mx-auto px-6">
						<motion.div
							className="text-center max-w-3xl mx-auto"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<h1 className="text-4xl md:text-5xl font-poppins font-semibold mb-6">
								{activeCategory
									? `${activeCategory.name} Fotografering`
									: 'Portefølje'}
							</h1>
							<p className="text-secondary text-lg mb-8">
								{activeCategory
									? `Se min samling av profesjonell ${activeCategory.name.toLowerCase()}fotografering som viser vakre interiører og arkitektoniske detaljer.`
									: 'Utforsk min varierte samling av interiør- og arkitekturfotografering, som viser skjønnheten og funksjonaliteten til forskjellige rom.'}
							</p>
						</motion.div>

						{/* CategoryFilter might be intended here if it shows category links */}
						{/* <CategoryFilter /> */}

						{/* Gallery Grid */}
						<Gallery category={categorySlug || undefined} />
					</div>
				</section>
			</main>

			<Footer />
		</>
	);
}
