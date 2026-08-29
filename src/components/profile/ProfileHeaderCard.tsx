import { Mail, AtSign } from "lucide-react";
import { SecondaryButton } from "../ui/PrimaryButton";
import Skeleton, { SkeletonText, SkeletonButton } from "../ui/Skeleton";
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
	const name = profile?.full_name || user?.username || "-";
	const role = profile?.current_role_name || "-";
	const email = user?.email || "-";
	const username = user?.username || "-";
	const avatarUrl = profile?.avatar_url;

	if (loading) {
		return (
			<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-8 flex flex-col items-center text-center h-full">
				<div className="mb-4">
					<Skeleton className="w-24 h-24 rounded-full" />
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
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-8 flex flex-col items-center text-center h-full">
			<div className="w-24 h-24 rounded-full overflow-hidden border border-neutral/10 mb-4 bg-neutral/10">
				{avatarUrl && (
					<img
						src={avatarUrl}
						alt={name}
						className="w-full h-full object-cover"
					/>
				)}
			</div>
			<h2 className="text-lg font-bold text-neutral">{name}</h2>
			<p className="text-sm text-neutral/50">{role}</p>

			<div className="w-full mt-5 space-y-2.5 text-left">
				<div className="flex items-center gap-2.5 text-sm text-neutral/70">
					<Mail size={14} className="text-neutral/40" />
					<span>{email}</span>
				</div>
				<div className="flex items-center gap-2.5 text-sm text-neutral/70">
					<AtSign size={14} className="text-neutral/40" />
					<span>{username}</span>
				</div>
			</div>

			<div className="w-full mt-6">
				<SecondaryButton fullWidth onClick={onEdit}>
					Edit Profil
				</SecondaryButton>
			</div>
		</div>
	);
}