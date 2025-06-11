import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { services } from '@/lib/services';

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
					<h2 className="text-3xl font-poppins font-semibold mb-8">
						Drone • Foto • Video
					</h2>
				</motion.div>

				<div className="grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
					{services.map((service, index) => (
						<Link href={service.href} key={index}>
							<motion.div
								className="p-2 md:p-6 rounded-lg text-center hover:bg-muted transition-colors duration-300 cursor-pointer"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.6,
									delay: index * 0.1,
								}}
								viewport={{ once: true }}
							>
								<img
									src={service.icon}
									alt={`${service.title} icon`}
									className="h-8 w-8 md:h-10 w-10 mx-auto mb-2 md:mb-4"
								/>
								<h3 className="text-sm md:text-xl font-poppins font-semibold">
									{service.title}
								</h3>
							</motion.div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
