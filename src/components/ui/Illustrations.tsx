import { useId } from "react";

interface IllustrationProps {
	className?: string;
	primary?: string;
	secondary?: string;
}

/**
 * Ilustrasi SVG geometris berlapis (tanpa aset berhak cipta) untuk
 * empty state, hero halaman, simulasi, dan onboarding.
 */
export function CompassOrbSvg({
	className = "w-28 h-28",
	primary = "#6366f1",
	secondary = "#a855f7",
}: IllustrationProps) {
	const id = useId().replace(/:/g, "");
	return (
		<svg viewBox="0 0 140 140" fill="none" className={className} aria-hidden>
			<defs>
				<linearGradient id={`orb-${id}`} x1="20" y1="16" x2="120" y2="124" gradientUnits="userSpaceOnUse">
					<stop stopColor={primary} />
					<stop offset="1" stopColor={secondary} />
				</linearGradient>
				<linearGradient id={`ring-${id}`} x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse">
					<stop stopColor={primary} stopOpacity="0.35" />
					<stop offset="1" stopColor={secondary} stopOpacity="0.08" />
				</linearGradient>
			</defs>
			<circle cx="70" cy="74" r="52" fill={`url(#ring-${id})`} />
			<ellipse cx="70" cy="122" rx="36" ry="6" fill={primary} fillOpacity="0.14" />
			<rect
				x="34"
				y="32"
				width="72"
				height="72"
				rx="24"
				fill={`url(#orb-${id})`}
			/>
			<rect
				x="40"
				y="36"
				width="60"
				height="22"
				rx="11"
				fill="#fff"
				fillOpacity="0.28"
			/>
			{/* Jarum kompas */}
			<polygon points="70,46 82,70 70,64 58,70" fill="#ffffff" />
			<polygon points="70,90 82,70 70,74 58,70" fill="#ffffff" fillOpacity="0.55" />
			<circle cx="70" cy="68" r="4.5" fill={primary} stroke="#fff" strokeWidth="2" />
			{/* Bintang dekor */}
			<path
				d="M112 30L114.5 35.5L120 38L114.5 40.5L112 46L109.5 40.5L104 38L109.5 35.5L112 30Z"
				fill={secondary}
			/>
			<circle cx="26" cy="48" r="4" fill={primary} fillOpacity="0.55" />
		</svg>
	);
}

export function VaultShieldSvg({
	className = "w-28 h-28",
	primary = "#10b981",
	secondary = "#0ea5e9",
}: IllustrationProps) {
	const id = useId().replace(/:/g, "");
	return (
		<svg viewBox="0 0 140 140" fill="none" className={className} aria-hidden>
			<defs>
				<linearGradient id={`sh-${id}`} x1="28" y1="22" x2="112" y2="118" gradientUnits="userSpaceOnUse">
					<stop stopColor={primary} />
					<stop offset="1" stopColor={secondary} />
				</linearGradient>
			</defs>
			<ellipse cx="70" cy="122" rx="38" ry="6" fill={primary} fillOpacity="0.16" />
			<path
				d="M70 22L110 38V68C110 94 92 111 70 118C48 111 30 94 30 68V38L70 22Z"
				fill={`url(#sh-${id})`}
			/>
			<path
				d="M70 29L103 42V67C103 88 88 103 70 109"
				stroke="#fff"
				strokeOpacity="0.35"
				strokeWidth="3"
				strokeLinecap="round"
			/>
			<path
				d="M55 69L66 80L87 57"
				stroke="#fff"
				strokeWidth="6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle cx="26" cy="38" r="5" fill={primary} fillOpacity="0.4" />
			<circle cx="116" cy="94" r="6" fill={secondary} fillOpacity="0.35" />
		</svg>
	);
}

export function EvidenceGallerySvg({
	className = "w-28 h-28",
	primary = "#0ea5e9",
	secondary = "#6366f1",
}: IllustrationProps) {
	const id = useId().replace(/:/g, "");
	return (
		<svg viewBox="0 0 140 140" fill="none" className={className} aria-hidden>
			<defs>
				<linearGradient id={`ev-${id}`} x1="24" y1="28" x2="118" y2="112" gradientUnits="userSpaceOnUse">
					<stop stopColor={primary} />
					<stop offset="1" stopColor={secondary} />
				</linearGradient>
			</defs>
			<ellipse cx="70" cy="122" rx="40" ry="6" fill={primary} fillOpacity="0.15" />
			<rect
				x="24"
				y="40"
				width="68"
				height="54"
				rx="14"
				transform="rotate(-7 24 40)"
				fill={primary}
				fillOpacity="0.22"
			/>
			<rect x="34" y="34" width="76" height="62" rx="16" fill={`url(#ev-${id})`} />
			<rect x="42" y="44" width="36" height="7" rx="3.5" fill="#fff" fillOpacity="0.85" />
			<rect x="42" y="56" width="54" height="5" rx="2.5" fill="#fff" fillOpacity="0.45" />
			<rect x="42" y="66" width="44" height="5" rx="2.5" fill="#fff" fillOpacity="0.45" />
			<circle cx="96" cy="84" r="16" fill="#10b981" />
			<path
				d="M89 84L94 89L104 79"
				stroke="#fff"
				strokeWidth="3.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function ScenarioBridgeSvg({
	className = "w-32 h-32",
	primary = "#6366f1",
	secondary = "#d946ef",
}: IllustrationProps) {
	const id = useId().replace(/:/g, "");
	return (
		<svg viewBox="0 0 160 120" fill="none" className={className} aria-hidden>
			<defs>
				<linearGradient id={`br-${id}`} x1="12" y1="16" x2="148" y2="104" gradientUnits="userSpaceOnUse">
					<stop stopColor={primary} />
					<stop offset="1" stopColor={secondary} />
				</linearGradient>
			</defs>
			<path
				d="M18 88C42 42 118 42 142 88"
				stroke={`url(#br-${id})`}
				strokeWidth="8"
				strokeLinecap="round"
			/>
			<path
				d="M18 88C42 42 118 42 142 88"
				stroke="#fff"
				strokeOpacity="0.5"
				strokeWidth="3"
				strokeDasharray="5 6"
				strokeLinecap="round"
			/>
			<circle cx="22" cy="86" r="11" fill={primary} />
			<circle cx="80" cy="54" r="13" fill="#f59e0b" />
			<circle cx="138" cy="86" r="11" fill="#10b981" />
			<circle cx="22" cy="86" r="4" fill="#fff" />
			<circle cx="80" cy="54" r="5" fill="#fff" />
			<circle cx="138" cy="86" r="4" fill="#fff" />
		</svg>
	);
}
