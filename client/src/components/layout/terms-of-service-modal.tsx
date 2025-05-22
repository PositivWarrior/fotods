import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TermsOfServiceModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function TermsOfServiceModal({
	isOpen,
	onClose,
}: TermsOfServiceModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Bruksvilkår</DialogTitle>
					<DialogDescription>
						Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}
					</DialogDescription>
				</DialogHeader>
				<div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
					<p>
						Velkommen til FotoDS. Ved å bruke vår nettside og våre
						tjenester, aksepterer du å være bundet av følgende
						bruksvilkår. Vennligst les dem nøye.
					</p>
					<h3 className="font-semibold text-lg">
						1. Aksept av Vilkår
					</h3>
					<p>
						Ved å få tilgang til eller bruke Tjenesten, godtar du å
						være bundet av disse Vilkårene. Hvis du er uenig i noen
						del av vilkårene, kan du ikke få tilgang til Tjenesten.
					</p>
					<h3 className="font-semibold text-lg">
						2. Bruk av Tjenesten
					</h3>
					<p>
						Du samtykker i å ikke bruke tjenesten til ulovlige
						formål eller på en måte som kan skade, deaktivere,
						overbelaste eller svekke tjenesten.
					</p>
					<h3 className="font-semibold text-lg">
						3. Immaterielle Rettigheter
					</h3>
					<p>
						Tjenesten og dens opprinnelige innhold, funksjoner og
						funksjonalitet er og vil forbli den eksklusive
						eiendommen til FotoDS og dets lisensgivere. Alt
						materiale på dette nettstedet, inkludert, men ikke
						begrenset til, bilder, tekst, logoer, er beskyttet av
						opphavsrett.
					</p>
					<h3 className="font-semibold text-lg">
						4. Ansvarsfraskrivelse
					</h3>
					<p>
						Tjenestene leveres "SOM DE ER" og "SOM TILGJENGELIG"
						uten garantier av noe slag, enten uttrykkelig eller
						underforstått.
					</p>
					<h3 className="font-semibold text-lg">
						5. Ansvarsbegrensning
					</h3>
					<p>
						Under ingen omstendigheter skal FotoDS, eller dets
						direktører, ansatte, partnere, agenter, leverandører
						eller tilknyttede selskaper, være ansvarlig for noen
						indirekte, tilfeldige, spesielle, følgeskader eller
						straffbare skader, inkludert uten begrensning, tap av
						fortjeneste, data, bruk, goodwill eller andre
						immaterielle tap.
					</p>
					<h3 className="font-semibold text-lg">
						6. Endringer i Vilkårene
					</h3>
					<p>
						Vi forbeholder oss retten til, etter eget skjønn, å
						endre eller erstatte disse Vilkårene når som helst. Det
						er ditt ansvar å sjekke disse Vilkårene periodisk for
						endringer.
					</p>
					<h3 className="font-semibold text-lg">7. Kontakt Oss</h3>
					<p>
						Hvis du har spørsmål om disse Vilkårene, vennligst
						kontakt oss.
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
