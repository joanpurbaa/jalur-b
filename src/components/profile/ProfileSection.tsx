import type { ReactNode } from "react";
import Card from "../ui/Card";

interface ProfileSectionProps {
	title: string;
	description?: string;
	action?: ReactNode;
	children: ReactNode;
}

export default function ProfileSection({
	title,
	description,
	action,
	children,
}: ProfileSectionProps) {
	return (
		<section className="h-full flex flex-col">
			<div className="flex items-center justify-between gap-2 mb-3">
				<div>
					<h3 className="text-base font-bold text-slate-900">{title}</h3>
					{description && (
						<p className="text-xs sm:text-sm text-slate-500 mt-0.5">
							{description}
						</p>
					)}
				</div>
				{action}
			</div>
			<Card padding="lg" className="flex-1">
				{children}
			</Card>
		</section>
	);
}
