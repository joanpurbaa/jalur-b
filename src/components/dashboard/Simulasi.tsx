import { useState } from "react";
import PageHeader from "../layouts/PageHeader";
import SimulationIntro from "./simulation/SimulationIntro";
import SimulationSetup from "./simulation/SimulationSetup";
import SimulationLoading from "./simulation/SimulationLoading";
import SimulationResult from "./simulation/SimulationResult";

type SimulationStep = "intro" | "setup" | "loading" | "result";

export default function Simulasi() {
	const [step, setStep] = useState<SimulationStep>("intro");
	const [selectedScenario, setSelectedScenario] = useState("besok");

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
				"Kami akan menggunakan kondisi kamu saat ini sebagai titik awal untuk memproyeksikan berbagai skenario krisis.",
		},
		loading: {
			title: "Menjalankan simulasi",
			subtitle: "Mohon tunggu sebentar.",
		},
		result: {
			title: "Kalau besok kamu kehilangan pekerjaan…",
			subtitle: "Berdasarkan kondisi kamu saat ini, ini yang kemungkinan terjadi.",
		},
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
					selectedScenario={selectedScenario}
					onSelectScenario={setSelectedScenario}
					onStart={() => setStep("loading")}
				/>
			)}
			{step === "loading" && (
				<SimulationLoading onComplete={() => setStep("result")} />
			)}
			{step === "result" && <SimulationResult />}
		</div>
	);
}
