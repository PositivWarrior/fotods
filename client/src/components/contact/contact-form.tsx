import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertContactSchema } from '@shared/schema';
import { z } from 'zod';
import {
	MapPin,
	Phone,
	Mail,
	Instagram,
	Facebook,
	Linkedin,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

// Extend schema with validation rules
const contactFormSchema = insertContactSchema.extend({
	email: z.string().email('Vennligst skriv inn en gyldig e-postadresse'),
	message: z.string().min(10, 'Meldingen må være minst 10 tegn'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
	const { toast } = useToast();
	const [formSubmitted, setFormSubmitted] = useState(false);

	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			message: '',
		},
	});

	const { mutate: submitContact, isPending } = useMutation({
		mutationFn: async (data: ContactFormValues) => {
			const res = await apiRequest('POST', '/api/contact', data);
			return res.json();
		},
		onSuccess: () => {
			toast({
				title: 'Melding Sendt!',
				description:
					'Takk for meldingen din. Vi kommer tilbake til deg snart.',
			});
			form.reset();
			setFormSubmitted(true);
		},
		onError: (error: Error) => {
			toast({
				title: 'Feil',
				description:
					error.message ||
					'Kunne ikke sende melding. Vennligst prøv igjen.',
				variant: 'destructive',
			});
		},
	});

	function onSubmit(data: ContactFormValues) {
		submitContact(data);
	}

	return (
		<section id="contact" className="py-20 bg-white">
			<div className="container mx-auto px-6">
				<div className="max-w-4xl mx-auto">
					<h2 className="text-3xl font-poppins font-semibold text-center mb-16">
						Ta Kontakt
					</h2>

					<div className="flex flex-col md:flex-row">
						<motion.div
							className="md:w-1/2 md:pr-10 mb-10 md:mb-0"
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
						>
							<div className="space-y-8">
								<div>
									<h3 className="text-xl font-poppins font-medium mb-4">
										Kontaktinformasjon
									</h3>
									<div className="space-y-4">
										<div className="flex items-start">
											<MapPin className="text-primary mt-1 mr-3 h-5 w-5" />
											<p className="text-secondary">
												Ila Alle 76, 1605 Fredrikstad,
												Norge
											</p>
										</div>
										<div className="flex items-start">
											<Phone className="text-primary mt-1 mr-3 h-5 w-5" />
											<p className="text-secondary">
												+47 925 50 152
											</p>
										</div>
										<div className="flex items-start">
											<Mail className="text-primary mt-1 mr-3 h-5 w-5" />
											<p className="text-secondary">
												info@fotods.no
											</p>
										</div>
									</div>
								</div>

								<div>
									<h3 className="text-xl font-poppins font-medium mb-4">
										Følg Meg
									</h3>
									<div className="flex space-x-4">
										<a
											href="https://www.instagram.com/fotods.no/"
											target="_blank"
											rel="noopener noreferrer"
											className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-300"
											aria-label="Instagram"
										>
											<Instagram size={18} />
										</a>
										<a
											href="https://www.facebook.com/fotods.no"
											target="_blank"
											rel="noopener noreferrer"
											className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-300"
											aria-label="Facebook"
										>
											<Facebook size={18} />
										</a>
									</div>
								</div>
							</div>
						</motion.div>

						<motion.div
							className="md:w-1/2"
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
						>
							{formSubmitted ? (
								<div className="bg-accent p-8 text-center">
									<h3 className="text-xl font-medium mb-4">
										Takk!
									</h3>
									<p className="mb-4">
										Meldingen din er sendt.
									</p>
									<p>
										Vi kommer tilbake til deg så snart som
										mulig.
									</p>
									<Button
										className="mt-6"
										onClick={() => setFormSubmitted(false)}
									>
										Send Ny Melding
									</Button>
								</div>
							) : (
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="space-y-6"
									>
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Navn</FormLabel>
													<FormControl>
														<Input
															placeholder="Ditt navn"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														E-post
													</FormLabel>
													<FormControl>
														<Input
															type="email"
															placeholder="Din e-postadresse"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Telefon (valgfritt)
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Ditt telefonnummer (valgfritt)"
															{...field}
															value={
																field.value ??
																''
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="message"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Melding
													</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Fortell oss om prosjektet ditt..."
															rows={5}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Button
											type="submit"
											className="w-full py-3"
											disabled={isPending}
										>
											{isPending
												? 'Sender...'
												: 'Send Melding'}
										</Button>
									</form>
								</Form>
							)}
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
