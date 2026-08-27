import { Sparkles, CheckCircle2, Flag, Settings2 } from "lucide-react";
import { careerPathData } from "../../data/dashboardDummyData";
import SkillPill from "../ui/SkillPill";

export default function RoleDetailPanel() {
	const { roleDetail } = careerPathData;

	return (
		<div className="bg-white rounded-2xl border border-neutral/5 border-l-4 border-l-primary shadow-md p-6 mb-6">
			<div className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
				<Sparkles size={16} />
				<span>{roleDetail.title}</span>
			</div>

			<div className="flex items-baseline gap-2 mb-5">
				<span className="text-4xl font-extrabold text-primary">
					{roleDetail.match}%
				</span>
				<span className="text-xs text-neutral/50 font-medium">
					Kecocokan Profil
				</span>
			</div>

			<div className="border-t border-neutral/10 pt-4 mb-4">
				<div className="flex items-center gap-1.5 text-xs font-semibold text-neutral mb-2.5">
					<CheckCircle2 size={14} className="text-primary" />
					<span>Skill yang sudah dimiliki</span>
				</div>
				<div className="flex flex-wrap gap-2">
					{roleDetail.skillsOwned.map((skill) => (
						<SkillPill key={skill} label={skill} />
					))}
				</div>
			</div>

			<div>
				<div className="flex items-center gap-1.5 text-xs font-semibold text-neutral mb-2.5">
					<Flag size={14} className="text-rose-500" />
					<span>Skill yang perlu dikembangkan</span>
				</div>
				<div className="flex flex-wrap gap-2">
					{roleDetail.skillsToImprove.map((skill) => (
						<SkillPill key={skill} label={skill} icon={Settings2} />
					))}
				</div>
			</div>
		</div>
	);
}
