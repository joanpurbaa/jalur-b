import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Card from "../ui/Card";
import { SecondaryButton } from "../ui/PrimaryButton";

interface EarlyWarningCardProps {
	description?: string;
}

export default function EarlyWarningCard({
	description,
}: EarlyWarningCardProps) {
	return (
		<Card
			padding="md"
			className="border-amber-200/90 border-l-4 border-l-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div className="flex items-start gap-3.5">
				<span className="inline-flex w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 items-center justify-center shrink-0 mt-0.5">
					<AlertTriangle size={17} className="text-amber-700" strokeWidth={1.85} />
				</span>

				<div>
					<p className="text-xs font-semibold text-amber-800">
						Perhatian Dini
					</p>
					<h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
						Sinyal Perubahan yang Perlu Diantisipasi
					</h4>
					<p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
						{description ||
							"Belum ada sinyal peringatan mendesak untuk saat ini. Tetap perbarui portofolio bukti kerjamu secara berkala."}
					</p>
				</div>
			</div>

			<Link to="/dashboard/simulasi" className="shrink-0">
				<SecondaryButton icon={<ArrowRight size={15} />}>
					Uji Dampaknya di Simulasi
				</SecondaryButton>
			</Link>
		</Card>
	);
}
