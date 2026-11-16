import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import SkillPill, { type SkillPillTone } from "../ui/SkillPill";
import IconTile from "../ui/IconTile";
import Card from "../ui/Card";
import { SecondaryButton } from "../ui/PrimaryButton";

interface SkillAnalysisCardProps {
	title: string;
	subtitle?: string;
	icon: LucideIcon;
	skills: string[];
	pillTone?: SkillPillTone;
	ctaLabel?: string;
	ctaHref?: string;
}

export default function SkillAnalysisCard({
	title,
	subtitle,
	icon: Icon,
	skills,
	pillTone = "neutral",
	ctaLabel,
	ctaHref,
}: SkillAnalysisCardProps) {
	return (
		<Card lift padding="md" className="flex flex-col justify-between h-full">
			<div>
				<div className="flex items-center justify-between gap-2.5 pb-3.5 mb-4 border-b border-slate-100">
					<div className="flex items-center gap-3 min-w-0">
						<IconTile icon={Icon} tone="neutral" size="sm" />
						<div className="min-w-0">
							<h4 className="text-sm sm:text-base font-bold text-slate-900">
								{title}
							</h4>
							{subtitle && (
								<p className="text-xs text-slate-500">{subtitle}</p>
							)}
						</div>
					</div>
					<span className="num-display text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 shrink-0">
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
					<p className="text-xs text-slate-400">
						Belum ada daftar skill pada kategori ini.
					</p>
				)}
			</div>

			{ctaLabel && ctaHref && (
				<div className="mt-5 pt-3.5 border-t border-slate-100">
					<Link to={ctaHref}>
						<SecondaryButton fullWidth size="sm" icon={<ArrowRight size={14} />}>
							{ctaLabel}
						</SecondaryButton>
					</Link>
				</div>
			)}
		</Card>
	);
}
