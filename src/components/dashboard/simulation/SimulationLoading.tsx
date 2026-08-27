import { useEffect, useState } from "react";
import {
	RefreshCw,
	CheckCircle2,
	Circle,
	Hourglass,
	Sparkles,
} from "lucide-react";
import { simulationData } from "../../../data/dashboardDummyData";

interface SimulationLoadingProps {
	onComplete: () => void;
}

export default function SimulationLoading({
	onComplete,
}: SimulationLoadingProps) {
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		if (activeIndex >= simulationData.loadingSteps.length) {
			const finishTimer = setTimeout(onComplete, 500);
			return () => clearTimeout(finishTimer);
		}
		const stepTimer = setTimeout(() => setActiveIndex((i) => i + 1), 700);
		return () => clearTimeout(stepTimer);
	}, [activeIndex, onComplete]);

	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-md p-10 flex flex-col items-center text-center max-w-2xl mx-auto">
			<div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 relative">
				<RefreshCw size={22} className="text-primary animate-spin" />
				<Sparkles size={12} className="text-primary absolute -top-1 -right-1" />
			</div>
			<h2 className="text-2xl font-bold text-neutral mb-2">
				Jalur B sedang menjalankan simulasi…
			</h2>
			<p className="text-sm text-neutral/60 mb-8">
				Menghubungkan kondisi karier dan finansialmu.
			</p>

			<div className="w-full space-y-3">
				{simulationData.loadingSteps.map((step, index) => {
					const isDone = index < activeIndex;
					const isActive = index === activeIndex;
					return (
						<div
							key={step}
							className={`flex items-center gap-3 rounded-xl p-4 border-2 transition ${
								isActive
									? "border-primary bg-primary/5"
									: isDone
										? "border-transparent bg-neutral/5"
										: "border-transparent bg-transparent"
							}`}>
							{isDone ? (
								<CheckCircle2 size={18} className="text-primary" />
							) : (
								<Circle
									size={18}
									className={isActive ? "text-primary" : "text-neutral/20"}
								/>
							)}
							<span
								className={`text-sm font-semibold ${isActive || isDone ? "text-neutral" : "text-neutral/30"}`}>
								{step}
							</span>
						</div>
					);
				})}
			</div>

			<div className="flex items-center gap-1.5 mt-8">
				<Hourglass size={12} className="text-neutral/40" />
				<p className="text-xs text-neutral/50">
					Ini hanya membutuhkan beberapa detik.
				</p>
			</div>
		</div>
	);
}
