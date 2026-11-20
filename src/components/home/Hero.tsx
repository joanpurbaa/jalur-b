import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInView, useReducedMotion } from "motion/react";
import {
	AlertTriangle,
	ArrowRight,
	Briefcase,
	Scale,
	ShieldCheck,
} from "lucide-react";
import Reveal from "./Reveal";
import { CountUp } from "../ui/Motion";

// TODO: Isi detail persona dari paper (profesi, gaji, tabungan, pesangon, dll)
// dan nama tiap cara keluar. Angka months (2,5 dan 13,7) sudah sesuai paper.
// Field `detail` opsional: kosongkan string-nya kalau belum ada.
const PERSONA = {
	caption: "Contoh persona",
	description: "Kondisi finansial yang sama, tapi cara keluarnya berbeda.",
	scenarios: [
		{
			label: "Cara keluar A",
			detail: "",
			months: 2.5,
			barClass: "bg-rose-500",
			numberClass: "text-rose-600",
		},
		{
			label: "Cara keluar B",
			detail: "",
			months: 13.7,
			barClass: "bg-indigo-600",
			numberClass: "text-indigo-600",
		},
	],
};

// Skala bar: 14 bulan = bar penuh.
const MAX_MONTHS = 14;

const formatMonths = (value: number) =>
	value.toLocaleString("id-ID", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	});

export default function Hero() {
	const navigate = useNavigate();
	const cardRef = useRef<HTMLDivElement>(null);
	const inView = useInView(cardRef, { once: true, margin: "-40px" });
	const reduce = useReducedMotion();
	const animated = inView || Boolean(reduce);

	return (
		<section
			id="masalah"
			className="px-5 pb-12 pt-28 sm:px-10 lg:px-20 lg:pt-32 xl:px-32 2xl:px-72">
			<Reveal>
				<div className="mx-auto grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
					{/* Kiri: headline + CTA */}
					<div>
						<p className="mt-6 text-base text-neutral/60">
							Kenali risiko kariermu sebelum kamu dipaksa menghadapinya.
						</p>

						<h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-neutral sm:text-5xl lg:text-6xl">
							Kalau besok kehilangan pekerjaan, uangmu cukup berapa bulan?
						</h1>

						<p className="mt-5 text-xl text-neutral/70 sm:text-2xl">
							Jawabannya tergantung{" "}
							<span className="font-[Georgia,serif] italic text-primary">
								cara kamu keluar.
							</span>
						</p>

						<div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
							<button
								type="button"
								onClick={() => navigate("/register")}
								className="press inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 cursor-pointer">
								<span>Hitung runway-ku</span>
								<ArrowRight size={15} />
							</button>
							<a
								href="#solusi"
								className="text-sm text-neutral/50 transition hover:text-primary">
								Lihat cara kerjanya
							</a>
						</div>

						<p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-neutral/55">
							<Briefcase size={13} className="text-primary shrink-0" />
							<span>Untuk pekerja aktif atau yang pernah bekerja.</span>
						</p>
					</div>

					{/* Kanan: kartu persona */}
					<div
						ref={cardRef}
						className="w-full card-surface p-6 sm:p-8 lg:ml-auto lg:max-w-md">
						<div className="flex items-center justify-between gap-2">
							<p className="text-xs font-semibold uppercase tracking-widest text-neutral/40">
								{PERSONA.caption}
							</p>
							<span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
								<Scale size={11} />
								PP 35/2021
							</span>
						</div>
						<p className="mt-2 text-sm text-neutral/60">{PERSONA.description}</p>

						<ul className="mt-6 space-y-7">
							{PERSONA.scenarios.map((scenario, idx) => {
								const width = Math.min(
									(scenario.months / MAX_MONTHS) * 100,
									100,
								);
								return (
									<li key={scenario.label}>
										<div className="flex items-end justify-between gap-4">
											<div>
												<p className="text-sm font-semibold text-neutral inline-flex items-center gap-1.5">
													{idx === 0 ? (
														<AlertTriangle
															size={14}
															className="text-rose-600 shrink-0"
														/>
													) : (
														<ShieldCheck
															size={14}
															className="text-indigo-600 shrink-0"
														/>
													)}
													<span>{scenario.label}</span>
												</p>
												{scenario.detail ? (
													<p className="mt-0.5 text-xs text-neutral/50">
														{scenario.detail}
													</p>
												) : null}
											</div>
											<p className="shrink-0 tabular-nums">
												<span
													className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${scenario.numberClass}`}>
													<CountUp
														value={scenario.months}
														decimals={1}
														format={formatMonths}
													/>
												</span>
												<span className="ml-1.5 text-base text-neutral/50">
													bulan
												</span>
											</p>
										</div>

										<div
											className="mt-3 h-3 w-full overflow-hidden rounded-full bg-neutral/10"
											role="img"
											aria-label={`${scenario.label}: uang cukup ${formatMonths(scenario.months)} bulan`}>
											<div
												className={`h-full rounded-full transition-[width] duration-1000 ease-out ${scenario.barClass}`}
												style={{ width: animated ? `${width}%` : "0%" }}
											/>
										</div>
									</li>
								);
							})}
						</ul>

						<p className="mt-7 border-t border-neutral/10 pt-4 text-xs text-neutral/45">
							Runway = berapa bulan uangmu cukup menutup pengeluaran saat tidak
							ada penghasilan.
						</p>
					</div>
				</div>
			</Reveal>
		</section>
	);
}
