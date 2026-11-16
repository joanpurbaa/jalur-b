import { Sparkles, Info } from "lucide-react";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
import MeterBar from "../ui/MeterBar";

interface AIAnalysisPanelProps {
	description?: string;
	confidence?: number;
}

export default function AIAnalysisPanel({
	description,
	confidence,
}: AIAnalysisPanelProps) {
	return (
		<Card
			padding="lg"
			className="bg-gradient-to-br from-white via-indigo-50/40 to-violet-50/40">
			<div className="flex items-center gap-3 mb-4">
				<span className="motion-safe:animate-spark inline-flex">
					<IconTile icon={Sparkles} tone="beranda" size="sm" />
				</span>
				<div>
					<span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
						AI Analysis
					</span>
					<h4 className="text-base font-extrabold text-neutral">
						Memahami Estimasi Risiko
					</h4>
				</div>
			</div>

			<p className="text-sm text-neutral/80 leading-relaxed">
				{description ||
					"Lengkapi data karier untuk mendapatkan analisis AI yang mendalam mengenai posisi dan lanskap industrimu."}
			</p>

			{confidence != null && confidence > 0 && (
				<div className="mt-5 pt-4 border-t border-indigo-100/80">
					<div className="flex items-center justify-between text-xs font-semibold mb-1.5">
						<span className="text-neutral/60">Kelengkapan data analisis</span>
						<span className="text-indigo-700 font-bold tabular">
							{confidence}%
						</span>
					</div>
					<MeterBar
						value={confidence}
						max={100}
						colors={["#6366f1", "#8b5cf6"]}
						height="sm"
					/>
				</div>
			)}

			<div className="flex items-start gap-2.5 mt-4 pt-4 border-t border-indigo-100/80">
				<Info size={15} className="text-indigo-500 shrink-0 mt-0.5" />
				<p className="text-xs text-neutral/60 leading-relaxed">
					Jalur B menganalisis peran, performa, industri, dan tren pasar terkini.
					Estimasi ini bersifat panduan untuk membantumu bersiap lebih tenang,
					bukan vonis tetap.
				</p>
			</div>
		</Card>
	);
}
