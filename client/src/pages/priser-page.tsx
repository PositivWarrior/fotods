import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { motion } from 'framer-motion';
import { CheckCircle, Camera, Users, Gift, Sun, Info } from 'lucide-react';
import { Link } from 'wouter';

const pricingPackages = [
	{
		category: 'Bryllup',
		name: 'Pakke 1',
		price: '10 000 NOK',
		features: [
			'Planleggingsmøte',
			'Vielsen og portrett sammen med forlovere',
			'Galleri med redigerte bilder i høy oppløsning (digitalt)',
		],
		icon: Gift,
	},
	{
		category: 'Bryllup',
		name: 'Pakke 2',
		price: '15 000 NOK',
		features: [
			'Planleggingsmøte',
			'Pyntebilder (forberedelse)',
			'Vielsen og portrett',
			'Halvdagsfotografering (ca. 5 timer)',
			'Galleri med redigerte bilder i høy oppløsning (digitalt)',
		],
		icon: Gift,
	},
	{
		category: 'Bryllup',
		name: 'Pakke 3',
		price: '20 000 NOK',
		features: [
			'Planleggingsmøte',
			'Pyntebilder, vielsen, portrett',
			'Fest, første dans, taler',
			'Heldagsfotografering (ca. 10 timer)',
			'Galleri med redigerte bilder i høy oppløsning (digitalt)',
		],
		icon: Gift,
	},
	{
		category: 'Portrettfotografering',
		name: 'Portrett',
		price: '2 500 NOK',
		features: [
			'45 minutter fotografering (utendørs/hjemmestudio)',
			'5 portrettbilder (digitalt)',
			'Mulighet for kjøp av ekstra bilder (200 NOK/stk)',
		],
		icon: Camera,
	},
	{
		category: 'Portrettfotografering',
		name: 'Familie',
		price: '2 500 NOK',
		features: [
			'45 minutter fotografering (utendørs/hjemmestudio)',
			'5 familiebilder (digitalt)',
			'Mulighet for kjøp av ekstra bilder (200 NOK/stk)',
		],
		icon: Users,
	},
	{
		category: 'Portrettfotografering',
		name: 'Gravid',
		price: '2 500 NOK',
		features: [
			'45 minutter fotografering (utendørs/hjemmestudio)',
			'5 gravidbilder (digitalt)',
			'Mulighet for kjøp av ekstra bilder (200 NOK/stk)',
		],
		icon: Camera, // Could use a specific icon for pregnancy if available
	},
];

