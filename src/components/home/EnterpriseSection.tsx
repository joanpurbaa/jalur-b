import { Link } from "react-router-dom";
import {
	ArrowRight,
	Building2,
	FileCheck2,
	Scale,
	ShieldCheck,
	Users,
} from "lucide-react";
import Reveal from "./Reveal";
import IconTile from "../ui/IconTile";
import Card from "../ui/Card";

const ENTERPRISE_PILLARS = [
	{
		title: "Transparansi hak normatif",
		description:
			"Membantu karyawan memahami perhitungan pesangon, UPMK, dan manfaat JKP sesuai PP 35/2021 & PP 6/2025 tanpa kebingungan.",
		icon: Scale,
	},
	{
		title: "Outplacement & pivot terukur",
		description:
			"Memetakan skill yang relevan, peran alternatif terdekat, dan rencana aksi nyata agar masa transisi lebih cepat dan tenang.",
		icon: FileCheck2,
	},
	{
		title: "Privat, netral & bebas iklan",
		description:
			"Data finansial dan karier tetap menjadi milik pekerja. Tidak ada iklan pihak ketiga maupun penjualan data pribadi.",
		icon: ShieldCheck,
	},
];

export default function EnterpriseSection() {
	return (
		<section
			id="perusahaan"
			className="mx-auto px-5 sm:px-10 lg:px-20 xl:px-32 2xl:px-72 py-16 lg:py-24">
			<Reveal>
				<Card variant="hero" padding="lg" className="p-6 sm:p-10 lg:p-12">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
						<div className="lg:col-span-7">
							<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-200 text-xs font-semibold text-indigo-700">
								<Building2 size={13} />
								Untuk Perusahaan &amp; Serikat Pekerja
							</span>

							<h2 className="mt-5 text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-neutral leading-[1.08]">
								Dampingi transisi karyawan secara{" "}
								<span className="font-[Georgia,serif] italic font-normal text-primary">
									bermartabat.
								</span>
							</h2>

							<p className="mt-4 text-sm sm:text-base text-neutral/70 leading-relaxed max-w-xl">
								Program ketahanan karier (<em>career resilience</em>) untuk tim
								HR, program <em>outplacement</em>, maupun manfaat keanggotaan
								serikat pekerja — memberikan kejelasan angka dan arah sejak hari
								pertama.
							</p>
						</div>

						<div className="lg:col-span-5">
							<div className="rounded-2xl bg-indigo-950 text-white p-6 border border-indigo-900 shadow-sm">
								<div className="flex items-center gap-2 text-xs font-semibold text-indigo-200">
									<Users size={14} />
									<span>Skema Kemitraan B2B2C</span>
								</div>
								<div className="mt-3 flex items-baseline gap-1.5">
									<span className="num-display text-4xl text-white">
										Rp15rb
									</span>
									<span className="text-sm text-indigo-200">
										/ pekerja / bulan
									</span>
								</div>
								<p className="mt-2.5 text-xs text-indigo-100/80 leading-relaxed">
									Akses penuh simulasi ketahanan, perbandingan peran, dan peta
									skill gap untuk seluruh anggota atau karyawan terdampak.
								</p>
								<div className="mt-5 flex flex-col sm:flex-row gap-2.5">
									<Link
										to="/harga"
										className="press inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 text-xs font-semibold transition flex-1">
										<span>Lihat Skema Harga</span>
										<ArrowRight size={14} />
									</Link>
									<a
										href="mailto:halo@jalurb.id?subject=Kemitraan%20Perusahaan%20%26%20Serikat%20Jalur%20B"
										className="press inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl border border-white/25 text-white hover:bg-white/10 text-xs font-semibold transition">
										Hubungi Kami
									</a>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-8 pt-8 border-t border-indigo-200/60 grid grid-cols-1 md:grid-cols-3 gap-5">
						{ENTERPRISE_PILLARS.map((pillar) => (
							<div
								key={pillar.title}
								className="rounded-xl bg-white/90 border border-slate-200/80 p-5">
								<IconTile icon={pillar.icon} tone="indigo" size="sm" />
								<h3 className="mt-4 text-sm sm:text-base font-bold text-slate-900">
									{pillar.title}
								</h3>
								<p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
									{pillar.description}
								</p>
							</div>
						))}
					</div>
				</Card>
			</Reveal>
		</section>
	);
}
