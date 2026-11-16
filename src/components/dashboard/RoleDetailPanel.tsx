import { Link } from "react-router-dom";
import { ArrowRight, Compass, Wrench } from "lucide-react";
import SkillPill from "../ui/SkillPill";
import ScoreRing from "../ui/ScoreRing";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
import { PrimaryButton } from "../ui/PrimaryButton";

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
	return (
		<Card padding="lg" className="mb-5">
			<div className="flex items-start gap-3 mb-4">
				<IconTile icon={Compass} tone="indigo" size="sm" />
				<div className="min-w-0">
					<span className="text-xs font-medium text-indigo-700">
						Target Peran Terpilih
					</span>
					<h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
						{roleName}
					</h3>
				</div>
			</div>

			<div className="flex items-center gap-4 py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-5">
				<ScoreRing
					value={matchScore}
					max={100}
					size={84}
					stroke={8}
					status="insight"
					suffix="%"
					label={`Kecocokan ${roleName}`}
				/>
				<div>
					<p className="text-xs font-semibold text-slate-500">
						Kecocokan Profil
					</p>
					<p className="text-sm text-slate-700 mt-1 leading-relaxed">
						{matchScore >= 75
							? "Sebagian besar keahlian intinya sudah kamu miliki."
							: "Kamu punya fondasi awal, tinggal melengkapi skill jembatan."}
					</p>
				</div>
			</div>

			<div className="border-t border-slate-100 pt-4">
				<div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-3">
					<Wrench size={14} className="text-slate-500" />
					<span>Skill jembatan yang perlu dipelajari ({missingSkills.length})</span>
				</div>
				{missingSkills.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{missingSkills.map((skill) => (
							<SkillPill key={skill} label={skill} tone="neutral" />
						))}
					</div>
				) : (
					<p className="text-xs text-slate-600">
						Tidak ada gap skill mayor yang terdeteksi.
					</p>
				)}

				<div className="mt-5">
					<Link to="/dashboard/bukti-karier">
						<PrimaryButton fullWidth size="sm" icon={<ArrowRight size={14} />}>
							Bangun Bukti untuk Peran Ini
						</PrimaryButton>
					</Link>
				</div>
			</div>
		</Card>
	);
}
