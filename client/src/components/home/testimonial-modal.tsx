import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { TestimonialForm } from '@/components/home/testimonial-form';
import { Button } from '@/components/ui/button';
import { PenLine } from 'lucide-react';
import { useState } from 'react';

export function TestimonialModal() {
	const [isOpen, setIsOpen] = useState(false);

	// Close modal after successful submission
	const handleSuccess = () => {
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="mt-8" variant="outline">
					<PenLine className="mr-2 h-4 w-4" />
					Del Din Opplevelse
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Send Inn en Anmeldelse</DialogTitle>
					<DialogDescription>
						Del din erfaring med FotoDS. Alle anmeldelser blir
						moderert før publisering.
					</DialogDescription>
				</DialogHeader>
				<TestimonialForm onSuccess={handleSuccess} />
			</DialogContent>
		</Dialog>
	);
}
