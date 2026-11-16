import {
	User,
	BarChart3,
	TrendingUp,
	Compass,
	Layers,
	Cpu,
	Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CareerPathNode from "./CareerPathNode";
import Card from "../ui/Card";

const roleIcons: LucideIcon[] = [
	TrendingUp,
	BarChart3,
	Compass,
	Layers,
	Cpu,
	Target,
];

/**
 * Koordinat terkalibrasi aman di dalam area canvas agar seluruh kartu
 * node (termasuk baris atas dan bawah) tampil penuh tanpa terpotong.
 */
const SLOTS = [
	{ top: 20, left: 76 },
	{ top: 79, left: 24 },
	{ top: 79, left: 76 },
	{ top: 20, left: 24 },
	{ top: 50, left: 82 },
	{ top: 50, left: 18 },
];

function positionFor(index: number): { top: number; left: number } {
	if (index < SLOTS.length) return SLOTS[index];
	const angle = -Math.PI / 2 + ((index - SLOTS.length) * 2 * Math.PI) / 8;
	return {
		top: Math.max(20, Math.min(79, 50 + Math.sin(angle) * 29)),
		left: Math.max(18, Math.min(82, 50 + Math.cos(angle) * 32)),
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
			{/* Desktop Interactive Graph */}
			<Card padding="md" className="hidden md:block">
				<div className="flex items-center justify-between text-xs text-slate-500 pb-3 mb-2 border-b border-slate-100">
					<span className="font-medium">
						Klik salah satu peran alternatif untuk melihat gap skill & estimasi
						persiapan
					</span>
					<span className="font-semibold text-slate-700">
						{roles.length} opsi peran
					</span>
				</div>

				<div className="relative h-[470px] w-full rounded-xl bg-slate-50/70 border border-slate-100 overflow-hidden">
					{/* Concentric guides */}
					<div
						aria-hidden
						className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[230px] h-[230px] rounded-full border border-dashed border-slate-300/70"
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-dashed border-slate-200"
					/>

					<svg
						className="absolute inset-0 w-full h-full pointer-events-none"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
						aria-hidden>
						{roles.map((role, index) => {
							const isSelected = index === selectedIndex;
							const pos = positionFor(index);
							const midX = (50 + pos.left) / 2;
							const midY = (50 + pos.top) / 2 - 4;
							const d = `M 50 50 Q ${midX} ${midY} ${pos.left} ${pos.top}`;
							return (
								<g key={role.name}>
									<path
										d={d}
										fill="none"
										stroke={isSelected ? "#4f46e5" : "#cbd5e1"}
										strokeWidth={isSelected ? "0.65" : "0.4"}
									/>
									{isSelected && (
										<path
											d={d}
											fill="none"
											stroke="#818cf8"
											strokeWidth="0.65"
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
								style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
							/>
						);
					})}
				</div>
			</Card>

			{/* Mobile Vertical Connected List */}
			<Card padding="md" className="md:hidden space-y-4">
				<div className="rounded-xl bg-indigo-600 text-white p-4 flex items-center gap-3">
					<span className="inline-flex w-9 h-9 rounded-lg bg-white/15 items-center justify-center shrink-0">
						<User size={18} />
					</span>
					<div className="min-w-0">
						<span className="text-[11px] font-medium text-indigo-100 block">
							Peran Saat Ini
						</span>
						<h4 className="text-sm font-bold truncate">{currentRoleName}</h4>
					</div>
				</div>

				<div className="relative pl-5 space-y-2.5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
					{roles.map((role, index) => {
						const isSelected = index === selectedIndex;
						const Icon = roleIcons[index % roleIcons.length];
						return (
							<div key={role.name} className="relative">
								<span
									aria-hidden
									className={`absolute -left-[17px] top-5 w-2.5 h-2.5 rounded-full border-2 border-white ${
										isSelected ? "bg-indigo-600" : "bg-slate-300"
									}`}
								/>
								<button
									type="button"
									onClick={() => onSelectRole?.(index)}
									className={`press w-full min-h-[56px] text-left rounded-xl p-3 border transition flex items-center justify-between gap-3 ${
										isSelected
											? "bg-indigo-50/60 border-indigo-600"
											: "bg-white border-slate-200"
									}`}>
									<div className="flex items-center gap-3 min-w-0">
										<span
											className={`inline-flex w-8 h-8 rounded-lg items-center justify-center shrink-0 border ${
												isSelected
													? "bg-indigo-100 text-indigo-700 border-indigo-200"
													: "bg-slate-50 text-slate-600 border-slate-200"
											}`}>
											<Icon size={15} />
										</span>
										<div className="min-w-0">
											<p className="text-sm font-semibold text-slate-900 truncate">
												{role.name}
											</p>
											{role.prepMonths != null && (
												<p className="text-xs text-slate-500">
													Persiapan ~{role.prepMonths} bln
												</p>
											)}
										</div>
									</div>
									<span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full shrink-0 tabular">
										{role.match}%
									</span>
								</button>
							</div>
						);
					})}
				</div>
			</Card>
		</div>
	);
}
