import { Clock, Compass, FolderCheck, Rocket } from "lucide-react";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";

interface PrepTimeCardProps {
	months: number;
	description: string;
}

function formatPrepMonths(months: number): string {
	if (!Number.isFinite(months) || months <= 0) return "Kurang dari 1 bln";
	const years = Math.floor(months / 12);
	const rem = months % 12;
	if (years >= 1)
		return rem > 0 ? `${years} thn ${rem} bln` : `${years} thn`;
	return `${Math.round(months)} bln`;
}

export default function PrepTimeCard({
	months,
	description,
}: PrepTimeCardProps) {
	const safeMonths = Math.max(
		1,
		Math.round(Number.isFinite(months) ? months : 3),
	);
	const m1 = Math.max(1, Math.round(safeMonths * 0.35));
	const m2 = Math.max(m1 + 1, Math.round(safeMonths * 0.75));

	const milestones = [
		{
			icon: Compass,
			phase: `Bln 1–${m1}`,
			title: "Fondasi & Eksplorasi",
			detail: "Pelajari skill jembatan utama dan mulai latihan terarah.",
		},
		{
			icon: FolderCheck,
			phase: `Bln ${m1 + 1}–${m2}`,
			title: "Proyek & Bukti Nyata",
			detail: "Terapkan di proyek kecil dan simpan hasilnya di Bukti Karier.",
		},
		{
			icon: Rocket,
			phase: `Bln ${m2}–${safeMonths}`,
			title: "Siap Transisi",
			detail: "Perbarui CV, portofolio, dan jejaring di peran target.",
		},
	];

	return (
		<Card padding="lg">
			<div className="flex items-center gap-3 mb-3">
				<IconTile icon={Clock} tone="neutral" size="sm" />
				<div>
					<p className="text-xs text-slate-500 font-medium">
						Estimasi Waktu Persiapan
					</p>
					<p className="num-display text-2xl text-slate-900 mt-0.5">
						{formatPrepMonths(months)}
					</p>
				</div>
			</div>

			<p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
				{description ||
					"Rencana bertahap yang realistis sambil tetap menjalankan pekerjaan utamamu."}
			</p>

			<div className="relative pl-4 space-y-3 border-l border-slate-200">
				{milestones.map((ms) => {
					const Icon = ms.icon;
					return (
						<div key={ms.title} className="relative">
							<span
								aria-hidden
								className="absolute -left-[21px] top-2 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white"
							/>
							<div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3">
								<div className="flex items-center justify-between gap-2">
									<span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
										<Icon size={13} className="text-indigo-600" />
										{ms.title}
									</span>
									<span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
										{ms.phase}
									</span>
								</div>
								<p className="text-xs text-slate-600 mt-1">{ms.detail}</p>
							</div>
						</div>
					);
				})}
			</div>
		</Card>
	);
}
