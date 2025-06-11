import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { services } from '@/lib/services';
import { ArrowRight } from 'lucide-react';

export function Introduction() {
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
					<h2 className="text-3xl font-poppins font-semibold mb-4">
						Drone • Foto • Video
					</h2>
					<p className="text-secondary text-lg leading-relaxed mb-12">
						Profesjonelle fototjenester som fremhever det beste i
						din eiendom.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{services.map((service, index) => (
						<motion.div
							key={index}
							className="bg-muted p-8 rounded-lg text-center flex flex-col"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
						>
							<img
								src={service.icon}
								alt={`${service.title} icon`}
								className="h-12 w-12 mx-auto mb-6 text-primary"
							/>
							<h3 className="text-2xl font-poppins font-semibold mb-4">
								{service.title}
							</h3>
							<p className="text-secondary leading-relaxed mb-6 flex-grow">
								{service.description}
							</p>
							<Link
								href={service.href}
								className="text-primary font-semibold hover:text-primary/80 transition-colors self-end mt-auto"
							>
								Se Galleri{' '}
								<ArrowRight className="inline-block h-4 w-4 ml-1" />
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
