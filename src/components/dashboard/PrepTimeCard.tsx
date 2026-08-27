import { Clock } from "lucide-react";
import { careerPathData } from "../../data/dashboardDummyData";

export default function PrepTimeCard() {
	const { roleDetail } = careerPathData;

	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
			<div className="flex items-center gap-3 mb-3">
				<div className="w-9 h-9 rounded-xl bg-neutral/5 flex items-center justify-center shrink-0">
					<Clock size={16} className="text-neutral/60" />
				</div>
				<div>
					<p className="text-xs text-neutral/50 font-medium">
						Estimasi Waktu Persiapan
					</p>
					<p className="text-lg font-bold text-neutral">{roleDetail.prepTime}</p>
				</div>
			</div>
			<p className="text-xs text-neutral/60 leading-relaxed">
				{roleDetail.prepDescription}
			</p>
		</div>
	);
}
