import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { motion } from 'framer-motion';
import {
	CheckCircle,
	Camera,
	Users,
	Gift,
	Sun,
	Info,
	Home,
	Plane,
	Video,
	Settings,
} from 'lucide-react';
import { Link } from 'wouter';

const pricingPackages = [
	{
		category: 'Eiendomsfotografering',
		name: 'Liten pakke',
		price: '4500 NOK',
		features: [
			'20 bilder +',
			'1 drone foto',
			'2 maste foto',
			'Plantegning 2D',
		],
		icon: Home,
	},
	{
		category: 'Eiendomsfotografering',
		name: 'Medium pakke',
		price: '7500 NOK',
		features: [
			'30 bilder +',
			'2 maste foto',
			'2 drone foto',
			'Plantegning 2D',
		],
		icon: Home,
	},
	{
		category: 'Eiendomsfotografering',
		name: 'Premium pakke',
		price: '10000 NOK',
		features: [
			'45 bilder +',
			'2 maste foto',
			'5 drone bilder',
			'5 kvelds bilder',
			'Plantegning 2D',
		],
		icon: Home,
		popular: true,
	},
	{
		category: 'Tilleggstjenester',
		name: 'Plantegning 2D',
		price: '400 NOK',
		features: ['Plantegning 2D'],
		icon: Settings,
	},
	{
		category: 'Tilleggstjenester',
		name: 'Plantegning 3D',
		price: '1000 NOK',
		features: ['Plantegning 3D'],
		icon: Settings,
	},
];

