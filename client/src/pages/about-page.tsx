import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AboutSection } from '@/components/about/about-section';
import { Testimonials } from '@/components/home/testimonials';
import { motion } from 'framer-motion';

export default function AboutPage() {
	// Scroll to top on page load
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<>
			<Helmet>
				<title>Om Meg | FotoDS - Dawid Siedlec Fotografi</title>
				<meta
					name="description"
					content="Lær om Dawid Siedlec, profesjonell interiør- og arkitekturfotograf basert i Norge. Med over et tiår med erfaring i å fange vakre rom."
				/>
				<meta
					property="og:title"
					content="Om Meg | FotoDS - Dawid Siedlec Fotografi"
				/>
				<meta
					property="og:description"
					content="Lær om Dawid Siedlec, profesjonell interiør- og arkitekturfotograf basert i Norge. Med over et tiår med erfaring i å fange vakre rom."
				/>
				<meta property="og:type" content="website" />
			</Helmet>

			<Header />

			<main>
				{/* About Hero */}
				<section className="pt-32 pb-12 bg-muted">
					<div className="container mx-auto px-6">
						<motion.div
							className="text-center max-w-3xl mx-auto"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<h1 className="text-4xl md:text-5xl font-poppins font-semibold mb-6">
								Om Meg
							</h1>
							<p className="text-secondary text-lg">
								Bli kjent med personen bak linsen og min
								tilnærming til interiørfotografering.
							</p>
						</motion.div>
					</div>
				</section>

				{/* About Content */}
				<AboutSection showHeroImage={true} />

				{/* Additional About Section */}
				<section className="py-20 bg-muted">
					<div className="container mx-auto px-6">
						<div className="max-w-3xl mx-auto">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}
								viewport={{ once: true }}
							>
								<h2 className="text-3xl font-poppins font-semibold mb-6">
									Min Filosofi
								</h2>
								<p className="text-secondary mb-6 leading-relaxed">
									Jeg tror at flott interiørfotografering
									handler om mer enn bare å dokumentere et
									rom—det handler om å fange dets essens,
									karakter og følelsen det vekker. Hvert rom
									forteller en historie, og mitt oppdrag er å
									formidle den fortellingen gjennom nøye
									komponerte, vakkert belyste bilder.
								</p>
								<p className="text-secondary mb-6 leading-relaxed">
									Med hvert prosjekt streber jeg etter å
									fremheve de unike egenskapene og
									designelementene som gjør et rom spesielt.
									Enten det er måten naturlig lys strømmer
									gjennom vinduer, teksturen til materialer,
									eller de gjennomtenkte detaljene i
									interiørdesign, sørger jeg for at disse
									aspektene skinner i fotografiene mine.
								</p>
								<p className="text-secondary leading-relaxed">
									Min tekniske tilnærming kombinerer
									tradisjonelle fotograferingsferdigheter med
									moderne digitale teknikker, noe som gjør at
									jeg kan levere bilder som er både autentiske
									for rommet og optimalisert for deres
									tiltenkte bruk, enten det er for
									eiendomsoppføringer, designporteføljer eller
									arkitekturpublikasjoner.
								</p>
							</motion.div>
						</div>
					</div>
				</section>

				{/* Testimonials */}
				<Testimonials />
			</main>

			<Footer />
		</>
	);
}
