import { ArrowRight } from "lucide-react";
import { nextAction } from "../../data/dashboardDummyData";

export default function NextActionCard() {
	return (
		<div>
			<h3 className="text-sm font-bold text-neutral mb-3">Langkah Berikutnya</h3>
			<div className="bg-white rounded-2xl p-6 border border-neutral/5 shadow-sm flex flex-col justify-between h-44">
				<p className="text-sm text-neutral/80 leading-relaxed">
					{nextAction.description}
				</p>
				<button
					type="button"
					className="self-start flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2.5 transition-all">
					{nextAction.ctaLabel}
					<ArrowRight size={14} />
				</button>
			</div>
		</div>
	);
}