const extraServices = [
	{
		name: 'Kvelds bilder',
		items: [
			{ description: 'Sommerhalvåret', price: '4500 NOK' },
			{ description: 'Vinterhalvåret', price: '3000 NOK' },
		],
	},
	{
		name: 'Drone Bilder',
		items: [{ description: '5 bilder', price: '3000 NOK' }],
	},
	{
		name: 'Video tjenester',
		items: [
			{
				description: '30 sekunders video presentasjon av bolig',
				price: '2000 NOK',
			},
			{
				description:
					'60 sekunders video presentasjon av bolig med drone video inkludert',
				price: '3500 NOK',
			},
		],
	},
	{
		name: 'Andre tjenester',
		items: [
			{ description: 'Nøkkel henting', price: '300 NOK' },
			{ description: 'Avbestilling samme dag', price: '1500 NOK' },
		],
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
					content="Oversikt over priser og pakker for eiendomsfotografering og tilleggstjenester hos FotoDS."
				/>
				<meta
					property="og:title"
					content="Priser | FotoDS - Dawid Siedlec Fotografi"
				/>
				<meta
					property="og:description"
					content="Oversikt over priser og pakker for eiendomsfotografering og tilleggstjenester hos FotoDS."
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
							Profesjonell eiendomsfotografering med fleksible
							pakker tilpasset dine behov. Alle priser inkluderer
							mva.
						</motion.p>
					</div>
				</motion.section>

				{/* Pricing Packages Section */}
				<section className="py-16 lg:py-24 bg-background">
					<div className="container mx-auto px-6">
						{/* Eiendomsfotografering Packages */}
						<div className="mb-16">
							<h2 className="text-3xl font-poppins font-semibold text-center mb-12 text-primary">
								Eiendomsfotografering
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
								{pricingPackages
									.filter(
										(pkg) =>
											pkg.category ===
											'Eiendomsfotografering',
									)
									.map((pkg, index) => (
										<motion.div
											key={index}
											className={`bg-white rounded-lg shadow-xl p-6 flex flex-col border hover:shadow-2xl transition-shadow duration-300 ${
												pkg.popular
													? 'border-primary border-2 relative'
													: 'border-border'
											}`}
											initial={{ opacity: 0, y: 50 }}
											whileInView={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.5,
												delay: index * 0.1,
											}}
											viewport={{ once: true }}
										>
											{pkg.popular && (
												<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
													<span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
														Populær
													</span>
												</div>
											)}
											<div className="flex-grow">
												<pkg.icon className="w-10 h-10 text-primary mb-4 mx-auto" />
												<h3 className="text-xl font-poppins font-semibold text-center mb-2 text-primary">
													{pkg.name}
												</h3>
												<p className="text-3xl font-poppins font-bold text-center text-secondary mb-4">
													{pkg.price}
												</p>
												<ul className="space-y-2 mb-6 text-secondary text-sm">
													{pkg.features.map(
														(feature, fIndex) => (
															<li
																key={fIndex}
																className="flex items-start"
															>
																<CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
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
												className="block w-full mt-auto text-center bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary/90 transition-colors duration-300 text-sm"
											>
												Kontakt for booking
											</Link>
										</motion.div>
									))}
							</div>
						</div>

						{/* Tilleggstjenester */}
						<div className="mb-16">
							<h2 className="text-3xl font-poppins font-semibold text-center mb-12 text-primary">
								Tilleggstjenester
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
								{pricingPackages
									.filter(
										(pkg) =>
											pkg.category ===
											'Tilleggstjenester',
									)
									.map((pkg, index) => (
										<motion.div
											key={index}
											className="bg-white rounded-lg shadow-xl p-6 flex flex-col border border-border hover:shadow-2xl transition-shadow duration-300"
											initial={{ opacity: 0, y: 50 }}
											whileInView={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.5,
												delay: index * 0.1,
											}}
											viewport={{ once: true }}
										>
											<div className="flex-grow">
												<pkg.icon className="w-10 h-10 text-primary mb-4 mx-auto" />
												<h3 className="text-xl font-poppins font-semibold text-center mb-2 text-primary">
													{pkg.name}
												</h3>
												<p className="text-3xl font-poppins font-bold text-center text-secondary mb-4">
													{pkg.price}
												</p>
												<ul className="space-y-2 mb-6 text-secondary text-sm">
													{pkg.features.map(
														(feature, fIndex) => (
															<li
																key={fIndex}
																className="flex items-start"
															>
																<CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
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
												className="block w-full mt-auto text-center bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary/90 transition-colors duration-300 text-sm"
											>
												Kontakt for booking
											</Link>
										</motion.div>
									))}
							</div>
						</div>

						{/* Extra Services */}
						<div>
							<h2 className="text-3xl font-poppins font-semibold text-center mb-12 text-primary">
								Ekstra Tjenester
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{extraServices.map((service, index) => (
									<motion.div
										key={index}
										className="bg-white rounded-lg shadow-lg p-6 border border-border"
										initial={{ opacity: 0, y: 30 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.5,
											delay: index * 0.1,
										}}
										viewport={{ once: true }}
									>
										<h3 className="text-xl font-poppins font-semibold mb-4 text-primary">
											{service.name}
										</h3>
										<div className="space-y-3">
											{service.items.map(
												(item, itemIndex) => (
													<div
														key={itemIndex}
														className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
													>
														<span className="text-secondary">
															{item.description}
														</span>
														<span className="font-semibold text-primary">
															{item.price}
														</span>
													</div>
												),
											)}
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Additional Information Section */}
				{/* <section className="py-16 lg:py-24 bg-muted">
					<div className="container mx-auto px-6 space-y-12">
						<motion.div
							className="bg-white p-8 rounded-lg shadow-lg border border-border"
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
						>
							<div className="flex items-center text-primary mb-4">
								<Home className="w-8 h-8 mr-3" />
								<h3 className="text-2xl font-poppins font-semibold">
									Eiendomsfotografering
								</h3>
							</div>
							<p className="text-secondary leading-relaxed">
								"Profesjonell eiendomsfotografering som
								fremhever eiendommens beste egenskaper. Jeg
								fokuserer på optimal lysbruk og komposisjon for
								å skape innbydende bilder som fanger kjøpernes
								oppmerksomhet. Hver eiendom fotograferes med
								omhu for å vise frem rommenes potensial og
								atmosfære."
							</p>
						</motion.div> */}

				{/* <motion.div
							className="bg-white p-8 rounded-lg shadow-lg border border-border"
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
						>
							<div className="flex items-center text-primary mb-4">
								<Info className="w-8 h-8 mr-3" />
								<h3 className="text-2xl font-poppins font-semibold">
									Transportkostnader
								</h3>
							</div>
							<p className="text-secondary leading-relaxed mb-4">
								Fotografen fakturerer kjøring med 5 kr per
								kilometer tur- retur.
							</p>
							<p className="text-secondary leading-relaxed text-sm">
								Evt. Bompenger og parkering kommer i tillegg
								etter kvittering.
							</p>
						</motion.div> */}

				{/* <motion.div
							className="bg-white p-8 rounded-lg shadow-lg border border-border"
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
						>
							<div className="flex items-center text-primary mb-4">
								<Info className="w-8 h-8 mr-3" />
								<h3 className="text-2xl font-poppins font-semibold">
									Viktig Informasjon
								</h3>
							</div>
							<div className="text-secondary leading-relaxed space-y-2 text-sm">
								<p>• Alle priser inkluderer mva.</p>
								<p>
									• Fotografen fakturerer kjøring med 5 kr per
									kilometer tur- retur.
								</p>
								<p>
									• Evt. Bompenger og parkering kommer i
									tillegg etter kvittering.
								</p>
								<p>
									• Bilder leveres senest neste dag.
									Fredagsfoto leveres i løpet av helgen hvis
									ikke annet blir avtalt!
								</p>
								<p>
									• 50% forskuddsbetaling som ikke blir
									returnert om kunden ombestemmer seg.
								</p>
								<p>
									• Leiligheter som ikke er foto klar når
									fotograf kommer faktureres med kr 500,-
									ekstra for tid som går med til rydding.
								</p>
								<p>
									• Er boligen ikke foto klar i det hele tatt
									faktureres kr 2500,- for avlyst oppdrag!
								</p>
							</div>
						</motion.div> */}
				{/* </div>
				</section> */}
			</main>

			<Footer />
		</>
	);
}

// Need to add Link to wouter if not already available globally from another import
// For now, assuming Link from wouter is available. If not, add:
// import { Link } from 'wouter';
// at the top.
