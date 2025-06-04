import { motion } from 'framer-motion';
import { Instagram, Facebook } from 'lucide-react';

export function Introduction() {
	const stats = [
		{ value: '150+', label: 'Prosjekter Fullført' },
		// { value: '98%', label: 'Kundetilfredshet' },
		{ value: '4+', label: 'Års Erfaring' },
	];

	return (
		<section className="py-20 bg-white">
			<div className="container mx-auto px-6">
				<motion.div
					className="max-w-3xl mx-auto text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<h2 className="text-3xl font-poppins font-semibold mb-6">
						Velkommen til FotoDS
					</h2>
					<p className="text-secondary text-lg leading-relaxed mb-10">
						Spesialisert innen interiør- og arkitekturfotografering,
						skaper jeg imponerende visuelle fortellinger som
						fremhever eiendommer i sitt beste lys. Med nøye
						oppmerksomhet på komposisjon, lyssetting og detaljer,
						hjelper bildene mine eiendommer å skille seg ut i et
						konkurranseutsatt marked.
					</p>

					<div className="flex justify-center space-x-4">
						<a
							href="https://www.instagram.com/fotods.no/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-secondary hover:text-primary transition-colors"
							aria-label="Instagram"
						>
							<Instagram size={28} />
						</a>
						<a
							href="https://www.facebook.com/fotods.no"
							target="_blank"
							rel="noopener noreferrer"
							className="text-secondary hover:text-primary transition-colors"
							aria-label="Facebook"
						>
							<Facebook size={28} />
						</a>
					</div>

					<div className="flex flex-wrap justify-center gap-8">
						{stats.map((stat, index) => (
							<motion.div
								key={index}
								className="text-center"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.6,
									delay: index * 0.1,
								}}
								viewport={{ once: true }}
							>
								{/* <span className="block text-4xl font-semibold mb-2">
									{stat.value}
								</span>
								<span className="text-secondary">
									{stat.label}
								</span> */}
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
