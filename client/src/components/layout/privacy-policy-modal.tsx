import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PrivacyPolicyModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function PrivacyPolicyModal({
	isOpen,
	onClose,
}: PrivacyPolicyModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Personvernerklæring</DialogTitle>
					<DialogDescription>
						Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}
					</DialogDescription>
				</DialogHeader>
				<div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
					<p>
						Velkommen til FotoDS sin personvernerklæring. Din
						personvern er viktig for oss. Denne erklæringen
						forklarer hvordan vi samler inn, bruker, deler og
						beskytter din personlige informasjon når du besøker vår
						nettside.
					</p>
					<h3 className="font-semibold text-lg">
						Informasjonsinnsamling
					</h3>
					<p>
						Vi kan samle inn personlig identifiserbar informasjon,
						slik som ditt navn, e-postadresse, telefonnummer, etc.,
						når du frivillig sender den til oss gjennom
						kontaktskjemaer eller ved registrering for våre
						tjenester.
					</p>
					<h3 className="font-semibold text-lg">
						Bruk av Informasjon
					</h3>
					<p>Informasjonen vi samler inn kan brukes til å:</p>
					<ul className="list-disc list-inside space-y-1">
						<li>Tilby og forbedre våre tjenester</li>
						<li>
							Svare på dine henvendelser og kommunisere med deg
						</li>
						<li>
							Sende deg nyhetsbrev eller markedsføringsmateriell
							(hvis du har samtykket)
						</li>
						<li>
							Analysere nettsidebruk for å forbedre
							brukeropplevelsen
						</li>
					</ul>
					<h3 className="font-semibold text-lg">
						Deling av Informasjon
					</h3>
					<p>
						Vi selger, bytter eller på annen måte overfører ikke din
						personlig identifiserbare informasjon til utenforstående
						parter uten ditt samtykke, med unntak av pålitelige
						tredjeparter som hjelper oss med å drive nettstedet vårt
						eller utføre vår virksomhet, så lenge disse partene
						godtar å holde denne informasjonen konfidensiell.
					</p>
					<h3 className="font-semibold text-lg">
						Informasjonssikkerhet
					</h3>
					<p>
						Vi implementerer en rekke sikkerhetstiltak for å
						opprettholde sikkerheten til din personlige informasjon.
					</p>
					<h3 className="font-semibold text-lg">Dine Rettigheter</h3>
					<p>
						Du har rett til å be om innsyn, retting eller sletting
						av dine personopplysninger. Kontakt oss for å utøve
						disse rettighetene.
					</p>
					<h3 className="font-semibold text-lg">
						Endringer i Personvernerklæringen
					</h3>
					<p>
						Vi kan oppdatere denne personvernerklæringen fra tid til
						annen. Vi vil varsle deg om eventuelle endringer ved å
						publisere den nye personvernerklæringen på denne siden.
					</p>
					<h3 className="font-semibold text-lg">Kontakt Oss</h3>
					<p>
						Hvis du har spørsmål angående denne
						personvernerklæringen, kan du kontakte oss via
						kontaktskjemaet på nettsiden.
					</p>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Lukk
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
