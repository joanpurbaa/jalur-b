import { careerPathData } from "../../data/dashboardDummyData";

interface CareerPathSummaryCardProps {
	onSeeMore: () => void;
}

export default function CareerPathSummaryCard({
	onSeeMore,
}: CareerPathSummaryCardProps) {
	const sorted = [...careerPathData.alternativeRoles].sort(
		(a, b) => b.match - a.match,
	);

	return (
		<div>
			<p className="text-xs text-neutral/50 mb-4">
				Role saat ini:{" "}
				<span className="font-semibold text-neutral">
					{careerPathData.currentRole.title}
				</span>
			</p>

			<div className="space-y-2.5 mb-5">
				{sorted.map((role) => {
					const isSelected = role.id === careerPathData.selectedRoleId;
					return (
						<div
							key={role.id}
							className={`flex items-center justify-between rounded-xl p-3.5 ${
								isSelected ? "bg-primary/5 border border-primary/20" : "bg-neutral/5"
							}`}>
							<span
								className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-neutral"}`}>
								{role.title}
							</span>
							<span
								className={`text-xs font-bold ${isSelected ? "text-primary" : "text-neutral/50"}`}>
								{role.match}% Match
							</span>
						</div>
					);
				})}
			</div>

			<button
				type="button"
				onClick={onSeeMore}
				className="text-xs font-semibold text-primary hover:opacity-70 transition">
				Lihat Jalur Karier →
			</button>
		</div>
	);
}
