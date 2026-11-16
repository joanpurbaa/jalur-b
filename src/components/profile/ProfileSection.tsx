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
		<section className="mb-2">
			<div className="flex items-center justify-between gap-2 mb-3">
				<div>
					<h3 className="text-base font-extrabold text-neutral">{title}</h3>
					{description && (
						<p className="text-xs sm:text-sm text-neutral/60 mt-0.5">
							{description}
						</p>
					)}
				</div>
				{action}
			</div>
			<Card padding="lg">{children}</Card>
		</section>
	);
}
