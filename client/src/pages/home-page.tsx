import { Helmet } from 'react-helmet';
import { Hero } from '@/components/home/hero';
import { Introduction } from '@/components/home/introduction';
import { CategoryCollage } from '@/components/home/category-collage';
import { AboutSection } from '@/components/about/about-section';
import { Testimonials } from '@/components/home/testimonials';
import { ContactForm } from '@/components/contact/contact-form';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
	return (
		<>
			<Helmet>
				<title>
					FotoDS | Dawid Siedlec - Profesjonell Interiørfotografering
				</title>
				<meta
					name="description"
					content="Profesjonelle interiørfotograferingstjenester av Dawid Siedlec. Spesialiserer seg på eiendoms-, arkitektur- og interiørdesignfotografering i Norge."
				/>
				<meta
					property="og:title"
					content="FotoDS | Dawid Siedlec - Profesjonell Interiørfotografering"
				/>
				<meta
					property="og:description"
					content="Profesjonelle interiørfotograferingstjenester av Dawid Siedlec. Spesialiserer seg på eiendoms-, arkitektur- og interiørdesignfotografering i Norge."
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://fotods.no" />
			</Helmet>

			<Header />

			{/* Main Content */}
			<main>
				<Hero />
				<Introduction />

				{/* Category Collage Section */}
				<CategoryCollage />

				<AboutSection showHeroImage={false} />
				<Testimonials />
				<ContactForm />
			</main>

			<Footer />
		</>
	);
}
