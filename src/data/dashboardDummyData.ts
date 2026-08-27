export const userProfile = {
	name: "Joan",
	role: "Software Engineer",
};

export const careerHealthData = {
	score: 72,
	status: "Cukup Sehat",
	trend: "↑ 4 poin sejak bulan lalu",
};

import type { StatusVariant } from "../lib/status";

export const careerSnapshots: {
	title: string;
	value: string;
	variant: StatusVariant;
}[] = [
	{
		title: "Career Risk",
		value: "Moderate",
		variant: "warning",
	},
	{
		title: "Skill Relevance",
		value: "84%",
		variant: "healthy",
	},
	{
		title: "Financial Runway",
		value: "3.1 bulan",
		variant: "risk",
	},
];

export const weeklyFocus = {
	skill: "System Design",
	description: "semakin banyak dibutuhkan pada lowongan Software Engineer senior.",
};

export const nextAction = {
	description:
		"Lengkapi performance review untuk meningkatkan akurasi Career Health.",
	ctaLabel: "Lengkapi sekarang",
};

export const nextMission = {
	title: "Bangun 1 feature dengan clean architecture untuk memperkuat portofolio.",
	estimation: "Estimasi: 3 jam",
};

export const riskData = {
	overallLevel: "Sedang" as const,
	summary:
		"Belum ada indikasi kuat bahwa role kamu dalam bahaya, tetapi beberapa perubahan perlu diperhatikan dalam 12-18 bulan ke depan.",
	dimensions: [
		{
			title: "AI Disruption",
			level: "Sedang" as const,
			description:
				"Potensi otomatisasi tugas spesifik seperti penulisan kode sederhana oleh kecerdasan buatan generatif.",
		},
		{
			title: "Skill Dependency",
			level: "Sedang" as const,
			description:
				"Ketergantungan peran pada technical skill spesifik yang mungkin usang.",
		},
	],
	aiAnalysis: {
		title: "Memahami Estimasi Risiko",
		description:
			'Penilaian "Sedang" pada profil kamu didorong oleh pergeseran cara kerja di sektor teknologi, bukan penurunan demand industri secara keseluruhan. AI memprediksi evolusi tugas operasional harian.',
		note:
			"Jalur B menganalisis data role, performa, industri, dan makro-tren terkini untuk memberikan estimasi ini. Hasil analisis bersifat panduan probabilistik dan bukan pernyataan absolut mengenai masa depan karier kamu.",
	},
	earlyWarning: {
		title: "AI semakin banyak digunakan pada penulisan dan review kode.",
		description:
			"Aktivitas seperti implementasi fitur sederhana dan debugging rutin semakin mudah dibantu AI. Kompetensi adaptasi tool baru menjadi krusial.",
		ctaLabel: "Lihat dampaknya ke pekerjaanmu",
	},
};

export const careerPathData = {
	currentRole: {
		title: "Software Engineer",
		subtitle: "Peran Saat Ini",
	},
	alternativeRoles: [
		{
			id: "senior-software-engineer",
			title: "Senior Software Engineer",
			match: 84,
			position: { top: 20, left: 76 },
		},
		{
			id: "fullstack-developer",
			title: "Fullstack Developer",
			match: 79,
			position: { top: 82, left: 24 },
		},
	],
	selectedRoleId: "senior-software-engineer",
	roleDetail: {
		title: "Senior Software Engineer",
		match: 84,
		skillsOwned: ["TypeScript", "Node.js", "System Design"],
		skillsToImprove: ["Cloud Architecture", "Performance Optimization"],
		prepTime: "4-6 Minggu",
		prepDescription:
			"Berdasarkan gap skill dan rekomendasi materi pembelajaran intensif.",
	},
};

export const evidenceCategories = [
	"Semua",
	"Project",
	"Achievement",
	"Feedback",
	"Certificate",
];

export const evidenceItems = [
	{
		id: "payment-gateway-integration",
		category: "Project",
		title: "Integrasi Payment Gateway",
		role: "Software Engineer",
		description:
			"Merancang dan mengimplementasikan integrasi payment gateway untuk memproses transaksi lebih cepat dan andal.",
		impactLabel: "Impact",
		impactValue: "Waktu transaksi turun 30%",
		date: "Mar 2026",
		aiGenerated: true,
	},
	{
		id: "performance-optimization",
		category: "Achievement",
		title: "Optimasi Performa API",
		role: "Software Engineer",
		description:
			"Mengoptimalkan query dan caching sehingga respons API utama menjadi jauh lebih cepat.",
		impactLabel: "Impact",
		impactValue: "Latency turun menjadi 120ms",
		date: "Nov 2025",
		aiGenerated: false,
	},
];

export type FinancialParameter = {
	id: string;
	label: string;
	value: string;
	sublabel: string | null;
	icon: string;
	tone: string;
};

