import { Calendar, Sparkles } from "lucide-react";
import { evidenceItems } from "../../data/dashboardDummyData";

interface EvidenceSummaryCardProps {
	onSeeMore: () => void;
}

export default function EvidenceSummaryCard({
	onSeeMore,
}: EvidenceSummaryCardProps) {
	if (evidenceItems.length === 0) {
		return (
			<div className="text-center py-6">
				<p className="text-sm font-semibold text-neutral mb-1">
					Belum ada bukti karier
				</p>
				<p className="text-xs text-neutral/50 mb-4 max-w-xs mx-auto">
					Tambahkan project, pencapaian, atau sertifikat untuk memperkuat profil
					kariermu.
				</p>
				<button
					type="button"
					onClick={onSeeMore}
					className="text-xs font-semibold text-primary hover:opacity-70 transition">
					Lengkapi sekarang →
				</button>
			</div>
		);
	}

	return (
		<div>
			<p className="text-sm text-neutral mb-4">
				Kamu memiliki{" "}
				<span className="font-bold text-primary">
					{evidenceItems.length} bukti karier
				</span>
			</p>

			<div className="space-y-3 mb-5">
				{evidenceItems.slice(0, 2).map((item) => (
					<div key={item.id} className="bg-neutral/5 rounded-xl p-4">
						<div className="flex items-center justify-between mb-1.5">
							<span className="text-xs font-semibold text-neutral/50">
								{item.category}
							</span>
							{item.aiGenerated && <Sparkles size={12} className="text-primary/50" />}
						</div>
						<p className="text-sm font-bold text-neutral">{item.title}</p>
						<div className="flex items-center gap-1.5 text-xs text-neutral/50 mt-1.5">
							<Calendar size={12} />
							<span>{item.date}</span>
						</div>
					</div>
				))}
			</div>

			<button
				type="button"
				onClick={onSeeMore}
				className="text-xs font-semibold text-primary hover:opacity-70 transition">
				Lihat Semua Bukti →
			</button>
		</div>
	);
}
