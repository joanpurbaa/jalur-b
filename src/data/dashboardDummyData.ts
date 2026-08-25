export const userProfile = {
	name: "Raka",
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
		title: "AI Exposure",
		value: "42%",
		variant: "insight",
	},
	{
		title: "Skill Relevance",
		value: "81%",
		variant: "healthy",
	},
	{
		title: "Financial Runway",
		value: "2.8 bulan",
		variant: "risk",
	},
];

export const weeklyFocus = {
	skill: "Digital Analytics",
	description: "semakin banyak muncul pada lowongan Marketing Specialist.",
};

export const nextAction = {
	description:
		"Lengkapi performance review untuk meningkatkan akurasi Career Health.",
	ctaLabel: "Lengkapi sekarang",
};

export const nextMission = {
	title: "Bangun 1 campaign menggunakan AI untuk mempercepat proses riset.",
	estimation: "Estimasi: 2 jam",
};

export const riskData = {
	overallLevel: "Sedang" as const,
	summary:
		"Belum ada indikasi kuat bahwa role kamu dalam bahaya, tetapi beberapa perubahan perlu diperhatikan dalam 12-18 bulan ke depan.",
	dimensions: [
		{
			title: "Risiko Role",
			level: "Sedang" as const,
			description:
				"Evolusi tugas harian dan ekspektasi peran dalam struktur perusahaan.",
		},
		{
			title: "Risiko Industri",
			level: "Rendah" as const,
			description:
				"Stabilitas sektor bisnis tempat kamu bekerja terhadap fluktuasi ekonomi.",
		},
		{
			title: "AI Disruption",
			level: "Sedang" as const,
			description:
				"Potensi otomatisasi tugas spesifik oleh kecerdasan buatan generatif.",
		},
		{
			title: "Market Demand",
			level: "Rendah" as const,
			description:
				"Volume permintaan tenaga kerja untuk spesialisasi kamu di bursa kerja saat ini.",
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
			'Penilaian "Sedang" pada profil kamu didorong oleh pergeseran cara kerja di sektor kamu, bukan penurunan demand industri secara keseluruhan. AI memprediksi evolusi tugas operasional harian.',
		note:
			"Jalur B menganalisis data role, performa, industri, dan makro-tren terkini untuk memberikan estimasi ini. Hasil analisis bersifat panduan probabilistik dan bukan pernyataan absolut mengenai masa depan karier kamu.",
	},
	earlyWarning: {
		title: "AI semakin banyak digunakan pada aktivitas marketing.",
		description:
			"Aktivitas seperti riset awal, drafting content, dan analisis sederhana semakin mudah dibantu AI. Kompetensi adaptasi tool baru menjadi krusial.",
		ctaLabel: "Lihat dampaknya ke pekerjaanmu",
	},
};