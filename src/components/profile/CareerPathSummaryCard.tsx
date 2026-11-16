import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import { careerPivotApi } from "../../services/careerPivot";
import { parseDecimal } from "../../lib/parseNumeric";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { CareerPivotResult } from "../../types/careerPivot";

interface CareerPathSummaryCardProps {
	onSeeMore: () => void;
}

export default function CareerPathSummaryCard({
	onSeeMore,
}: CareerPathSummaryCardProps) {
	const { refreshKey } = useCareerAssessment();
	const [result, setResult] = useState<CareerPivotResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		careerPivotApi
			.latest()
			.then((res) => {
				if (active) setResult(res);
			})
			.catch(() => {
				// belum ada penilaian — biarkan kosong
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, [refreshKey]);

	if (loading) {
		return (
			<div>
				<Skeleton className="h-3 w-56 mb-4" />
				<div className="space-y-2.5">
					<Skeleton className="h-12 w-full rounded-xl" />
					<Skeleton className="h-12 w-full rounded-xl" />
				</div>
			</div>
		);
	}

	if (!result) {
		return (
			<div className="text-center py-6">
				<p className="text-sm text-slate-600 mb-3">
					Belum ada rekomendasi jalur karier.
				</p>
				<button
					type="button"
					onClick={onSeeMore}
					className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 cursor-pointer">
					Lihat Jalur Karier
					<ArrowRight size={13} />
				</button>
			</div>
		);
	}

	const sorted = [...result.roles].sort(
		(a, b) => parseDecimal(b.match_score) - parseDecimal(a.match_score),
	);
	const topRoles = sorted.slice(0, 3);
	const topMatch = topRoles[0]?.role_name;

	return (
		<div>
			<p className="text-xs text-slate-500 mb-4">
				Role saat ini:{" "}
				<span className="font-semibold text-slate-900">
					{result.current_role_name || "—"}
				</span>
			</p>

			<div className="space-y-2.5 mb-4">
				{topRoles.map((role) => {
					const isSelected = role.role_name === topMatch;
					return (
						<div
							key={role.role_name}
							className={`flex items-center justify-between rounded-xl p-3 border ${
								isSelected
									? "bg-indigo-50/70 border-indigo-200"
									: "bg-slate-50 border-slate-200/80"
							}`}>
							<span
								className={`text-sm font-semibold ${
									isSelected ? "text-indigo-900" : "text-slate-900"
								}`}>
								{role.role_name}
							</span>
							<span
								className={`text-xs font-semibold tabular ${
									isSelected ? "text-indigo-700" : "text-slate-600"
								}`}>
								{Math.round(parseDecimal(role.match_score))}% cocok
							</span>
						</div>
					);
				})}
			</div>

			<button
				type="button"
				onClick={onSeeMore}
				className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 cursor-pointer">
				Lihat Jalur Karier
				<ArrowRight size={13} />
			</button>
		</div>
	);
}
