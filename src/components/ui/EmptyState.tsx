import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CompassOrbSvg, EvidenceGallerySvg, VaultShieldSvg } from "./Illustrations";
import IconTile from "./IconTile";
import type { Tone } from "../../lib/modules";

type IllustrationKind = "compass" | "vault" | "evidence";

interface EmptyStateProps {
	title: string;
	description: string;
	illustration?: IllustrationKind;
	icon?: LucideIcon;
	tone?: Tone;
	action?: ReactNode;
	className?: string;
}

/** Empty state tenang dan ringkas dengan satu CTA utama bila relevan. */
export default function EmptyState({
	title,
	description,
	illustration = "compass",
	icon,
	tone = "indigo",
	action,
	className = "",
}: EmptyStateProps) {
	return (
		<div
			className={`card-surface p-7 sm:p-10 text-center flex flex-col items-center justify-center ${className}`}>
			<div className="mb-4">
				{icon ? (
					<IconTile icon={icon} tone={tone} size="xl" />
				) : illustration === "vault" ? (
					<VaultShieldSvg />
				) : illustration === "evidence" ? (
					<EvidenceGallerySvg />
				) : (
					<CompassOrbSvg />
				)}
			</div>
			<h3 className="text-base sm:text-lg font-bold text-slate-900 max-w-md">
				{title}
			</h3>
			<p className="text-sm text-slate-600 mt-1.5 max-w-md leading-relaxed">
				{description}
			</p>
			{action && <div className="mt-5">{action}</div>}
		</div>
	);
}
