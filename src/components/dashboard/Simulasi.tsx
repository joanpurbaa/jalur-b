import { useState } from "react";
import PageHeader from "../layouts/PageHeader";
import SimulationIntro from "./simulation/SimulationIntro";
import SimulationSetup from "./simulation/SimulationSetup";
import SimulationLoading from "./simulation/SimulationLoading";
import SimulationResult from "./simulation/SimulationResult";
import { layoffSimulationApi } from "../../services/layoffSimulation";
import type {
	LayoffSimulationRequest,
	LayoffSimulationResult,
} from "../../types/layoffSimulation";

type SimulationStep = "intro" | "setup" | "loading" | "result";

const initialConfig: LayoffSimulationRequest = {
	exit_type: "efficiency_due_to_loss",
	normative_rights_collectable: true,
	search_time_months: 3,
	horizon_months: 12,
	preferred_role_name: "",
};

export default function Simulasi() {
	const [step, setStep] = useState<SimulationStep>("intro");
	const [config, setConfig] = useState<LayoffSimulationRequest>(initialConfig);
	const [result, setResult] = useState<LayoffSimulationResult | null>(null);
	const [runKey, setRunKey] = useState(0);

	const headerContent: Record<
		SimulationStep,
		{ title: string; subtitle: string }
	> = {
		intro: {
			title: "Kalau besok kamu kehilangan pekerjaan, apa yang terjadi?",
			subtitle:
				"Simulasikan kondisi karier dan finansialmu berdasarkan data yang sudah kamu masukkan ke Jalur B.",
		},
		setup: {
			title: "Siapkan simulasimu",
			subtitle:
				"Konfigurasikan skenario PHK dan estimasi waktu untuk memproyeksikan daya tahan serta transisi kariermu.",
		},
		loading: {
			title: "Menjalankan simulasi",
			subtitle: "Mohon tunggu sebentar.",
		},
		result: {
			title: "Hasil Simulasi Risiko & Ketahanan PHK",
			subtitle: "Berdasarkan skenario dan kondisimu saat ini, ini proyeksi yang kemungkinan terjadi.",
		},
	};

	const runSimulation = async () => {
		const payload: LayoffSimulationRequest = {
			exit_type: config.exit_type ?? "efficiency_due_to_loss",
			normative_rights_collectable: config.normative_rights_collectable ?? true,
			search_time_months: Number(config.search_time_months) || 3,
			horizon_months: Number(config.horizon_months) || 12,
			...(config.preferred_role_name?.trim()
				? { preferred_role_name: config.preferred_role_name.trim() }
				: {}),
		};
		const res = await layoffSimulationApi.create(payload);
		setResult(res);
	};

	return (
		<div>
			<PageHeader
				title={headerContent[step].title}
				subtitle={headerContent[step].subtitle}
			/>

			{step === "intro" && <SimulationIntro onStart={() => setStep("setup")} />}
			{step === "setup" && (
				<SimulationSetup
					config={config}
					onChangeConfig={setConfig}
					onStart={() => setStep("loading")}
				/>
			)}
			{step === "loading" && (
				<SimulationLoading
					key={runKey}
					onRun={runSimulation}
					onSuccess={() => setStep("result")}
					onBack={() => setStep("setup")}
					onRetry={() => setRunKey((k) => k + 1)}
				/>
			)}
			{step === "result" && result && <SimulationResult result={result} />}
		</div>
	);
}
