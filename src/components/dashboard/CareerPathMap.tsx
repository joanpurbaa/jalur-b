import {
	User,
	BarChart3,
	TrendingUp,
	Compass,
	Layers,
	Cpu,
	Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CareerPathNode from "./CareerPathNode";
import IconTile from "../ui/IconTile";
import StatusBadge from "../ui/StatusBadge";
import { getScoreStatus } from "../../lib/status";

const roleIcons: LucideIcon[] = [
	TrendingUp,
	BarChart3,
	Compass,
	Layers,
	Cpu,
	Sparkles,
];

const SLOTS = [
	{ top: 18, left: 76 },
	{ top: 82, left: 24 },
	{ top: 82, left: 76 },
	{ top: 18, left: 24 },
	{ top: 50, left: 84 },
	{ top: 50, left: 16 },
];

function positionFor(index: number): { top: number; left: number } {
	if (index < SLOTS.length) return SLOTS[index];
	const angle = -Math.PI / 2 + ((index - SLOTS.length) * 2 * Math.PI) / 8;
	return {
		top: Math.max(15, Math.min(85, 50 + Math.sin(angle) * 35)),
		left: Math.max(15, Math.min(85, 50 + Math.cos(angle) * 35)),
	};
}

interface CareerPathMapProps {
	currentRoleName: string;
	roles: { name: string; match: number; prepMonths?: number }[];
	selectedIndex?: number;
	onSelectRole?: (index: number) => void;
}

export default function CareerPathMap({
	currentRoleName,
	roles,
	selectedIndex = 0,
	onSelectRole,
}: CareerPathMapProps) {
	return (
		<div>
			{/* Desktop Interactive 3D Graph */}
			<div className="hidden md:block card-3d p-6 relative h-[560px] overflow-hidden bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
				{/* Concentric radar rings */}
				<div
					aria-hidden
					className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full border border-dashed border-emerald-500/20"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[430px] h-[430px] rounded-full border border-dashed border-teal-500/15"
				/>

				<div className="relative z-20 flex items-center justify-between text-xs text-neutral/60 mb-2">
					<span className="font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-3 py-1 rounded-full">
						Peta Eksplorasi Peran · Klik kartu untuk melihat detail
					</span>
					<span className="font-semibold">{roles.length} opsi jalur karier</span>
				</div>

				<svg
					className="absolute inset-0 w-full h-full pointer-events-none"
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					aria-hidden>
					<defs>
						<linearGradient id="pivotEdgeActive" x1="0" y1="0" x2="1" y2="1">
							<stop offset="0%" stopColor="#10b981" />
							<stop offset="100%" stopColor="#0ea5e9" />
						</linearGradient>
					</defs>
					{roles.map((role, index) => {
						const isSelected = index === selectedIndex;
						const pos = positionFor(index);
						const midX = (50 + pos.left) / 2;
						const midY = (50 + pos.top) / 2 - 5;
						const d = `M 50 50 Q ${midX} ${midY} ${pos.left} ${pos.top}`;
						return (
							<g key={role.name}>
								<path
									d={d}
									fill="none"
									stroke={
										isSelected
											? "url(#pivotEdgeActive)"
											: "rgba(15,23,42,0.14)"
									}
									strokeWidth={isSelected ? "0.7" : "0.4"}
								/>
								{isSelected && (
									<path
										d={d}
										fill="none"
										stroke="#10b981"
										strokeWidth="0.7"
										strokeDasharray="2 2"
										className="motion-safe:animate-dash-flow"
									/>
								)}
							</g>
						);
					})}
				</svg>

				<CareerPathNode
					variant="center"
					icon={User}
					title={currentRoleName}
					style={{ top: "50%", left: "50%" }}
				/>

				{roles.map((role, index) => {
					const pos = positionFor(index);
					const isSelected = index === selectedIndex;
					return (
						<CareerPathNode
							key={role.name}
							icon={roleIcons[index % roleIcons.length]}
							title={role.name}
							match={role.match}
							selected={isSelected}
							onClick={() => onSelectRole?.(index)}
							float={index % 2 === 0 ? "animate-float" : "animate-float-slow"}
							style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
						/>
					);
				})}
			</div>

			{/* Mobile Vertical Connected List */}
			<div className="md:hidden card-3d p-5 space-y-4">
				<div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 flex items-center gap-3 shadow-md">
					<span className="inline-flex w-10 h-10 rounded-xl bg-white/20 items-center justify-center shrink-0">
						<User size={20} />
					</span>
					<div className="min-w-0">
						<span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
							Titik Berangkat Saat Ini
						</span>
						<h4 className="text-sm font-extrabold truncate">
							{currentRoleName}
						</h4>
					</div>
				</div>

				<div className="relative pl-5 space-y-3 before:content-[''] before:absolute before:left-2 before:top-1 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:to-teal-300">
					{roles.map((role, index) => {
						const isSelected = index === selectedIndex;
						const Icon = roleIcons[index % roleIcons.length];
						const status = getScoreStatus(role.match);
						return (
							<div key={role.name} className="relative">
								<span
									aria-hidden
									className={`absolute -left-[17px] top-5 w-3 h-3 rounded-full border-2 border-white ${
										isSelected ? "bg-emerald-600 scale-125" : "bg-teal-400"
									}`}
								/>
								<button
									type="button"
									onClick={() => onSelectRole?.(index)}
									className={`press w-full text-left rounded-2xl p-3.5 border transition flex items-center justify-between gap-3 ${
										isSelected
											? "bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/30"
											: "bg-white border-slate-200/80"
									}`}>
									<div className="flex items-center gap-3 min-w-0">
										<IconTile icon={Icon} tone="jalur-karier" size="sm" />
										<div className="min-w-0">
											<p className="text-sm font-extrabold text-neutral truncate">
												{role.name}
											</p>
											{role.prepMonths != null && (
												<p className="text-xs text-neutral/55">
													Persiapan ~{role.prepMonths} bulan
												</p>
											)}
										</div>
									</div>
									<StatusBadge
										variant={status}
										label={`${role.match}%`}
										size="sm"
									/>
								</button>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
