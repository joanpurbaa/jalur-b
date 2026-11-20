import { useState } from "react";
import { Database, RotateCcw, Trash2 } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import SimulationIntro from "./simulation/SimulationIntro";
import SimulationSetup from "./simulation/SimulationSetup";
import SimulationLoading from "./simulation/SimulationLoading";
import SimulationResult from "./simulation/SimulationResult";
import { layoffSimulationApi } from "../../services/layoffSimulation";
import {
	loadManualCache,
	removeManualCache,
	saveManualCache,
} from "../../lib/manualCache";
import type {
	LayoffSimulationRequest,
	LayoffSimulationResult,
} from "../../types/layoffSimulation";

type SimulationStep = "intro" | "setup" | "loading" | "result";

interface CachedSimulation {
	config: LayoffSimulationRequest;
	result: LayoffSimulationResult;
}

const initialConfig: LayoffSimulationRequest = {
	exit_type: "efficiency_due_to_loss",
	normative_rights_collectable: true,
	search_time_months: 3,
	horizon_months: 12,
	preferred_role_name: "",
};

export default function Simulasi() {
	const initialCache = loadManualCache<CachedSimulation>("simulation_last");
	const [step, setStep] = useState<SimulationStep>(() =>
		initialCache?.data?.result ? "result" : "intro",
	);
	const [config, setConfig] = useState<LayoffSimulationRequest>(
		() => initialCache?.data?.config ?? initialConfig,
	);
	const [result, setResult] = useState<LayoffSimulationResult | null>(
		() => initialCache?.data?.result ?? null,
	);
	const [cachedAt, setCachedAt] = useState<string | null>(
		() => initialCache?.savedAt ?? null,
	);
	const [runKey, setRunKey] = useState(0);

	const headerContent: Record<
		SimulationStep,
		{ title: string; subtitle: string }
	> = {
		intro: {
			title: "Kalau besok kamu kehilangan pekerjaan, apa yang terjadi?",
			subtitle:
				"Simulasikan ketahanan karier dan finansialmu secara tenang berdasarkan data yang sudah kamu simpan di Jalur B.",
		},
		setup: {
			title: "Siapkan Skenario Simulasimu",
			subtitle:
				"Pilih skenario PHK, atur asumsi waktu pencarian kerja, dan tentukan peran tujuan transisi.",
		},
		loading: {
			title: "Menjalankan Simulasi Ketahanan",
			subtitle:
				"Menghitung hak normatif, napas finansial, dan rekomendasi langkah pemulihanmu.",
		},
		result: {
			title: "Hasil Simulasi Risiko & Ketahanan PHK",
			subtitle:
				"Berdasarkan skenario dan kondisimu saat ini, ini peta proyeksi serta langkah aksi yang bisa kamu ambil.",
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
		saveManualCache<CachedSimulation>("simulation_last", {
			config: payload,
			result: res,
		});
		setCachedAt(new Date().toISOString());
	};

	const handleClearCachedSimulation = () => {
		removeManualCache("simulation_last");
		setResult(null);
		setCachedAt(null);
		setStep("intro");
	};

	return (
		<div>
			<PageHeader
				title={headerContent[step].title}
				subtitle={headerContent[step].subtitle}
				action={
					step === "result" && cachedAt ? (
						<div className="flex flex-wrap items-center gap-2">
							<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
								<Database size={12} className="text-indigo-600" />
								Tersimpan di cache lokal
							</span>
							<button
								type="button"
								onClick={() => setStep("setup")}
								className="press inline-flex items-center gap-1.5 min-h-[34px] px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer">
								<RotateCcw size={12} />
								Ubah Skenario
							</button>
							<button
								type="button"
								onClick={handleClearCachedSimulation}
								title="Hapus cache simulasi dan kembali ke pengantar"
								className="press inline-flex items-center gap-1.5 min-h-[34px] px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-rose-200 hover:bg-rose-50 text-xs font-semibold text-slate-600 hover:text-rose-700 transition cursor-pointer">
								<Trash2 size={12} />
								Reset Simulasi
							</button>
						</div>
					) : undefined
				}
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
			{step === "result" && result && (
				<SimulationResult
					result={result}
					onRerun={() => setStep("setup")}
				/>
			)}
		</div>
	);
}
