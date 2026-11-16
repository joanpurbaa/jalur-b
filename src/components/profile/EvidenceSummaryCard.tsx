import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import { evidenceApi } from "../../services/evidence";
import { evidenceTypeLabels, formatEvidenceDate } from "../../lib/evidence";
import type { EvidenceItemResponse } from "../../types/evidence";

interface EvidenceSummaryCardProps {
	onSeeMore: () => void;
}

export default function EvidenceSummaryCard({
	onSeeMore,
}: EvidenceSummaryCardProps) {
	const [items, setItems] = useState<EvidenceItemResponse[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		evidenceApi
			.list({ limit: 3 })
			.then((res) => {
				if (active) {
					setItems(res.items);
					setTotal(res.total);
				}
			})
			.catch(() => {
				// gagal memuat — biarkan kosong
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	if (loading) {
		return (
			<div>
				<Skeleton className="h-4 w-48 mb-4" />
				<div className="space-y-3">
					<Skeleton className="h-20 w-full rounded-xl" />
					<Skeleton className="h-20 w-full rounded-xl" />
				</div>
			</div>
		);
	}

	if (total === 0) {
		return (
			<div className="text-center py-6">
				<p className="text-sm font-semibold text-slate-900 mb-1">
					Belum ada bukti karier
				</p>
				<p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
					Tambahkan project, pencapaian, atau sertifikat untuk memperkuat profil
					kariermu.
				</p>
				<button
					type="button"
					onClick={onSeeMore}
					className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 cursor-pointer">
					Tambah Bukti Karier
					<ArrowRight size={13} />
				</button>
			</div>
		);
	}

	return (
		<div>
			<p className="text-sm text-slate-700 mb-4">
				Kamu memiliki{" "}
				<span className="font-bold text-indigo-700">{total} bukti karier</span>
			</p>

			<div className="space-y-3 mb-4">
				{items.map((item) => (
					<div
						key={item.id}
						className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
						<div className="flex items-center justify-between mb-1">
							<span className="text-xs font-medium text-slate-500">
								{evidenceTypeLabels[item.evidence_type]}
							</span>
							{item.ai_generated && (
								<Sparkles size={12} className="text-indigo-600" />
							)}
						</div>
						<p className="text-sm font-semibold text-slate-900">{item.title}</p>
						<div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
							<Calendar size={12} />
							<span>{formatEvidenceDate(item.evidence_date)}</span>
						</div>
					</div>
				))}
			</div>

			<button
				type="button"
				onClick={onSeeMore}
				className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 cursor-pointer">
				Lihat Semua Bukti
				<ArrowRight size={13} />
			</button>
		</div>
	);
}
