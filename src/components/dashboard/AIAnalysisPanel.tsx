import { Sparkles, Info } from "lucide-react";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
import MeterBar from "../ui/MeterBar";
import ExpandableText from "../ui/ExpandableText";

interface AIAnalysisPanelProps {
	description?: string;
	confidence?: number;
}

export default function AIAnalysisPanel({
	description,
	confidence,
}: AIAnalysisPanelProps) {
	return (
		<Card padding="lg">
			<div className="flex items-center gap-3 mb-4">
				<IconTile icon={Sparkles} tone="indigo" size="sm" />
				<div>
					<span className="text-xs font-medium text-indigo-700">
						Analisis AI
					</span>
					<h4 className="text-base font-bold text-slate-900">
						Memahami Estimasi Risiko
					</h4>
				</div>
			</div>

			{description ? (
				<ExpandableText
					text={description}
					maxLines={4}
					className="text-sm text-slate-700 leading-relaxed"
				/>
			) : (
				<p className="text-sm text-slate-600 leading-relaxed">
					Lengkapi data karier untuk mendapatkan penjelasan AI mengenai posisi
					dan lanskap industrimu.
				</p>
			)}

			{confidence != null && confidence > 0 && (
				<div className="mt-5 pt-4 border-t border-slate-100">
					<div className="flex items-center justify-between text-xs font-medium mb-1.5">
						<span className="text-slate-600">Cakupan data analisis</span>
						<span className="text-indigo-700 font-semibold tabular">
							{confidence}%
						</span>
					</div>
					<MeterBar value={confidence} max={100} status="insight" height="sm" />
				</div>
			)}

			<div className="flex items-start gap-2.5 mt-4 pt-4 border-t border-slate-100">
				<Info size={15} className="text-slate-400 shrink-0 mt-0.5" />
				<p className="text-xs text-slate-500 leading-relaxed">
					Estimasi ini menganalisis peran, performa, dan tren pasar terkini
					sebagai panduan untuk membantumu bersiap, bukan kepastian tetap.
				</p>
			</div>
		</Card>
	);
}
