import { Mail, AtSign, Briefcase, Pencil } from "lucide-react";
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

	if (loading) {
		return (
			<Card
				padding="lg"
				className="flex flex-col items-center text-center h-full">
				<div className="mb-4">
					<Skeleton className="w-24 h-24 rounded-2xl" />
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
			className="flex flex-col items-center text-center h-full justify-between">
			<div className="w-full flex flex-col items-center">
				{/* Avatar indigo polos tanpa gradien */}
				<div className="w-24 h-24 rounded-2xl overflow-hidden border border-indigo-200 bg-indigo-600 flex items-center justify-center mb-4">
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

				<TruncatedText
					as="h2"
					text={name}
					className="text-xl font-bold text-slate-900"
				/>
				<p className="text-sm font-medium text-slate-600 mt-1 flex items-center justify-center gap-1.5">
					<Briefcase size={14} className="text-indigo-600 shrink-0" />
					<span>
						{role}
						{industry ? ` · ${industry}` : ""}
					</span>
				</p>

				<div className="w-full mt-5 pt-4 border-t border-slate-100 space-y-2 text-left">
					<div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-200/80">
						<Mail size={14} className="text-slate-500 shrink-0" />
						<TruncatedText
							text={email}
							wrapperClassName="flex-1 min-w-0"
							className="text-xs font-medium text-slate-700"
						/>
					</div>
					<div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-200/80">
						<AtSign size={14} className="text-slate-500 shrink-0" />
						<TruncatedText
							text={username}
							wrapperClassName="flex-1 min-w-0"
							className="text-xs font-medium text-slate-700"
						/>
					</div>
				</div>
			</div>

			<div className="w-full mt-6">
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
