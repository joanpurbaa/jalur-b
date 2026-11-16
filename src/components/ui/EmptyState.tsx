import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CompassOrbSvg, EvidenceGallerySvg, ScenarioBridgeSvg, VaultShieldSvg } from "./Illustrations";
import IconTile from "./IconTile";
import { Float } from "./Motion";
import type { Tone } from "../../lib/modules";

type IllustrationKind = "compass" | "vault" | "evidence" | "bridge";

interface EmptyStateProps {
	title: string;
	description: string;
	illustration?: IllustrationKind;
	icon?: LucideIcon;
	tone?: Tone;
	action?: ReactNode;
	className?: string;
}

export default function EmptyState({
	title,
	description,
	illustration = "compass",
	icon,
	tone = "beranda",
	action,
	className = "",
}: EmptyStateProps) {
	return (
		<div
			className={`card-3d p-7 sm:p-10 text-center flex flex-col items-center justify-center ${className}`}>
			<Float className="mb-4">
				{icon ? (
					<IconTile icon={icon} tone={tone} size="xl" />
				) : illustration === "vault" ? (
					<VaultShieldSvg />
				) : illustration === "evidence" ? (
					<EvidenceGallerySvg />
				) : illustration === "bridge" ? (
					<ScenarioBridgeSvg />
				) : (
					<CompassOrbSvg />
				)}
			</Float>
			<h3 className="text-base sm:text-lg font-bold text-neutral max-w-md">
				{title}
			</h3>
			<p className="text-sm text-neutral/65 mt-1.5 max-w-md leading-relaxed">
				{description}
			</p>
			{action && <div className="mt-5">{action}</div>}
		</div>
	);
}
