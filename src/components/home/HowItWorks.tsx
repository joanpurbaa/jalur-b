import { Compass, GitFork, Rocket, ShieldAlert, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";
import IconTile from "../ui/IconTile";
import type { Tone } from "../../lib/modules";

const STEPS: {
	number: string;
	title: string;
	description: string;
	icon: LucideIcon;
	tone: Tone;
}[] = [
	{
		number: "01",
		title: "Kenali kondisimu",
		description: "Isi informasi dasar tentang karier dan kondisi finansialmu.",
		icon: Compass,
		tone: "indigo",
	},
	{
		number: "02",
		title: "Lihat risikonya",
		description:
			"Jalur B menganalisis kesehatan karier, relevansi skill, paparan AI, dan ketahanan finansialmu.",
		icon: ShieldAlert,
		tone: "indigo",
	},
	{
		number: "03",
		title: "Temukan jalurmu",
		description:
			"Lihat peluang role alternatif dan skill yang perlu diperkuat berdasarkan profilmu.",
		icon: GitFork,
		tone: "indigo",
	},
	{
		number: "04",
		title: "Siapkan langkah berikutnya",
		description:
			"Gunakan insight tersebut untuk mempersiapkan diri sebelum perubahan benar-benar terjadi.",
		icon: Rocket,
		tone: "indigo",
	},
];

export default function HowItWorks() {
	return (
		<section
			id="cara-kerja"
			className="mx-auto px-5 sm:px-10 lg:px-20 xl:px-32 2xl:px-72 py-16 lg:py-24">
			<Reveal>
				<div className="max-w-3xl">
					<h2 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral leading-[1.02] font-[Georgia,serif]">
						Kamu tidak perlu menunggu PHK untuk mulai bersiap.
					</h2>

					<p className="mt-6 max-w-xl text-base text-neutral/60 sm:text-lg">
						Jalur B membantu kamu memahami posisi hari ini dan menentukan
						langkah berikutnya.
					</p>
				</div>
			</Reveal>

			{/* Desktop horizontal timeline */}
			<ol className="mt-16 hidden grid-cols-1 gap-y-12 lg:grid lg:grid-cols-4 lg:gap-x-10 lg:gap-y-0">
				{STEPS.map((step, index) => (
					<Reveal key={step.number} delay={index * 80}>
						<li className="group border-t-2 border-neutral/10 pt-6 transition-colors duration-300 hover:border-primary">
							<div className="flex items-center justify-between">
								<span className="text-5xl font-bold tracking-tight text-neutral/15 transition-colors duration-300 group-hover:text-primary lg:text-6xl">
									{step.number}
								</span>
								<IconTile icon={step.icon} tone={step.tone} size="md" />
							</div>
							<h3 className="mt-5 text-xl font-bold text-neutral">
								{step.title}
							</h3>
							<p className="mt-2.5 max-w-xs text-sm leading-relaxed text-neutral/60">
								{step.description}
							</p>
						</li>
					</Reveal>
				))}
			</ol>

			{/* Mobile + Tablet vertical timeline */}
			<ol className="mt-14 grid grid-cols-1 gap-y-9 lg:hidden">
				{STEPS.map((step, index) => (
					<Reveal key={step.number} delay={index * 60}>
						<li className="group border-t-2 border-neutral/10 pt-6 transition-colors duration-300 hover:border-primary">
							<div className="flex items-center justify-between">
								<span className="text-4xl font-bold tracking-tight text-neutral/15 transition-colors duration-300 group-hover:text-primary">
									{step.number}
								</span>
								<IconTile icon={step.icon} tone={step.tone} size="sm" />
							</div>
							<h3 className="mt-4 text-lg font-bold text-neutral">
								{step.title}
							</h3>
							<p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral/60">
								{step.description}
							</p>
						</li>
					</Reveal>
				))}
			</ol>
		</section>
	);
}
