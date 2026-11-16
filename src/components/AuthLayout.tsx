import React from "react";
import { Link } from "react-router-dom";
import { Activity, GitFork, ShieldCheck, Wallet } from "lucide-react";
import { CompassOrbSvg } from "./ui/Illustrations";

interface AuthLayoutProps {
	children: React.ReactNode;
	title: string;
	subtitle: string;
}

const VALUE_POINTS = [
	{
		icon: Activity,
		title: "Radar Risiko & Dampak AI",
		desc: "Ketahui bagian pekerjaan yang terdampak otomatisasi dan skill mana yang paling bernilai.",
	},
	{
		icon: Wallet,
		title: "Kalkulator Runway & Simulasi PHK",
		desc: "Hitung berapa bulan dana darurat dan proyeksi pesangonmu menopang masa transisi.",
	},
	{
		icon: GitFork,
		title: "Peta Jalur & Bukti Karier",
		desc: "Petakan peran alternatif terdekat dan simpan portofolio pencapaian sebelum dibutuhkan.",
	},
];

export default function AuthLayout({
	children,
	title,
	subtitle,
}: AuthLayoutProps) {
	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-app text-slate-900 font-sans">
			<div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-10 xl:p-14 relative overflow-hidden bg-indigo-950 text-white">
				<div
					aria-hidden
					className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl"
				/>

				<div className="relative z-10 flex items-center justify-between">
					<Link to="/" className="inline-flex items-center gap-2.5">
						<span className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-xs">
							<ShieldCheck size={18} className="text-white" strokeWidth={2} />
						</span>
						<span className="font-bold text-xl tracking-tight text-white">
							Jalur B
						</span>
					</Link>
					<span className="text-xs font-medium text-indigo-200 border border-white/15 px-3 py-1 rounded-full bg-white/5">
						Career Resilience Platform
					</span>
				</div>

				<div className="relative z-10 max-w-xl my-auto py-8">
					<div className="mb-6 flex items-center gap-5">
						<div className="shrink-0 rounded-2xl bg-white/5 border border-white/10 p-3">
							<CompassOrbSvg className="w-20 h-20 text-indigo-200" />
						</div>
						<div>
							<h2 className="text-3xl xl:text-4xl font-bold tracking-tight leading-[1.2] text-white">
								Hadapi perubahan karier dengan peta yang jelas.
							</h2>
							<p className="text-sm text-indigo-100/80 mt-2.5 leading-relaxed">
								Tidak perlu menunggu situasi mendesak. Ukur kesehatan karier,
								ruang finansial, dan opsi langkah berikutnya secara tenang.
							</p>
						</div>
					</div>

					<div className="space-y-3 mt-7">
						{VALUE_POINTS.map((point) => {
							const Icon = point.icon;
							return (
								<div
									key={point.title}
									className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.06] border border-white/10">
									<div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-indigo-200 shrink-0 mt-0.5">
										<Icon size={17} strokeWidth={1.85} />
									</div>
									<div>
										<h3 className="text-sm font-semibold text-white">
											{point.title}
										</h3>
										<p className="text-xs text-indigo-100/75 mt-1 leading-relaxed">
											{point.desc}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className="relative z-10 flex items-center justify-between text-xs text-indigo-200/70 border-t border-white/10 pt-5">
					<span>Data kamu tersimpan aman dan bersifat pribadi.</span>
					<span>Bahasa Indonesia · Fokus karyawan</span>
				</div>
			</div>

			<div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center items-center px-5 py-10 sm:px-10">
				<div className="w-full max-w-md">
					<Link
						to="/"
						className="inline-flex lg:hidden items-center gap-2 mb-7">
						<span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
							<ShieldCheck size={16} strokeWidth={2} />
						</span>
						<span className="font-bold text-lg text-slate-900">Jalur B</span>
					</Link>

					<div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
						<h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900">
							{title}
						</h1>
						<p className="text-sm text-slate-500 mt-1.5 mb-7 leading-relaxed">
							{subtitle}
						</p>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