export default function PriserPage() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<>
			<Helmet>
				<title>Priser | FotoDS - Dawid Siedlec Fotografi</title>
				<meta
					name="description"
					content="Oversikt over priser og pakker for bryllupsfotografering, portrett, familiebilder og mer hos FotoDS."
				/>
				<meta
					property="og:title"
					content="Priser | FotoDS - Dawid Siedlec Fotografi"
				/>
				<meta
					property="og:description"
					content="Oversikt over priser og pakker for bryllupsfotografering, portrett, familiebilder og mer hos FotoDS."
				/>
				<meta property="og:type" content="website" />
			</Helmet>

			<Header />

			<main>
				{/* Hero Section */}
				<motion.section
					className="pt-36 pb-20 bg-muted"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<div className="container mx-auto px-6 text-center">
						<motion.h1
							className="text-4xl md:text-5xl font-poppins font-semibold mb-6 text-primary"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							Priser
						</motion.h1>
						<motion.p
							className="text-lg text-secondary max-w-2xl mx-auto"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							Velg en pakke som passer til dine behov. Jeg tilbyr
							fleksible løsninger for å fange dine spesielle
							øyeblikk.
						</motion.p>
					</div>
				</motion.section>

				{/* Pricing Packages Section */}
				<section className="py-16 lg:py-24 bg-background">
					<div className="container mx-auto px-6">
						{/* Bryllup Packages */}
						<div className="mb-16">
							<h2 className="text-3xl font-poppins font-semibold text-center mb-12 text-primary">
								Bryllupsfotografering
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
								{pricingPackages
									.filter((pkg) => pkg.category === 'Bryllup')
									.map((pkg, index) => (
										<motion.div
											key={index}
											className="bg-white rounded-lg shadow-xl p-8 flex flex-col border border-border hover:shadow-2xl transition-shadow duration-300"
											initial={{ opacity: 0, y: 50 }}
											whileInView={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.5,
												delay: index * 0.1,
											}}
											viewport={{ once: true }}
										>
											<div className="flex-grow">
												<pkg.icon className="w-12 h-12 text-primary mb-6 mx-auto" />
												<h3 className="text-2xl font-poppins font-semibold text-center mb-3 text-primary">
													{pkg.name}
												</h3>
												<p className="text-4xl font-poppins font-bold text-center text-secondary mb-6">
													{pkg.price}
												</p>
												<ul className="space-y-3 mb-8 text-secondary">
													{pkg.features.map(
														(feature, fIndex) => (
															<li
																key={fIndex}
																className="flex items-start"
															>
																<CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
																<span>
																	{feature}
																</span>
															</li>
														),
													)}
												</ul>
											</div>
											<Link
												href="/contact"
												className="block w-full mt-auto text-center bg-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-primary/90 transition-colors duration-300"
											>
												Kontakt for booking
											</Link>
										</motion.div>
									))}
							</div>
						</div>

						{/* Portrettfotografering Packages */}
						<div>
							<h2 className="text-3xl font-poppins font-semibold text-center mb-12 text-primary">
								Portrett & Familie
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
								{pricingPackages
									.filter(
										(pkg) =>
											pkg.category ===
											'Portrettfotografering',
									)
									.map((pkg, index) => (
										<motion.div
											key={index}
											className="bg-white rounded-lg shadow-xl p-8 flex flex-col border border-border hover:shadow-2xl transition-shadow duration-300"
											initial={{ opacity: 0, y: 50 }}
											whileInView={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.5,
												delay: index * 0.1,
											}}
											viewport={{ once: true }}
										>
											<div className="flex-grow">
												<pkg.icon className="w-12 h-12 text-primary mb-6 mx-auto" />
												<h3 className="text-2xl font-poppins font-semibold text-center mb-3 text-primary">
													{pkg.name}
												</h3>
												<p className="text-4xl font-poppins font-bold text-center text-secondary mb-6">
													{pkg.price}
												</p>
												<ul className="space-y-3 mb-8 text-secondary">
													{pkg.features.map(
														(feature, fIndex) => (
															<li
																key={fIndex}
																className="flex items-start"
															>
																<CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
																<span>
																	{feature}
																</span>
															</li>
														),
													)}
												</ul>
											</div>
											<Link
												href="/contact"
												className="block w-full mt-auto text-center bg-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-primary/90 transition-colors duration-300"
											>
												Kontakt for booking
											</Link>
										</motion.div>
									))}
							</div>
						</div>
					</div>
				</section>

				{/* Additional Information Section */}
				<section className="py-16 lg:py-24 bg-muted">
					<div className="container mx-auto px-6 space-y-12">
						<motion.div
							className="bg-white p-8 rounded-lg shadow-lg border border-border"
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
						>
							<div className="flex items-center text-primary mb-4">
								<Sun className="w-8 h-8 mr-3" />
								<h3 className="text-2xl font-poppins font-semibold">
									Min Fotograferingsfilosofi
								</h3>
							</div>
							<p className="text-secondary leading-relaxed">
								"Bildene forteller en historie - av alle unike
								små og store øyeblikkene. Lys er noe, som
								påvirker stemningen på bildene mest. Jo lavere
								sola er, desto finere og mykere fargene blir.
								Derfor unngår jeg fotografering midt på dagen.
								Jeg pleier å bli bedre kjent både med dere og
								området for å velge beste omgivelsene til deres
								ønsker og behov."
							</p>
						</motion.div>

						<motion.div
							className="bg-white p-8 rounded-lg shadow-lg border border-border"
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
						>
							<div className="flex items-center text-primary mb-4">
								<Info className="w-8 h-8 mr-3" />
								<h3 className="text-2xl font-poppins font-semibold">
									Viktig Informasjon
								</h3>
							</div>
							<p className="text-secondary leading-relaxed">
								"Ventetid for redigerte bilder er opptil 3 uker.
								Jeg får 8 NOK per kilometer hvis fotografering
								er utendørs eller i et spesielt bestemt sted.
								Jeg reserverer retten til å bruke bildene som en
								del av min markedsføring. Jeg tar 50%
								forskuddsbetaling som ikke blir returnert om
								kunden ombestemmer seg. Det er mulig å kjøpe mer
								enn 5 bilder fra basis tilbud - 200 NOK per
								hvert ekstra bilde."
							</p>
						</motion.div>
					</div>
				</section>
			</main>

			<Footer />
		</>
	);
}

// Need to add Link to wouter if not already available globally from another import
// For now, assuming Link from wouter is available. If not, add:
// import { Link } from 'wouter';
// at the top.
