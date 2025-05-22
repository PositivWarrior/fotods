import { Link } from 'wouter';
import { Instagram, Facebook, Linkedin, Github, Globe } from 'lucide-react';
import { useState } from 'react';
import { PrivacyPolicyModal } from './privacy-policy-modal';
import { TermsOfServiceModal } from './terms-of-service-modal.tsx';

export function Footer() {
	const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
	const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

	return (
		<footer className="bg-secondary text-white py-12">
			<div className="container mx-auto px-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-10">
					<div className="col-span-1 md:col-span-2">
						<Link
							href="/"
							className="text-2xl font-poppins font-semibold tracking-wider mb-6 block"
						>
							FotoDS
						</Link>
						<p className="text-white/80 mb-6 max-w-sm">
							Spesialiserte interiørfototjenester som fanger
							essensen av arkitektoniske rom. Gir interiører liv
							gjennom linsen.
						</p>
						<div className="flex space-x-4">
							<a
								href="https://www.instagram.com/fotods.no/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-white/80 hover:text-white transition-colors"
								aria-label="Instagram"
							>
								<Instagram size={20} />
							</a>
							<a
								href="https://www.facebook.com/fotods.no"
								target="_blank"
								rel="noopener noreferrer"
								className="text-white/80 hover:text-white transition-colors"
								aria-label="Facebook"
							>
								<Facebook size={20} />
							</a>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-medium mb-4">
							Hurtiglenker
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/"
									className="text-white/80 hover:text-white transition-colors"
								>
									Hjem
								</Link>
							</li>
							<li>
								<Link
									href="/portfolio"
									className="text-white/80 hover:text-white transition-colors"
								>
									Portefølje
								</Link>
							</li>
							<li>
								<Link
									href="/portfolio/housing"
									className="text-white/80 hover:text-white transition-colors"
								>
									Bolig
								</Link>
							</li>
							<li>
								<Link
									href="/portfolio/business"
									className="text-white/80 hover:text-white transition-colors"
								>
									Næring
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="text-white/80 hover:text-white transition-colors"
								>
									Om Oss
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-white/80 hover:text-white transition-colors"
								>
									Kontakt
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-medium mb-4">
							Laget og Utviklet av
						</h3>
						<p className="text-white/80 mb-2">Kacper Margol</p>
						<ul className="space-y-2">
							<li>
								<a
									href="https://www.linkedin.com/in/kacper-margol-545493195/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
								>
									<Linkedin size={16} />
									<span>LinkedIn</span>
								</a>
							</li>
							<li>
								<a
									href="https://github.com/PositivWarrior"
									target="_blank"
									rel="noopener noreferrer"
									className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
								>
									<Github size={16} />
									<span>GitHub</span>
								</a>
							</li>
							<li>
								<a
									href="https://kacpermargol.eu/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
								>
									<Globe size={16} />
									<span>Portefølje</span>
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
					<p className="text-white/60 text-sm">
						© {new Date().getFullYear()} FotoDS. Alle rettigheter
						forbeholdt.
					</p>
					<div className="flex space-x-6 mt-4 md:mt-0">
						<button
							onClick={() => setIsPrivacyModalOpen(true)}
							className="text-white/60 text-sm hover:text-white transition-colors cursor-pointer"
						>
							Personvernerklæring
						</button>
						<button
							onClick={() => setIsTermsModalOpen(true)}
							className="text-white/60 text-sm hover:text-white transition-colors cursor-pointer"
						>
							Bruksvilkår
						</button>
					</div>
				</div>
			</div>

			<PrivacyPolicyModal
				isOpen={isPrivacyModalOpen}
				onClose={() => setIsPrivacyModalOpen(false)}
			/>
			<TermsOfServiceModal
				isOpen={isTermsModalOpen}
				onClose={() => setIsTermsModalOpen(false)}
			/>
		</footer>
	);
}