export const financialData = {
	currentRunway: 3.1,
	targetRunway: 4.0,
	description:
		"Estimasi waktu kamu dapat bertahan tanpa income berdasarkan kondisi finansial saat ini. Kami menyarankan minimum 4 bulan untuk keamanan transisi karier.",
	parameters: [
		{
			id: "dana-darurat",
			label: "Dana Darurat",
			value: "Rp 20.000.000",
			sublabel: "Cair dalam 1 hari",
			icon: "PiggyBank",
			tone: "indigo",
		},
		{
			id: "tabungan-jangka-panjang",
			label: "Tabungan Jangka Panjang",
			value: "Rp 35.000.000",
			sublabel: "Deposito berjangka",
			icon: "RefreshCcw",
			tone: "violet",
		},
	],
} as { currentRunway: number; targetRunway: number; description: string; parameters: FinancialParameter[] };

export const skillData = {
	aiExposure: {
		value: 42,
		description: "Aktivitas pekerjaan yang dapat dibantu AI secara signifikan.",
	},
	skillRelevance: {
		value: 84,
		description: "Relevansi skill kamu terhadap kebutuhan pekerjaan saat ini.",
	},
	activityImpact: [
		{ activity: "Code Implementation", level: "HIGH" },
		{ activity: "Debugging", level: "MEDIUM" },
		{ activity: "System Design", level: "LOW" },
	],
	strongSkills: ["TypeScript", "Node.js"],
	risingSkills: ["AI-assisted Development", "Cloud Architecture"],
	skillsToImprove: ["Performance Optimization", "Microservices"],
};

export const simulationData = {
	journey: [
		{
			id: "phk",
			title: "PHK",
			description: "Income berhenti",
			icon: "Ban",
			variant: "risk",
		},
		{
			id: "runway",
			title: "Financial Runway",
			description: "Mengukur daya tahan dana darurat",
			icon: "Wallet",
			variant: "neutral",
		},
		{
			id: "job-search",
			title: "Cari Pekerjaan",
			description: "Kesiapan skill & CV",
			icon: "Search",
			variant: "insight",
		},
		{
			id: "pivot",
			title: "Career Pivot",
			description: "Eksplorasi opsi jalur lain",
			icon: "GitFork",
			variant: "insight",
		},
		{
			id: "reemployed",
			title: "Kembali Bekerja",
			description: "Mendapatkan income kembali",
			icon: "Briefcase",
			variant: "healthy",
		},
	],
	setup: {
		career: {
			role: "Software Engineer",
			tenure: "3 tahun 2 bulan",
			careerHealth: 72,
			careerHealthStatus: "Fair",
			careerRisk: "Moderate",
			aiExposure: "42%",
			skillRelevance: "84%",
		},
		financial: {
			tabunganDarurat: "Rp 20.000.000",
			tanggungan: "—",
			pengeluaranRutin: "Rp 12.000.000 /bln",
			cicilan: "Rp 2.000.000 /bln",
			currentRunway: 3.1,
		},
	},
	scenarioOptions: [
		{ id: "besok", label: "Besok", description: "Impact maksimal" },
		{ id: "1-bulan", label: "1 Bulan Lagi", description: "Ada waktu bersiap" },
		{ id: "3-bulan", label: "3 Bulan Lagi", description: "Transisi terkontrol" },
	],
	loadingSteps: [
		"Menganalisis kondisi karier",
		"Menghitung financial runway",
		"Memetakan peluang karier alternatif",
		"Mengidentifikasi skill gap",
		"Menyusun rencana pemulihan",
	],
	result: {
		runwayMonths: 3.1,
		targetMonths: 4.0,
		readiness: [
			{ label: "Financial Readiness", value: 52, icon: "Wallet" },
			{ label: "Career Readiness", value: 72, icon: "HeartPulse" },
			{ label: "Skill Relevance", value: 84, icon: "Zap" },
			{ label: "Job Mobility", value: 60, icon: "Compass" },
		],
		timeline: [
			{ label: "Day 0", status: "Pekerjaan berakhir.", variant: "neutral" },
			{ label: "Month 1", status: "Masih dalam zona aman.", variant: "healthy" },
			{
				label: "Month 2",
				status: "Mulai masuk zona perhatian.",
				variant: "warning",
			},
			{ label: "Month 3.1", status: "Financial runway habis.", variant: "risk" },
		],
		pivotOptions: [
			{ role: "Senior Software Engineer", match: 84 },
			{ role: "Fullstack Developer", match: 79 },
		],
		weaknesses: [
			{ skill: "Cloud Architecture", gap: "Kesenjangan Sedang" },
			{ skill: "AI-assisted Development", gap: "Kesenjangan Tinggi" },
		],
		evidenceCount: 2,
	},
};

export const personalInfo = {
	name: "Joan Orlando Purba",
	role: "Software Engineer",
	email: "joan.orlanda@example.com",
	username: "@joanorlanda",
	avatarUrl:
		"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
};

export const careerInfo = {
	role: "Software Engineer",
	tenure: "3 tahun 2 bulan",
	careerRisk: "Moderate",
	aiExposure: "42%",
	skillRelevance: "84%",
};