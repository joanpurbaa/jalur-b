import { Briefcase, Landmark, Info } from "lucide-react";
import { simulationData } from "../../../data/dashboardDummyData";
import { getScoreStatus } from "../../../lib/status";
import StatusBadge from "../../ui/StatusBadge";
import InfoStat from "../../ui/InfoStat";
import { PrimaryButton } from "../../ui/PrimaryButton";
import ScenarioPicker from "./ScenarioPicker";

interface SimulationSetupProps {
	selectedScenario: string;
	onSelectScenario: (id: string) => void;
	onStart: () => void;
}

export default function SimulationSetup({
	selectedScenario,
	onSelectScenario,
	onStart,
}: SimulationSetupProps) {
	const { career, financial } = simulationData.setup;
	const healthVariant = getScoreStatus(career.careerHealth);

	return (
		<div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
					<div className="flex items-center gap-3 pb-5 mb-5 border-b border-neutral/10">
						<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
							<Briefcase size={16} className="text-primary" />
						</div>
						<h3 className="text-sm font-bold text-neutral">Kondisi Karier</h3>
					</div>
					<div className="grid grid-cols-2 gap-y-5 gap-x-6">
						<InfoStat label="Role" value={career.role} />
						<InfoStat label="Lama Bekerja" value={career.tenure} />
						<InfoStat
							label="Career Health"
							value={`${career.careerHealth}/100`}
							badge={
								<StatusBadge
									label={career.careerHealthStatus}
									variant={healthVariant}
								/>
							}
						/>
						<InfoStat label="Career Risk" value={career.careerRisk} />
						<InfoStat label="AI Exposure" value={career.aiExposure} />
						<InfoStat label="Skill Relevance" value={career.skillRelevance} />
					</div>
				</div>

				<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
					<div className="flex items-center gap-3 pb-5 mb-5 border-b border-neutral/10">
						<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
							<Landmark size={16} className="text-primary" />
						</div>
						<h3 className="text-sm font-bold text-neutral">Kondisi Finansial</h3>
					</div>
					<div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-5">
						<InfoStat label="Tabungan Darurat" value={financial.tabunganDarurat} />
						<InfoStat label="Tanggungan" value={financial.tanggungan} />
						<InfoStat
							label="Pengeluaran Rutin"
							value={financial.pengeluaranRutin}
							tone="risk"
						/>
						<InfoStat label="Cicilan" value={financial.cicilan} tone="risk" />
					</div>
					<div className="bg-neutral/5 rounded-xl p-4 flex items-center justify-between">
						<div>
							<p className="text-[11px] font-semibold text-neutral/50 uppercase tracking-wide">
								Financial Runway Saat Ini
							</p>
							<p className="text-xs text-neutral/50 mt-0.5">
								Tanpa perubahan gaya hidup
							</p>
						</div>
						<p className="text-xl font-bold text-primary">
							{financial.currentRunway.toFixed(1)} Bulan
						</p>
					</div>
				</div>
			</div>

			<div className="bg-primary/5 rounded-2xl border border-primary/20 border-l-4 border-l-primary p-8">
				<h3 className="text-sm font-bold text-neutral mb-4">
					Konfigurasi Skenario
				</h3>
				<p className="text-sm text-neutral/70 mb-4">
					Kapan income berhenti (skenario terburuk)?
				</p>
				<ScenarioPicker selected={selectedScenario} onSelect={onSelectScenario} />

				<div className="flex flex-col items-center mt-6">
					<PrimaryButton onClick={onStart}>Mulai Simulasi</PrimaryButton>
					<div className="flex items-center gap-1.5 mt-3">
						<Info size={12} className="text-neutral/40" />
						<p className="text-xs text-neutral/50">
							Ini hanya simulasi. Data asli kamu tidak akan berubah.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
