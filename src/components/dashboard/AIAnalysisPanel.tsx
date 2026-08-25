import { Sparkles, Info } from "lucide-react";
import { riskData } from "../../data/dashboardDummyData";

export default function AIAnalysisPanel() {
	return (
		<div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 border-l-4 border-l-primary">
			<div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-3">
				<Sparkles size={16} />
				<span>AI Analysis</span>
			</div>
			<h4 className="text-base font-bold text-neutral mb-2">
				{riskData.aiAnalysis.title}
			</h4>
			<p className="text-xs text-neutral/70 leading-relaxed">
				{riskData.aiAnalysis.description}
			</p>
			<div className="flex items-start gap-2 mt-4 pt-4 border-t border-primary/10">
				<Info size={14} className="text-neutral/40 shrink-0 mt-0.5" />
				<p className="text-[11px] text-neutral/50 leading-relaxed">
					{riskData.aiAnalysis.note}
				</p>
			</div>
		</div>
	);
}
