import { Info, Lock, ArrowRight, Sparkles } from "lucide-react";
import { PrimaryButton } from "../../ui/PrimaryButton";
import Card from "../../ui/Card";
import { ScenarioBridgeSvg } from "../../ui/Illustrations";
import { Float } from "../../ui/Motion";
import JourneyTimeline from "./JourneyTimeline";

interface SimulationIntroProps {
	onStart: () => void;
}

export default function SimulationIntro({ onStart }: SimulationIntroProps) {
	return (
		<Card padding="lg" className="overflow-hidden">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
				<div className="lg:col-span-6 flex flex-col justify-center">
					<span className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200 text-xs font-extrabold rounded-full mb-4">
						<Sparkles size={13} />
						Simulator Ketahanan Karier & Finansial
					</span>

					<h2 className="text-2xl sm:text-3xl font-extrabold text-neutral tracking-tight">
						What If I Get{" "}
						<span className="accent-serif font-normal text-fuchsia-600">
							Fired Tomorrow?
						</span>
					</h2>

					<p className="text-sm sm:text-[15px] text-neutral/70 leading-relaxed mt-3 mb-6 max-w-lg">
						Rasa cemas biasanya muncul karena ketidakpastian. Dengan melihat
						angka nyata—berapa bulan napas finansialmu, estimasi hak normatif,
						dan opsi peran berikutnya—kamu bisa memegang kendali dengan tenang.
					</p>

					<Float className="my-2 self-center sm:self-start">
						<ScenarioBridgeSvg className="w-44 h-28" />
					</Float>

					<div className="mt-4 self-stretch sm:self-start">
						<PrimaryButton
							tone="simulasi"
							size="lg"
							icon={<ArrowRight size={16} />}
							onClick={onStart}>
							Mulai Konfigurasi Simulasi
						</PrimaryButton>
					</div>

					<div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-neutral/60">
						<div className="flex items-start gap-2.5">
							<Info size={15} className="text-indigo-600 shrink-0 mt-0.5" />
							<p className="leading-relaxed">
								Simulasi menggabungkan data profil karier, tabungan likuid, dan
								ketentuan kerja sesuai PP 35/2021.
							</p>
						</div>
						<div className="flex items-start gap-2.5">
							<Lock size={15} className="text-emerald-600 shrink-0 mt-0.5" />
							<p className="leading-relaxed">
								Semua perhitungan bersifat rahasia dan tidak mengubah data profil
								utamamu.
							</p>
						</div>
					</div>
				</div>

				<div className="lg:col-span-6">
					<JourneyTimeline />
				</div>
			</div>
		</Card>
	);
}
