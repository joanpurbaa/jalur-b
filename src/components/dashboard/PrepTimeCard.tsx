import { Clock, Compass, FolderCheck, Rocket } from "lucide-react";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";

interface PrepTimeCardProps {
	months: number;
	description: string;
}

function formatPrepMonths(months: number): string {
	if (!Number.isFinite(months) || months <= 0) return "Kurang dari 1 bulan";
	const years = Math.floor(months / 12);
	const rem = months % 12;
	if (years >= 1)
		return rem > 0 ? `${years} tahun ${rem} bulan` : `${years} tahun`;
	return `${Math.round(months)} bulan`;
}

export default function PrepTimeCard({
	months,
	description,
}: PrepTimeCardProps) {
	const safeMonths = Math.max(1, Math.round(Number.isFinite(months) ? months : 3));
	const m1 = Math.max(1, Math.round(safeMonths * 0.35));
	const m2 = Math.max(m1 + 1, Math.round(safeMonths * 0.75));

	const milestones = [
		{
			icon: Compass,
			phase: `Bulan 1–${m1}`,
			title: "Fondasi & Eksplorasi",
			detail: "Pelajari skill jembatan utama dan mulai latihan terarah.",
		},
		{
			icon: FolderCheck,
			phase: `Bulan ${m1 + 1}–${m2}`,
			title: "Proyek & Bukti Nyata",
			detail: "Terapkan di proyek kecil dan simpan hasilnya di Bukti Karier.",
		},
		{
			icon: Rocket,
			phase: `Bulan ${m2}–${safeMonths}`,
			title: "Siap Transisi",
			detail: "Perbarui CV, portofolio, dan jejaring di peran target.",
		},
	];

	return (
		<Card padding="lg">
			<div className="flex items-center gap-3 mb-3">
				<IconTile icon={Clock} tone="teal" size="sm" />
				<div>
					<p className="text-xs text-neutral/55 font-semibold">
						Estimasi Waktu Persiapan
					</p>
					<p className="num-display text-2xl text-neutral mt-0.5">
						{formatPrepMonths(months)}
					</p>
				</div>
			</div>

			<p className="text-xs sm:text-sm text-neutral/70 leading-relaxed mb-4">
				{description ||
					"Rencana bertahap yang realistis sambil tetap menjalankan pekerjaan utamamu."}
			</p>

			<div className="relative pl-4 space-y-3 border-l-2 border-emerald-200">
				{milestones.map((ms) => {
					const Icon = ms.icon;
					return (
						<div key={ms.title} className="relative">
							<span
								aria-hidden
								className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50"
							/>
							<div className="rounded-xl bg-slate-50/90 border border-slate-200/70 p-2.5">
								<div className="flex items-center justify-between gap-2">
									<span className="text-xs font-extrabold text-neutral flex items-center gap-1.5">
										<Icon size={13} className="text-emerald-600" />
										{ms.title}
									</span>
									<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
										{ms.phase}
									</span>
								</div>
								<p className="text-[11px] text-neutral/60 mt-1">{ms.detail}</p>
							</div>
						</div>
					);
				})}
			</div>
		</Card>
	);
}
