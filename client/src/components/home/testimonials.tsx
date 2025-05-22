import { useQuery } from '@tanstack/react-query';
import { Testimonial } from '@shared/schema';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { TestimonialModal } from '@/components/home/testimonial-modal';

export function Testimonials() {
	const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
		queryKey: ['/api/testimonials'],
	});

	return (
		<section className="py-20 bg-accent">
			<div className="container mx-auto px-6">
				<h2 className="text-3xl font-poppins font-semibold text-center mb-16">
					Kundeanmeldelser
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{isLoading ? (
						// Loading state with skeletons
						Array.from({ length: 3 }).map((_, index) => (
							<TestimonialSkeleton key={index} />
						))
					) : testimonials?.length ? (
						// Render actual testimonials
						testimonials.map((testimonial, index) => (
							<TestimonialCard
								key={testimonial.id}
								testimonial={testimonial}
								index={index}
							/>
						))
					) : (
						// No testimonials state
						<div className="col-span-1 md:col-span-3 text-center py-10">
							<p className="text-secondary">
								Ingen kundeanmeldelser tilgjengelig ennå.
							</p>
						</div>
					)}
				</div>

				{/* Add testimonial submission button and modal */}
				<div className="flex justify-center mt-8">
					<TestimonialModal />
				</div>
			</div>
		</section>
	);
}

function TestimonialCard({
	testimonial,
	index,
}: {
	testimonial: Testimonial;
	index: number;
}) {
	return (
		<motion.div
			className="bg-white p-8 shadow-sm"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			viewport={{ once: true }}
		>
			<div className="flex items-center mb-6">
				<div className="text-yellow-400 flex">
					{Array.from({ length: testimonial.rating }).map((_, i) => (
						<Star key={i} className="fill-current" size={18} />
					))}
				</div>
			</div>
			<p className="text-secondary italic mb-6">
				"{testimonial.content}"
			</p>
			<div className="flex items-center">
				<div>
					<p className="font-medium">{testimonial.name}</p>
					<p className="text-secondary text-sm">{testimonial.role}</p>
				</div>
			</div>
		</motion.div>
	);
}

function TestimonialSkeleton() {
	return (
		<div className="bg-white p-8 shadow-sm">
			<div className="mb-6">
				<Skeleton className="h-5 w-24" />
			</div>
			<Skeleton className="h-4 w-full mb-2" />
			<Skeleton className="h-4 w-full mb-2" />
			<Skeleton className="h-4 w-3/4 mb-6" />
			<div>
				<Skeleton className="h-5 w-32 mb-2" />
				<Skeleton className="h-4 w-24" />
			</div>
		</div>
	);
}
