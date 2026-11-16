import { Link } from "react-router-dom";
import { ArrowRight, Flag, Sparkles } from "lucide-react";
import SkillPill from "../ui/SkillPill";
import ScoreRing from "../ui/ScoreRing";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
import StatusBadge from "../ui/StatusBadge";
import { getScoreStatus } from "../../lib/status";

interface RoleDetailPanelProps {
	roleName: string;
	matchScore: number;
	missingSkills: string[];
}

export default function RoleDetailPanel({
	roleName,
	matchScore,
	missingSkills,
}: RoleDetailPanelProps) {
	const status = getScoreStatus(matchScore);

	return (
		<Card
			padding="lg"
			className="mb-5 bg-gradient-to-br from-white via-emerald-50/35 to-teal-50/30">
			<div className="flex items-start justify-between gap-3 mb-4">
				<div className="flex items-center gap-2.5 min-w-0">
					<IconTile icon={Sparkles} tone="jalur-karier" size="sm" />
					<div className="min-w-0">
						<span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
							Detail Target Peran
						</span>
						<h3 className="text-base sm:text-lg font-extrabold text-neutral leading-snug">
							{roleName}
						</h3>
					</div>
				</div>
				<StatusBadge
					variant={status}
					label={
						matchScore >= 75
							? "Sangat Cocok"
							: matchScore >= 60
								? "Potensial"
								: "Perlu Jembatan"
					}
					size="sm"
				/>
			</div>

			<div className="flex items-center gap-4 py-3 px-4 rounded-2xl bg-white/80 border border-emerald-100 mb-5">
				<ScoreRing
					value={matchScore}
					max={100}
					size={88}
					stroke={9}
					colors={["#10b981", "#14b8a6"]}
					suffix="%"
					label={`Kecocokan ${roleName}`}
				/>
				<div>
					<p className="text-xs font-bold uppercase tracking-wider text-neutral/50">
						Kecocokan Profil
					</p>
					<p className="text-sm text-neutral/75 mt-1 leading-relaxed">
						{matchScore >= 75
							? "Sebagian besar keahlian intinya sudah kamu miliki."
							: "Kamu sudah punya modal dasar, tinggal menutup beberapa gap skill."}
					</p>
				</div>
			</div>

			<div className="border-t border-slate-100 pt-4">
				<div className="flex items-center gap-2 text-xs font-extrabold text-neutral mb-3">
					<Flag size={14} className="text-amber-600" />
					<span>Skill jembatan yang perlu dikembangkan ({missingSkills.length})</span>
				</div>
				{missingSkills.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{missingSkills.map((skill) => (
							<SkillPill key={skill} label={skill} tone="improve" />
						))}
					</div>
				) : (
					<p className="text-xs text-emerald-700 font-semibold">
						Tidak ada gap skill mayor yang terdeteksi!
					</p>
				)}

				<Link
					to="/dashboard/bukti-karier"
					className="press mt-4 inline-flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-xs font-bold text-emerald-900">
					<span>Bangun portofolio untuk peran ini</span>
					<ArrowRight size={14} />
				</Link>
			</div>
		</Card>
	);
}
