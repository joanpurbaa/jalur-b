import { HeartPulse } from "lucide-react";
import { careerHealthData } from "../../data/dashboardDummyData";

export default function CareerHealthCard() {
	return (
		<div className="bg-white rounded-3xl p-6 border border-neutral/5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
			<div>
				<div className="flex items-center gap-2 text-primary font-semibold text-sm mb-2">
					<HeartPulse size={18} />
					<span>Career Health</span>
				</div>
				<div className="flex items-baseline gap-3">
					<span className="text-4xl font-extrabold text-neutral">
						{careerHealthData.score}
						<span className="text-lg text-neutral/40 font-normal">/100</span>
					</span>
					<span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-200">
						{careerHealthData.status}
					</span>
				</div>
				<p className="text-xs text-neutral/50 mt-2 font-medium">
					{careerHealthData.trend}
				</p>
			</div>

			<a
				href="/dashboard/kesehatan-karier"
				type="button"
				className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:opacity-90 transition shadow-sm self-end sm:self-auto">
				Lihat Analisis
			</a>
		</div>
	);
}
