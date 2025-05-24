import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { insertTestimonialSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star } from 'lucide-react';

// Create form schema based on the database schema but only include what the user needs to fill out
const testimonialFormSchema = z.object({
	name: z.string().min(2, { message: 'Navn må være minst 2 tegn.' }),
	role: z.string().optional(),
	content: z
		.string()
		.min(10, { message: 'Anmeldelse må være minst 10 tegn.' })
		.max(500, { message: 'Anmeldelse kan ikke overstige 500 tegn.' }),
	rating: z.number().min(1).max(5).default(5),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

export function TestimonialForm({ onSuccess }: { onSuccess?: () => void }) {
	const { toast } = useToast();
	const [charCount, setCharCount] = useState(0);

	// Define form
	const form = useForm<TestimonialFormValues>({
		resolver: zodResolver(testimonialFormSchema),
		defaultValues: {
			name: '',
			role: '',
			content: '',
			rating: 5,
		},
	});

	// Simple star rating component
	const StarRating = ({
		value,
		onChange,
	}: {
		value: number;
		onChange: (value: number) => void;
	}) => {
		return (
			<div className="flex space-x-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						onClick={() => onChange(star)}
						className="focus:outline-none"
					>
						<Star
							className={`w-6 h-6 ${
								star <= value
									? 'text-yellow-400 fill-yellow-400'
									: 'text-gray-300'
							}`}
						/>
					</button>
				))}
			</div>
		);
	};

	// Handle testimonial submission
	const mutation = useMutation({
		mutationFn: async (data: TestimonialFormValues) => {
			// Set isActive false for moderation (rating is already in the form data)
			const testimonialData = {
				...data,
				isActive: false,
			};

			const res = await apiRequest(
				'POST',
				'/api/testimonials/submit',
				testimonialData,
			);
			return await res.json();
		},
		onSuccess: () => {
			toast({
				title: 'Takk for din anmeldelse!',
				description: 'Din anmeldelse er sendt inn for gjennomgang.',
			});

			// Invalidate testimonials cache
			queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });

			// Reset form
			form.reset();
			setCharCount(0);

			// Call success callback if provided
			if (onSuccess) {
				onSuccess();
			}
		},
		onError: (error: Error) => {
			toast({
				title: 'Innsending feilet',
				description:
					error.message || 'Noe gikk galt. Vennligst prøv igjen.',
				variant: 'destructive',
			});
		},
	});

	// Handle form submission
	function onSubmit(data: TestimonialFormValues) {
		mutation.mutate(data);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ditt Navn</FormLabel>
							<FormControl>
								<Input
									placeholder="Skriv inn navnet ditt"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Stilling / Bedrift</FormLabel>
							<FormControl>
								<Input
									placeholder="f.eks. Interiørdesigner hos Studio X"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Din Anmeldelse</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Del din erfaring med FotoDS..."
									className="resize-none min-h-[100px]"
									{...field}
									onChange={(e) => {
										field.onChange(e);
										setCharCount(e.target.value.length);
									}}
								/>
							</FormControl>
							<FormDescription className="flex justify-end text-xs">
								{charCount}/500 tegn
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="rating"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Din Vurdering</FormLabel>
							<FormControl>
								<StarRating
									value={field.value}
									onChange={(rating) =>
										field.onChange(rating)
									}
								/>
							</FormControl>
							<FormDescription>
								Klikk på stjernene for å velge din vurdering
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full"
					disabled={mutation.isPending}
				>
					{mutation.isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Sender inn...
						</>
					) : (
						'Send Inn Anmeldelse'
					)}
				</Button>
			</form>
		</Form>
	);
}
