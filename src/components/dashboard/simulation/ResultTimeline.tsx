import { AlertTriangle, Clock, Flag, ShieldCheck } from "lucide-react";
import Card from "../../ui/Card";
import { formatDecimal1 } from "../../../lib/format";

interface ResultTimelineProps {
	runwayMonths: number;
	targetMonths: number;
}

interface TimelineMilestone {
	month: number;
	tag: string;
	title: string;
	description: string;
	zone: "safe" | "caution" | "danger" | "target";
}

const ZONE_STYLE = {
	safe: {
		dot: "bg-emerald-600 ring-emerald-100",
		badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
		card: "border-emerald-200 bg-emerald-50/40",
	},
	caution: {
		dot: "bg-amber-600 ring-amber-100",
		badge: "bg-amber-50 text-amber-800 border-amber-200",
		card: "border-amber-200 bg-amber-50/40",
	},
	danger: {
		dot: "bg-rose-600 ring-rose-100",
		badge: "bg-rose-50 text-rose-800 border-rose-200",
		card: "border-rose-200 bg-rose-50/40",
	},
	target: {
		dot: "bg-indigo-600 ring-indigo-100",
		badge: "bg-indigo-50 text-indigo-800 border-indigo-200",
		card: "border-indigo-200 bg-indigo-50/40",
	},
};

export default function ResultTimeline({
	runwayMonths,
	targetMonths,
}: ResultTimelineProps) {
	const safeRunway = Math.max(0, runwayMonths);
	const safeTarget = Math.max(1, targetMonths);
	const halfMonth = Math.round(safeRunway * 5) / 10;

	const milestones: TimelineMilestone[] = [
		{
			month: 0,
			tag: "Hari 0",
			title: "Transisi Dimulai",
			description: "Gaji bulanan berhenti; dana darurat & kompensasi mulai bekerja.",
			zone: "safe",
		},
	];

	if (safeRunway >= 1.5) {
		milestones.push({
			month: halfMonth,
			tag: `Bulan ${formatDecimal1(halfMonth)}`,
			title: "Zona Evaluasi Tengah",
			description: "50% runway terpakai; perketat pengeluaran non-esensial.",
			zone: "caution",
		});
	}

	milestones.push({
		month: safeRunway,
		tag: `Bulan ${formatDecimal1(safeRunway)}`,
		title: "Batas Runway Saat Ini",
		description:
			safeRunway >= safeTarget
				? "Dana cadanganmu melampaui target aman minimum."
				: "Titik ketika dana likuid saat ini habis bila belum ada income baru.",
		zone: safeRunway >= safeTarget ? "safe" : "danger",
	});

	milestones.push({
		month: safeTarget,
		tag: `Target ${formatDecimal1(safeTarget)} bln`,
		title: "Target Ketahanan Ideal",
		description:
			safeRunway >= safeTarget
				? "Target sudah tercapai dengan surplus aman."
				: `Butuh +${formatDecimal1(safeTarget - safeRunway)} bulan tambahan untuk mencapai titik ini.`,
		zone: safeRunway >= safeTarget ? "safe" : "target",
	});

	return (
		<Card padding="lg">
			<div className="flex flex-wrap items-center justify-between gap-2 mb-5">
				<div>
					<h3 className="text-base sm:text-lg font-bold text-slate-900">
						Garis Waktu Ketahanan (Hari 0 → Target)
					</h3>
					<p className="text-xs sm:text-sm text-slate-600 mt-0.5">
						Visualisasi zona aman, evaluasi, dan batas kritis dana cadanganmu
					</p>
				</div>
				<div className="flex items-center gap-3 text-xs font-semibold">
					<span className="inline-flex items-center gap-1 text-emerald-700">
						<ShieldCheck size={13} /> Zona Aman
					</span>
					<span className="inline-flex items-center gap-1 text-amber-700">
						<Clock size={13} /> Evaluasi
					</span>
					<span className="inline-flex items-center gap-1 text-rose-700">
						<AlertTriangle size={13} /> Batas Dana
					</span>
				</div>
			</div>

			<div className="h-2.5 w-full rounded-full overflow-hidden grid grid-cols-12 mb-6 bg-slate-100">
				<div className="col-span-5 bg-emerald-500" />
				<div className="col-span-4 bg-amber-400" />
				<div className="col-span-3 bg-rose-500" />
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
				{milestones.map((m) => {
					const z = ZONE_STYLE[m.zone];
					return (
						<div
							key={m.tag + m.title}
							className={`rounded-xl border p-4 flex flex-col justify-between ${z.card}`}>
							<div>
								<div className="flex items-center justify-between gap-2 mb-2">
									<span
										className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${z.badge}`}>
										<Flag size={11} />
										{m.tag}
									</span>
									<span className={`w-2.5 h-2.5 rounded-full ring-4 ${z.dot}`} />
								</div>
								<p className="text-sm font-bold text-slate-900">{m.title}</p>
							</div>
							<p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
								{m.description}
							</p>
						</div>
					);
				})}
			</div>
		</Card>
	);
}
