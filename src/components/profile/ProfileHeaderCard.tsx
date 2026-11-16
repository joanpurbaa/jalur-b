import { Mail, AtSign, Award, Briefcase, Pencil } from "lucide-react";
import { SecondaryButton } from "../ui/PrimaryButton";
import Card from "../ui/Card";
import Skeleton, { SkeletonText, SkeletonButton } from "../ui/Skeleton";
import TruncatedText from "../ui/TruncatedText";
import { capitalizeName, initials as getInitials } from "../../lib/format";
import type { OnboardingProfile } from "../../types/onboarding";
import type { UserResponse } from "../../types/auth";

interface ProfileHeaderCardProps {
	onEdit: () => void;
	profile?: OnboardingProfile | null;
	user?: UserResponse | null;
	loading?: boolean;
}

function getLevelBadge(months?: number | null): string {
	if (!months || months < 12) return "Level 1 · Explorer Karier";
	if (months < 36) return "Level 2 · Praktisi Bertumbuh";
	if (months < 72) return "Level 3 · Spesialis Tangguh";
	return "Level 4 · Senior Navigator";
}

export default function ProfileHeaderCard({
	onEdit,
	profile,
	user,
	loading = false,
}: ProfileHeaderCardProps) {
	const rawName = profile?.full_name || user?.username || "Pengguna";
	const name = capitalizeName(rawName);
	const role = profile?.current_role_name || "Peran belum diisi";
	const industry = profile?.industry_name;
	const email = user?.email || "—";
	const username = user?.username || "—";
	const avatarUrl = profile?.avatar_url;
	const initials = getInitials(rawName) || "JB";
	const badgeLabel = getLevelBadge(profile?.work_duration_months);

	if (loading) {
		return (
			<Card
				padding="lg"
				className="flex flex-col items-center text-center h-full">
				<div className="mb-4">
					<Skeleton className="w-24 h-24 rounded-3xl" />
				</div>
				<SkeletonText width="w-40" className="h-5" />
				<SkeletonText width="w-28" className="mt-2" />
				<div className="w-full mt-5 space-y-2.5">
					<SkeletonText width="w-2/3" />
					<SkeletonText width="w-2/3" />
				</div>
				<div className="w-full mt-6">
					<SkeletonButton className="w-full" />
				</div>
			</Card>
		);
	}

	return (
		<Card
			padding="lg"
			className="relative overflow-hidden flex flex-col items-center text-center h-full bg-gradient-to-b from-indigo-50/60 via-white to-white">
			{/* Avatar gradien + badge level */}
			<div className="relative mb-3">
				<div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-[0_14px_28px_-10px_rgba(79,70,229,0.45)] bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center">
					{avatarUrl ? (
						<img
							src={avatarUrl}
							alt={name}
							className="w-full h-full object-cover"
						/>
					) : (
						<span className="num-display text-3xl text-white select-none">
							{initials}
						</span>
					)}
				</div>
			</div>

			<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-extrabold shadow-xs mb-2.5">
				<Award size={12} />
				{badgeLabel}
			</span>

			<TruncatedText
				as="h2"
				text={name}
				className="text-xl font-extrabold text-neutral"
			/>
			<p className="text-xs sm:text-sm font-semibold text-indigo-700 mt-0.5 flex items-center justify-center gap-1.5">
				<Briefcase size={13} />
				<span>
					{role}
					{industry ? ` · ${industry}` : ""}
				</span>
			</p>

			<div className="w-full mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-left">
				<div className="flex items-center gap-2.5 text-sm text-neutral/75 bg-slate-50/80 rounded-xl px-3 py-2 border border-slate-200/70">
					<Mail size={14} className="text-indigo-500 shrink-0" />
					<TruncatedText
						text={email}
						wrapperClassName="flex-1 min-w-0"
						className="text-xs font-semibold text-neutral/80"
					/>
				</div>
				<div className="flex items-center gap-2.5 text-sm text-neutral/75 bg-slate-50/80 rounded-xl px-3 py-2 border border-slate-200/70">
					<AtSign size={14} className="text-violet-500 shrink-0" />
					<TruncatedText
						text={username}
						wrapperClassName="flex-1 min-w-0"
						className="text-xs font-semibold text-neutral/80"
					/>
				</div>
			</div>

			<div className="w-full mt-6 pt-2">
				<SecondaryButton
					fullWidth
					icon={<Pencil size={14} />}
					onClick={onEdit}>
					Edit Profil
				</SecondaryButton>
			</div>
		</Card>
	);
}
