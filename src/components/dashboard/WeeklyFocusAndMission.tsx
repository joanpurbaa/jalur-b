import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Trophy } from "lucide-react";
import InsightCard from "./InsightCard";
import NextActionCard from "./NextActionCard";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
import MeterBar from "../ui/MeterBar";
import { dashboardApi } from "../../services/dashboard";
import { careerHealthApi } from "../../services/careerHealth";
import { layoffSimulationApi } from "../../services/layoffSimulation";
import { financialApi } from "../../services/financial";
import { parseDecimal } from "../../lib/parseNumeric";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";

interface ChecklistItem {
	id: string;
	label: string;
	detail: string;
	done: boolean;
	href?: string;
	onClick?: () => void;
}

export default function WeeklyFocusAndMission() {
	const { refreshKey, openCareerAssessment } = useCareerAssessment();
	const [items, setItems] = useState<ChecklistItem[]>([]);

	useEffect(() => {
		let active = true;
		const loadChecklist = async () => {
			const [dashRes, healthRes, finRes, simRes] = await Promise.allSettled([
				dashboardApi.get(),
				careerHealthApi.latest(),
				financialApi.get(),
				layoffSimulationApi.latest(),
			]);
			if (!active) return;

			const dash = dashRes.status === "fulfilled" ? dashRes.value : null;
			const hasProfile = Boolean(
				dash?.onboarding_completed || dash?.profile?.full_name,
			);
			const hasHealth = healthRes.status === "fulfilled" && Boolean(healthRes.value);
			const hasEvidence = Boolean(dash && dash.evidence.total > 0);
			const hasFinancial = Boolean(
				(finRes.status === "fulfilled" &&
					parseDecimal(finRes.value.runway.financial_runway_months) > 0) ||
					(dash?.financial && parseDecimal(dash.financial.runway_months) > 0),
			);
			const hasSim = simRes.status === "fulfilled" && Boolean(simRes.value);

			setItems([
				{
					id: "profile",
					label: "Profil & peran kerja tercatat",
					detail: hasProfile
						? `${dash?.profile?.current_role_name || "Profil aktif"}`
						: "Lengkapi profil karier dasar",
					done: hasProfile,
					href: "/dashboard/profil",
				},
				{
					id: "health",
					label: "Penilaian kesehatan karier",
					detail: hasHealth
						? "Skor & analisis faktor sudah aktif"
						: "Ukur kondisi karier saat ini",
					done: hasHealth,
					onClick: openCareerAssessment,
				},
				{
					id: "evidence",
					label: "Simpan minimal 1 bukti karier",
					detail:
						dash && dash.evidence.total > 0
							? `${dash.evidence.total} bukti tersimpan di portofolio`
							: "Dokumentasikan pencapaian terbaikmu",
					done: hasEvidence,
					href: "/dashboard/bukti-karier",
				},
				{
					id: "financial",
					label: "Hitung runway finansial",
					detail: hasFinancial
						? "Parameter pengeluaran & dana siap"
						: "Atur pengeluaran bulanan & tabungan",
					done: hasFinancial,
					href: "/dashboard/finansial",
				},
				{
					id: "simulation",
					label: "Jalankan simulasi 'What If'",
					detail: hasSim
						? "Skenario ketahanan sudah disimulasikan"
						: "Uji ketahanan finansial bila terjadi PHK",
					done: hasSim,
					href: "/dashboard/simulasi",
				},
			]);
		};
		void loadChecklist();
		return () => {
			active = false;
		};
	}, [refreshKey, openCareerAssessment]);

	const doneCount = items.filter((i) => i.done).length;
	const totalCount = items.length || 5;
	const pct = Math.round((doneCount / totalCount) * 100);

	return (
		<div className="space-y-7">
			<NextActionCard />

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
				<div className="lg:col-span-7">
					<InsightCard />
				</div>

				<div className="lg:col-span-5">
					<Card padding="lg" className="h-full flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between gap-3 mb-3">
								<div className="flex items-center gap-3">
									<IconTile icon={Trophy} tone="jalur-karier" size="sm" />
									<div>
										<h3 className="text-base font-extrabold text-neutral">
											Misi Kesiapan Jalur B
										</h3>
										<p className="text-xs text-neutral/55">
											{doneCount} dari {totalCount} fondasi selesai
										</p>
									</div>
								</div>
								<span className="num-display text-xl text-emerald-600">
									{pct}%
								</span>
							</div>

							<MeterBar
								value={pct}
								max={100}
								status={pct >= 80 ? "healthy" : pct >= 40 ? "warning" : "insight"}
								height="sm"
								className="mb-4"
								ariaLabel={`Progres kesiapan ${pct}%`}
							/>

							<ul className="space-y-2">
								{items.map((item) => {
									const inner = (
										<div
											className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition ${
												item.done
													? "bg-emerald-50/50 border-emerald-200/70 text-neutral"
													: "bg-white/70 border-slate-200/80 hover:border-indigo-300 text-neutral"
											}`}>
											{item.done ? (
												<CheckCircle2
													size={17}
													className="text-emerald-600 shrink-0 mt-0.5"
												/>
											) : (
												<Circle
													size={17}
													className="text-slate-400 shrink-0 mt-0.5"
												/>
											)}
											<div className="min-w-0 flex-1">
												<p
													className={`text-xs font-bold ${
														item.done ? "text-emerald-950" : "text-neutral"
													}`}>
													{item.label}
												</p>
												<p className="text-[11px] text-neutral/60 truncate">
													{item.detail}
												</p>
											</div>
										</div>
									);

									return (
										<li key={item.id}>
											{item.href ? (
												<Link to={item.href} className="block">
													{inner}
												</Link>
											) : item.onClick ? (
												<button
													type="button"
													onClick={item.onClick}
													className="w-full text-left cursor-pointer">
													{inner}
												</button>
											) : (
												inner
											)}
										</li>
									);
								})}
							</ul>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
