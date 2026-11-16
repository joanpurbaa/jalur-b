import { ArrowRight, Calculator, Info, Lock } from "lucide-react";
import { PrimaryButton } from "../../ui/PrimaryButton";
import Card from "../../ui/Card";
import JourneyTimeline from "./JourneyTimeline";

interface SimulationIntroProps {
	onStart: () => void;
}

export default function SimulationIntro({ onStart }: SimulationIntroProps) {
	return (
		<Card padding="lg">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
				<div className="lg:col-span-6 flex flex-col justify-center">
					<span className="inline-flex items-center gap-1.5 self-start px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-full mb-4">
						<Calculator size={13} />
						Simulator Ketahanan Karier &amp; Finansial
					</span>

					<h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
						What If I Get Fired Tomorrow?
					</h2>

					<p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mt-3 mb-5 max-w-lg">
						Rasa cemas biasanya muncul karena ketidakpastian. Dengan melihat
						angka nyata—berapa bulan napas finansialmu, estimasi hak normatif,
						dan opsi peran berikutnya—kamu bisa memegang kendali dengan tenang.
					</p>

					<div className="rounded-xl bg-slate-50 border border-slate-200 p-4 mb-6">
						<p className="text-xs font-semibold text-slate-700 mb-2">
							Output yang akan kamu lihat:
						</p>
						<div className="grid grid-cols-3 gap-2 text-center">
							<div className="rounded-lg bg-white border border-slate-200 px-2.5 py-2">
								<p className="text-xs font-bold text-indigo-700">Runway</p>
								<p className="text-xs text-slate-500 mt-0.5">Bulan aman</p>
							</div>
							<div className="rounded-lg bg-white border border-slate-200 px-2.5 py-2">
								<p className="text-xs font-bold text-indigo-700">Hak Kerja</p>
								<p className="text-xs text-slate-500 mt-0.5">PP 35/2021</p>
							</div>
							<div className="rounded-lg bg-white border border-slate-200 px-2.5 py-2">
								<p className="text-xs font-bold text-indigo-700">Aksi</p>
								<p className="text-xs text-slate-500 mt-0.5">Langkah prioritas</p>
							</div>
						</div>
					</div>

					<div className="self-stretch sm:self-start">
						<PrimaryButton
							size="lg"
							icon={<ArrowRight size={16} />}
							onClick={onStart}>
							Mulai Konfigurasi Simulasi
						</PrimaryButton>
					</div>

					<div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
						<div className="flex items-start gap-2.5">
							<Info size={15} className="text-indigo-600 shrink-0 mt-0.5" />
							<p className="leading-relaxed">
								Simulasi menggabungkan data profil karier, tabungan likuid, dan
								ketentuan kerja sesuai PP 35/2021.
							</p>
						</div>
						<div className="flex items-start gap-2.5">
							<Lock size={15} className="text-slate-500 shrink-0 mt-0.5" />
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
