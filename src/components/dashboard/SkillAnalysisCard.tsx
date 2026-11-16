import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { type StatusVariant } from "../../lib/status";
import type { Tone } from "../../lib/modules";
import SkillPill, { type SkillPillTone } from "../ui/SkillPill";
import IconTile from "../ui/IconTile";
import Card from "../ui/Card";

interface SkillAnalysisCardProps {
	title: string;
	subtitle?: string;
	icon: LucideIcon;
	variant: StatusVariant;
	tone?: Tone;
	skills: string[];
	pillTone?: SkillPillTone;
	ctaLabel?: string;
	ctaHref?: string;
}

export default function SkillAnalysisCard({
	title,
	subtitle,
	icon: Icon,
	tone = "skill",
	skills,
	pillTone = "neutral",
	ctaLabel,
	ctaHref,
}: SkillAnalysisCardProps) {
	return (
		<Card lift padding="md" className="flex flex-col justify-between h-full">
			<div>
				<div className="flex items-center justify-between gap-2.5 pb-3.5 mb-4 border-b border-slate-100">
					<div className="flex items-center gap-3">
						<IconTile icon={Icon} tone={tone} size="sm" />
						<div>
							<h4 className="text-sm sm:text-base font-extrabold text-neutral">
								{title}
							</h4>
							{subtitle && (
								<p className="text-xs text-neutral/55">{subtitle}</p>
							)}
						</div>
					</div>
					<span className="num-display text-sm px-2.5 py-1 rounded-full bg-slate-100 text-neutral/70">
						{skills.length}
					</span>
				</div>

				{skills.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{skills.map((skill) => (
							<SkillPill key={skill} label={skill} tone={pillTone} />
						))}
					</div>
				) : (
					<p className="text-xs text-neutral/45 italic">
						Belum ada daftar skill pada kategori ini.
					</p>
				)}
			</div>

			{ctaLabel && ctaHref && (
				<div className="mt-5 pt-3.5 border-t border-slate-100">
					<Link
						to={ctaHref}
						className="press inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-xs font-bold text-amber-900 transition">
						<span>{ctaLabel}</span>
						<ArrowRight size={14} />
					</Link>
				</div>
			)}
		</Card>
	);
}
