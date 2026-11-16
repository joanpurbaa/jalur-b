/**
 * Ilustrasi garis SVG sederhana bernuansa indigo & slate.
 * Hanya untuk empty state bermakna, tanpa gradien dekoratif atau animasi.
 */
interface IllustrationProps {
	className?: string;
	primary?: string;
	secondary?: string;
}

export function CompassOrbSvg({ className = "w-20 h-20" }: IllustrationProps) {
	return (
		<svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden>
			<circle cx="48" cy="48" r="40" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />
			<circle cx="48" cy="48" r="24" fill="#FFFFFF" stroke="#6366F1" strokeWidth="1.75" />
			<polygon points="48,32 54,48 48,44 42,48" fill="#4F46E5" />
			<polygon points="48,64 54,48 48,52 42,48" fill="#CBD5E1" />
			<circle cx="48" cy="48" r="3" fill="#4F46E5" />
		</svg>
	);
}

export function VaultShieldSvg({ className = "w-20 h-20" }: IllustrationProps) {
	return (
		<svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden>
			<circle cx="48" cy="48" r="40" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />
			<path
				d="M48 22L70 31V48C70 63 60 72 48 76C36 72 26 63 26 48V31L48 22Z"
				fill="#FFFFFF"
				stroke="#4F46E5"
				strokeWidth="1.75"
			/>
			<path
				d="M39 49L45 55L57 42"
				stroke="#059669"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function EvidenceGallerySvg({ className = "w-20 h-20" }: IllustrationProps) {
	return (
		<svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden>
			<circle cx="48" cy="48" r="40" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />
			<rect
				x="24"
				y="28"
				width="48"
				height="40"
				rx="8"
				fill="#FFFFFF"
				stroke="#4F46E5"
				strokeWidth="1.75"
			/>
			<rect x="31" y="37" width="22" height="4" rx="2" fill="#4F46E5" />
			<rect x="31" y="46" width="34" height="3.5" rx="1.75" fill="#CBD5E1" />
			<rect x="31" y="54" width="26" height="3.5" rx="1.75" fill="#CBD5E1" />
		</svg>
	);
}

/** @deprecated Alias sementara hingga Fase 3 memperbarui SimulationIntro. */
export const ScenarioBridgeSvg = CompassOrbSvg;

