import { useRef, useState } from "react";
import { Briefcase, Upload } from "lucide-react";
import SkillPill from "../ui/SkillPill";
import Skeleton from "../ui/Skeleton";
import { SecondaryButton } from "../ui/PrimaryButton";
import {
	dummyCareerHistory,
	loadLocalCv,
	saveLocalCv,
	formatFileSize,
	type CvMeta,
} from "../../lib/careerExtras";
import type { OnboardingSkill } from "../../types/onboarding";

interface CareerExperienceCardProps {
	skills?: OnboardingSkill[];
	loading?: boolean;
}

export default function CareerExperienceCard({
	skills,
	loading = false,
}: CareerExperienceCardProps) {
	const [cv, setCv] = useState<CvMeta | null>(() => loadLocalCv());
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFile = (file: File) => {
		setUploading(true);
		try {
			const meta: CvMeta = {
				fileName: file.name,
				fileSize: file.size,
				uploadedAt: new Date().toISOString(),
			};
			saveLocalCv(meta);
			setCv(meta);
		} finally {
			setUploading(false);
		}
	};

	if (loading) {
		return (
			<div>
				<div className="space-y-3 mb-6">
					<Skeleton className="h-16 w-full rounded-xl" />
					<Skeleton className="h-16 w-full rounded-xl" />
				</div>
				<div className="flex flex-wrap gap-2 mb-6">
					<Skeleton className="h-8 w-24 rounded-lg" />
					<Skeleton className="h-8 w-20 rounded-lg" />
					<Skeleton className="h-8 w-28 rounded-lg" />
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center gap-2 mb-4">
				<Briefcase size={15} className="text-primary/60" />
				<h4 className="text-sm font-bold text-neutral">Pengalaman Karier</h4>
			</div>

			<div className="space-y-5 mb-6">
				{dummyCareerHistory.map((job) => (
					<div key={job.id} className="border-l-2 border-primary/20 pl-4">
						<div className="flex items-center justify-between flex-wrap gap-1">
							<p className="text-sm font-bold text-neutral">{job.role}</p>
							<span className="text-xs text-neutral/50">
								{job.startDate} — {job.endDate}
							</span>
						</div>
						<p className="text-xs text-neutral/50 font-medium">
							{job.company}
						</p>
						<p className="text-xs text-neutral/60 mt-1 leading-relaxed">
							{job.description}
						</p>
					</div>
				))}
			</div>

			<h4 className="text-sm font-bold text-neutral mb-3">Skill</h4>

			{skills && skills.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{skills.map((skill) => (
						<SkillPill key={skill.id} label={skill.name} tone="neutral" />
					))}
				</div>
			) : (
				<p className="text-xs text-neutral/50">Belum ada skill yang dicatat.</p>
			)}

			<div className="mt-6 pt-5 border-t border-neutral/10">
				<div className="flex items-center justify-between flex-wrap gap-3">
					<div className="min-w-0 flex-1">
						{cv ? (
							<>
								<p className="text-xs font-semibold text-neutral mb-1">
									CV terlampir
								</p>
								<div className="flex items-center gap-2">
									<span className="text-sm text-neutral truncate">
										{cv.fileName}
									</span>
									<span className="text-xs text-neutral/50 shrink-0">
										{formatFileSize(cv.fileSize)}
									</span>
								</div>
							</>
						) : (
							<span className="text-xs font-semibold text-neutral mb-1">
								CV
							</span>
						)}
					</div>

					<SecondaryButton
						icon={<Upload size={14} className="text-primary" />}
						onClick={() => fileInputRef.current?.click()}>
						{uploading ? "Memproses..." : cv ? "Ganti CV" : "Unggah CV"}
					</SecondaryButton>

					<input
						ref={fileInputRef}
						type="file"
						accept=".pdf,.doc,.docx"
						className="sr-only"
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) handleFile(file);
							e.target.value = "";
						}}
					/>
				</div>
				{!cv && (
					<p className="text-xs text-neutral/50 mt-2">
						Unggah CV bersifat opsional untuk melengkapi profil kariermu.
					</p>
				)}
			</div>
		</div>
	);
}
