import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Reveal from "./Reveal";

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
			barClass: "bg-red-500",
			numberClass: "text-red-500",
		},
		{
			label: "Cara keluar B",
			detail: "",
			months: 13.7,
			barClass: "bg-primary",
			numberClass: "text-primary",
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
	const [animated, setAnimated] = useState(false);

	useEffect(() => {
		const id = requestAnimationFrame(() => setAnimated(true));
		return () => cancelAnimationFrame(id);
	}, []);

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
								onClick={() => navigate("/login")}
								className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90">
								Hitung runway-ku
							</button>
							<a
								href="#solusi"
								className="text-sm text-neutral/50 transition hover:text-primary">
								Lihat cara kerjanya
							</a>
						</div>
					</div>

					{/* Kanan: kartu persona */}
					<div className="w-full rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm sm:p-8 lg:ml-auto lg:max-w-md">
						<p className="text-xs font-semibold uppercase tracking-widest text-neutral/40">
							{PERSONA.caption}
						</p>
						<p className="mt-2 text-sm text-neutral/60">{PERSONA.description}</p>

						<ul className="mt-6 space-y-7">
							{PERSONA.scenarios.map((scenario) => {
								const width = Math.min((scenario.months / MAX_MONTHS) * 100, 100);
								return (
									<li key={scenario.label}>
										<div className="flex items-end justify-between gap-4">
											<div>
												<p className="text-sm font-semibold text-neutral">
													{scenario.label}
												</p>
												{scenario.detail ? (
													<p className="mt-0.5 text-xs text-neutral/50">{scenario.detail}</p>
												) : null}
											</div>
											<p className="shrink-0 tabular-nums">
												<span
													className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${scenario.numberClass}`}>
													{formatMonths(scenario.months)}
												</span>
												<span className="ml-1.5 text-base text-neutral/50">bulan</span>
											</p>
										</div>

										<div
											className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-neutral/10"
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
							Runway = berapa bulan uangmu cukup menutup pengeluaran saat tidak ada
							penghasilan.
						</p>
					</div>
				</div>
			</Reveal>
		</section>
	);
}
