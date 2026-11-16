import { Ban, Briefcase, GitFork, Search, Wallet } from "lucide-react";
import IconTile from "../../ui/IconTile";
import { Stagger, StaggerItem } from "../../ui/Motion";

const iconMap = { Ban, Wallet, Search, GitFork, Briefcase };

const journey: {
	id: string;
	step: string;
	title: string;
	description: string;
	icon: keyof typeof iconMap;
}[] = [
	{
		id: "phk",
		step: "Tahap 01",
		title: "Skenario PHK / Transisi",
		description: "Memetakan hak pesangon, kompensasi, dan berhentinya income rutin.",
		icon: "Ban",
	},
	{
		id: "runway",
		step: "Tahap 02",
		title: "Daya Tahan Financial Runway",
		description: "Menghitung berapa bulan dana likuid mampu menutup kebutuhan pokok.",
		icon: "Wallet",
	},
	{
		id: "job-search",
		step: "Tahap 03",
		title: "Masa Pencarian Kerja",
		description: "Mengukur kesiapan skill, bukti karier, dan durasi cari kerja.",
		icon: "Search",
	},
	{
		id: "pivot",
		step: "Tahap 04",
		title: "Peluang Career Pivot",
		description: "Menemukan opsi peran alternatif dengan kecocokan tertinggi.",
		icon: "GitFork",
	},
	{
		id: "reemployed",
		step: "Tahap 05",
		title: "Kembali Berpenghasilan",
		description: "Rencana aksi prioritas agar kamu pulih lebih cepat dan tenang.",
		icon: "Briefcase",
	},
];

export default function JourneyTimeline() {
	return (
		<div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 relative">
			<div className="flex flex-wrap items-center justify-between gap-2 mb-5">
				<span className="text-xs font-semibold text-indigo-700">
					Alur Simulasi · 5 Tahap Proyeksi
				</span>
				<span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
					PP 35/2021
				</span>
			</div>

			<div className="relative">
				<div
					aria-hidden
					className="absolute left-[18px] top-4 bottom-4 w-px bg-slate-200"
				/>
				<Stagger className="space-y-3.5">
					{journey.map((item) => {
						const Icon = iconMap[item.icon];
						return (
							<StaggerItem
								key={item.id}
								className="flex items-start gap-3.5 relative">
								<IconTile
									icon={Icon}
									tone="indigo"
									size="sm"
									className="z-10 ring-4 ring-slate-50"
								/>
								<div className="rounded-xl bg-white border border-slate-200 px-4 py-3 flex-1">
									<div className="flex items-center justify-between gap-2">
										<p className="text-sm font-bold text-slate-900">
											{item.title}
										</p>
										<span className="text-xs font-medium text-slate-500 shrink-0">
											{item.step}
										</span>
									</div>
									<p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
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
