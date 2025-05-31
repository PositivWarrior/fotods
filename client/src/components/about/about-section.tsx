import { Camera, Lightbulb, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import dawidImage from '../../assets/Dawid_hero.jpg';

export function AboutSection() {
	const features = [
		{
			icon: <Camera className="text-primary" />,
			title: 'Profesjonelt Utstyr',
			description:
				'Canon profesjonelle kameraer og førsteklasses objektiver for eksepsjonell bildekvalitet',
		},
		{
			icon: <Lightbulb className="text-primary" />,
			title: 'Lysbeherskelse',
			description:
				'Ekspertkontroll av naturlig og kunstig belysning for å vise frem rom på sitt beste',
		},
		{
			icon: <Edit className="text-primary" />,
			title: 'Presisjonsredigering',
			description:
				'Nøyaktig etterbehandling for å oppnå perfekt farge, kontrast og komposisjon',
		},
	];

	return (
		<section className="py-20 bg-white">
			<div className="container mx-auto px-6">
				<motion.div
					className="w-full lg:w-3/4 xl:w-2/3 mx-auto"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<h2 className="text-3xl font-poppins font-semibold mb-6 text-center md:text-left">
						Om Meg
					</h2>
					<p className="text-secondary mb-6 leading-relaxed">
						Hei! Jeg er{' '}
						<span className="font-semibold text-primary">
							Dawid Siedlec
						</span>
						, en lidenskapelig interiør- og arkitekturfotograf
						basert i Norge. Med over fire år med erfaring i å fange
						rom, har jeg utviklet et skarpt øye for detaljer og
						komposisjon som fremhever den sanne karakteren og
						skjønnheten i hvert miljø jeg fotograferer.
					</p>
					<p className="text-secondary mb-6 leading-relaxed">
						Min tilnærming kombinerer teknisk presisjon med
						kunstnerisk visjon, og sikrer at hvert bilde forteller
						en fengslende visuell historie. Hvert rom har sin egen
						unike atmosfære og personlighet - min jobb er å fange
						den essensen på en måte som appellerer til betrakteren.
					</p>
					<p className="text-secondary mb-8 leading-relaxed">
						Jeg jobber tett med eiendomsmeglere, interiørdesignere,
						arkitekter, bedriftseiere og huseiere for å skape
						fotografier som ikke bare viser frem eiendommer, men
						også vekker følelser og skaper varige inntrykk.
					</p>

					<div className="space-y-4 mb-8">
						{features.map((feature, index) => (
							<motion.div
								key={index}
								className="flex items-center"
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.4,
									delay: index * 0.1,
								}}
								viewport={{ once: true }}
							>
								<div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
									{feature.icon}
								</div>
								<div>
									<h3 className="font-poppins font-medium">
										{feature.title}
									</h3>
									<p className="text-secondary text-sm">
										{feature.description}
									</p>
								</div>
							</motion.div>
						))}
					</div>

					<a
						href="#contact"
						className="inline-block px-8 py-3 bg-primary text-white hover:bg-primary/90 transition-colors duration-300"
					>
						Ta Kontakt
					</a>
				</motion.div>
			</div>
		</section>
	);
}
