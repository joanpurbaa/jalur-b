import { Ban, Wallet, Search, GitFork, Briefcase } from "lucide-react";
import IconTile from "../../ui/IconTile";
import { Stagger, StaggerItem } from "../../ui/Motion";
import type { Tone } from "../../../lib/modules";

const iconMap = { Ban, Wallet, Search, GitFork, Briefcase };

const journey: {
	id: string;
	step: string;
	title: string;
	description: string;
	icon: keyof typeof iconMap;
	tone: Tone;
}[] = [
	{
		id: "phk",
		step: "Tahap 01",
		title: "Skenario PHK / Transisi",
		description: "Memetakan hak pesangon, kompensasi, dan berhentinya income rutin.",
		icon: "Ban",
		tone: "danger",
	},
	{
		id: "runway",
		step: "Tahap 02",
		title: "Daya Tahan Financial Runway",
		description: "Menghitung berapa bulan dana likuid mampu menutup kebutuhan pokok.",
		icon: "Wallet",
		tone: "finansial",
	},
	{
		id: "job-search",
		step: "Tahap 03",
		title: "Masa Pencarian Kerja",
		description: "Mengukur kesiapan skill, bukti karier, dan durasi cari kerja.",
		icon: "Search",
		tone: "bukti-karier",
	},
	{
		id: "pivot",
		step: "Tahap 04",
		title: "Peluang Career Pivot",
		description: "Menemukan opsi peran alternatif dengan kecocokan tertinggi.",
		icon: "GitFork",
		tone: "jalur-karier",
	},
	{
		id: "reemployed",
		step: "Tahap 05",
		title: "Kembali Berpenghasilan",
		description: "Rencana aksi prioritas agar kamu pulih lebih cepat dan tenang.",
		icon: "Briefcase",
		tone: "simulasi",
	},
];

export default function JourneyTimeline() {
	return (
		<div className="rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-fuchsia-50/60 border border-indigo-100/90 p-6 sm:p-7 relative">
			<div className="flex items-center justify-between mb-5">
				<span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
					Simulation Journey · 5 Tahap Proyeksi
				</span>
				<span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-800">
					PP 35/2021 Ready
				</span>
			</div>

			<div className="relative">
				<div
					aria-hidden
					className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-rose-400 via-emerald-400 to-fuchsia-500"
				/>
				<Stagger className="space-y-4">
					{journey.map((item) => {
						const Icon = iconMap[item.icon];
						return (
							<StaggerItem
								key={item.id}
								className="flex items-start gap-4 relative">
								<IconTile
									icon={Icon}
									tone={item.tone}
									size="sm"
									className="z-10 ring-4 ring-white"
								/>
								<div className="rounded-2xl bg-white/90 border border-slate-200/80 px-4 py-3 flex-1 shadow-2xs">
									<div className="flex items-center justify-between gap-2">
										<p className="text-sm font-extrabold text-neutral">
											{item.title}
										</p>
										<span className="text-[10px] font-bold uppercase tracking-wider text-neutral/45">
											{item.step}
										</span>
									</div>
									<p className="text-xs text-neutral/65 mt-0.5 leading-relaxed">
										{item.description}
									</p>
								</div>
							</StaggerItem>
						);
					})}
				</Stagger>
			</div>
		</div>
	);
}
