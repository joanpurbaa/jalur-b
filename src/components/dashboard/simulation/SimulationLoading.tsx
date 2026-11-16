import { useEffect, useState } from "react";
import {
	Activity,
	AlertTriangle,
	CheckCircle2,
	Circle,
	Loader2,
} from "lucide-react";
import Card from "../../ui/Card";
import IconTile from "../../ui/IconTile";
import MeterBar from "../../ui/MeterBar";
import { ApiError } from "../../../types/api";

const loadingSteps = [
	{
		title: "Menganalisis kondisi karier & profil peran",
		detail: "Membaca masa kerja, skor kesehatan, dan eksposur AI",
	},
	{
		title: "Menghitung hak normatif & financial runway",
		detail: "Mengestimasi pesangon (PP 35/2021) dan ketahanan dana likuid",
	},
	{
		title: "Memetakan peluang karier alternatif",
		detail: "Mencocokkan keahlianmu dengan opsi pivot terdekat",
	},
	{
		title: "Mengidentifikasi prioritas skill & bukti kerja",
		detail: "Menyaring celah kompetensi yang paling berdampak",
	},
	{
		title: "Menyusun rencana pemulihan pasca-PHK",
		detail: "Merangkai langkah konkret dari Hari 0 hingga kembali bekerja",
	},
];

interface SimulationLoadingProps {
	onRun: () => Promise<unknown>;
	onSuccess: () => void;
	onBack: () => void;
	onRetry: () => void;
}

export default function SimulationLoading({
	onRun,
	onSuccess,
	onBack,
	onRetry,
}: SimulationLoadingProps) {
	const steps = loadingSteps;
	const [activeIndex, setActiveIndex] = useState(0);
	const [runState, setRunState] = useState<"running" | "done" | "error">(
		"running",
	);
	const [runError, setRunError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		onRun()
			.then(() => {
				if (active) setRunState("done");
			})
			.catch((error) => {
				if (!active) return;
				setRunState("error");
				setRunError(
					error instanceof ApiError
						? error.message
						: "Terjadi kesalahan yang tidak diketahui.",
				);
			});
		return () => {
			active = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (runState === "error") return;
		const maxStep = runState === "done" ? steps.length : steps.length - 1;
		if (activeIndex < maxStep) {
			const delay = runState === "done" ? 220 : 520;
			const stepTimer = setTimeout(() => setActiveIndex((i) => i + 1), delay);
			return () => clearTimeout(stepTimer);
		}
	}, [activeIndex, runState, steps.length]);

	useEffect(() => {
		if (runState === "done" && activeIndex >= steps.length) {
			const finishTimer = setTimeout(onSuccess, 350);
			return () => clearTimeout(finishTimer);
		}
	}, [runState, activeIndex, steps.length, onSuccess]);

	const pct = Math.min(
		100,
		Math.round(((activeIndex + (runState === "done" ? 1 : 0.35)) / steps.length) * 100),
	);

	return (
		<Card
			padding="lg"
			className="max-w-2xl mx-auto flex flex-col items-center text-center">
			<IconTile icon={Activity} tone="indigo" size="lg" className="mb-4" />

			<h2 className="text-xl sm:text-2xl font-bold text-slate-900">
				{runState === "error"
					? "Simulasi membutuhkan kelengkapan data"
					: "Menjalankan Simulasi Ketahanan…"}
			</h2>
			<p className="text-sm text-slate-600 mt-1 mb-5">
				{runState === "error"
					? "Periksa pesan di bawah untuk melanjutkan."
					: "Menghubungkan kondisi karier, ketentuan kerja, dan dana cadanganmu."}
			</p>

			<div className="w-full mb-6">
				<div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
					<span>Progres kalkulasi</span>
					<span className="tabular text-indigo-700">{pct}%</span>
				</div>
				<MeterBar
					value={pct}
					max={100}
					colors={["#4f46e5", "#6366f1"]}
					height="md"
					ariaLabel={`Progres simulasi ${pct}%`}
				/>
			</div>

			<div className="w-full space-y-2.5 text-left">
				{steps.map((step, index) => {
					const isDone = index < activeIndex;
					const isActive = index === activeIndex && runState !== "error";
					return (
						<div
							key={step.title}
							className={`flex items-start gap-3.5 rounded-xl p-3.5 border transition ${
								isActive
									? "border-indigo-300 bg-indigo-50/70"
									: isDone
										? "border-emerald-200 bg-emerald-50/50"
										: "border-slate-200 bg-slate-50/50 opacity-65"
							}`}>
							<div className="mt-0.5 shrink-0">
								{isDone ? (
									<CheckCircle2 size={18} className="text-emerald-600" />
								) : isActive ? (
									<Loader2
										size={18}
										className="text-indigo-600 animate-spin"
									/>
								) : (
									<Circle size={18} className="text-slate-300" />
								)}
							</div>
							<div className="min-w-0 flex-1">
								<p
									className={`text-sm font-semibold ${
										isDone
											? "text-emerald-950"
											: isActive
												? "text-indigo-950"
												: "text-slate-500"
									}`}>
									{step.title}
								</p>
								<p className="text-xs text-slate-600 mt-0.5">{step.detail}</p>
							</div>
						</div>
					);
				})}
			</div>

			{runState === "error" && runError && (
				<div className="w-full mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-left">
					<div className="flex items-start gap-2.5">
						<AlertTriangle size={18} className="text-rose-700 shrink-0 mt-0.5" />
						<div>
							<p className="text-sm font-bold text-rose-900">
								Gagal menjalankan simulasi
							</p>
							<p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
								{runError}
							</p>
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-2.5 mt-4">
						<button
							type="button"
							onClick={onBack}
							className="min-h-[40px] px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer">
							Kembali ke Konfigurasi
						</button>
						<button
							type="button"
							onClick={onRetry}
							className="min-h-[40px] px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer">
							Coba Lagi
						</button>
					</div>
				</div>
			)}
		</Card>
	);
}
