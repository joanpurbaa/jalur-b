import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import IconTile from "../ui/IconTile";

interface EarlyWarningCardProps {
	description?: string;
}

export default function EarlyWarningCard({
	description,
}: EarlyWarningCardProps) {
	return (
		<div
			role="region"
			aria-label="Sinyal Perhatian Dini"
			className="relative overflow-hidden rounded-3xl p-6 sm:p-7 border-2 border-amber-300/80 bg-gradient-to-r from-amber-50 via-orange-50/80 to-rose-50/70 shadow-[0_14px_34px_-14px_rgba(217,119,6,0.28)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
			<div className="flex items-start gap-4">
				<div className="relative shrink-0">
					<span
						aria-hidden
						className="absolute inset-0 rounded-[14px] bg-amber-400/50 motion-safe:animate-pulse-ring"
					/>
					<IconTile icon={AlertTriangle} tone="risiko-karier" size="md" />
				</div>

				<div>
					<div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-800 mb-1">
						<span className="w-2 h-2 rounded-full bg-amber-500 motion-safe:animate-pulse" />
						<span>Early Warning · Radar Sinyal Dini</span>
					</div>
					<h4 className="text-base sm:text-lg font-extrabold text-neutral mb-1">
						Sinyal Perubahan yang Perlu Kamu Antisipasi
					</h4>
					<p className="text-sm text-neutral/75 leading-relaxed max-w-2xl">
						{description ||
							"Belum ada sinyal peringatan mendesak untuk saat ini. Tetap perbarui portofolio bukti kerjamu secara berkala."}
					</p>
				</div>
			</div>

			<Link
				to="/dashboard/simulasi"
				className="press shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-[0_8px_18px_-6px_rgba(217,119,6,0.5)]">
				Uji Dampaknya di Simulasi
				<ArrowRight size={16} />
			</Link>
		</div>
	);
}
