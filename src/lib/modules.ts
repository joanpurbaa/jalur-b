import {
	FolderCheck,
	GitFork,
	HeartPulse,
	Home,
	PlaySquare,
	ShieldAlert,
	Sparkles,
	User,
	Wallet,
	type LucideIcon,
} from "lucide-react";

/**
 * Identitas visual per modul. Warna modul ≠ warna status:
 * modul = identitas halaman; status (aman/perhatian/bahaya) ada di lib/status.
 *
 * Semua class ditulis utuh (bukan string dinamis) agar terdeteksi Tailwind.
 */
export type ModuleId =
	| "beranda"
	| "kesehatan-karier"
	| "risiko-karier"
	| "skill"
	| "jalur-karier"
	| "bukti-karier"
	| "finansial"
	| "simulasi"
	| "profil";

export interface ModuleTheme {
	id: ModuleId;
	label: string;
	shortLabel: string;
	icon: LucideIcon;
	/** Gradien solid untuk IconTile & hero (class Tailwind). */
	gradient: string;
	/** Warna teks aksen. */
	text: string;
	/** Tint lembut untuk latar chip/kartu. */
	tint: string;
	/** Border lembut. */
	border: string;
	/** Pill aktif sidebar. */
	activePill: string;
	/** Gradien halus untuk header halaman. */
	headerWash: string;
	/** Hex untuk SVG/chart: [utama, sekunder]. */
	hex: [string, string];
	/** Warna bayangan IconTile (rgba). */
	shadow: string;
}

export const MODULES: Record<ModuleId, ModuleTheme> = {
	beranda: {
		id: "beranda",
		label: "Beranda",
		shortLabel: "Beranda",
		icon: Home,
		gradient: "bg-gradient-to-br from-indigo-400 to-indigo-600",
		text: "text-indigo-700",
		tint: "bg-indigo-50",
		border: "border-indigo-100",
		activePill: "bg-indigo-600 text-white shadow-indigo-500/30",
		headerWash: "from-indigo-500/12 via-violet-400/8 to-transparent",
		hex: ["#6366f1", "#818cf8"],
		shadow: "rgba(79,70,229,0.45)",
	},
	"kesehatan-karier": {
		id: "kesehatan-karier",
		label: "Kesehatan Karier",
		shortLabel: "Kesehatan",
		icon: HeartPulse,
		gradient: "bg-gradient-to-br from-rose-400 to-orange-400",
		text: "text-rose-700",
		tint: "bg-rose-50",
		border: "border-rose-100",
		activePill: "bg-rose-500 text-white shadow-rose-500/30",
		headerWash: "from-rose-500/12 via-orange-400/8 to-transparent",
		hex: ["#f43f5e", "#fb923c"],
		shadow: "rgba(244,63,94,0.42)",
	},
	"risiko-karier": {
		id: "risiko-karier",
		label: "Risiko Karier",
		shortLabel: "Risiko",
		icon: ShieldAlert,
		gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
		text: "text-amber-700",
		tint: "bg-amber-50",
		border: "border-amber-100",
		activePill: "bg-amber-500 text-white shadow-amber-500/30",
		headerWash: "from-amber-500/14 via-orange-400/8 to-transparent",
		hex: ["#f59e0b", "#f97316"],
		shadow: "rgba(245,158,11,0.45)",
	},
	skill: {
		id: "skill",
		label: "Skill & AI",
		shortLabel: "Skill",
		icon: Sparkles,
		gradient: "bg-gradient-to-br from-violet-500 to-cyan-400",
		text: "text-violet-700",
		tint: "bg-violet-50",
		border: "border-violet-100",
		activePill: "bg-violet-600 text-white shadow-violet-500/30",
		headerWash: "from-violet-500/12 via-cyan-400/8 to-transparent",
		hex: ["#8b5cf6", "#22d3ee"],
		shadow: "rgba(139,92,246,0.42)",
	},
	"jalur-karier": {
		id: "jalur-karier",
		label: "Jalur Karier",
		shortLabel: "Jalur",
		icon: GitFork,
		gradient: "bg-gradient-to-br from-emerald-400 to-teal-500",
		text: "text-emerald-700",
		tint: "bg-emerald-50",
		border: "border-emerald-100",
		activePill: "bg-emerald-600 text-white shadow-emerald-500/30",
		headerWash: "from-emerald-500/12 via-teal-400/8 to-transparent",
		hex: ["#10b981", "#14b8a6"],
		shadow: "rgba(16,185,129,0.42)",
	},
	"bukti-karier": {
		id: "bukti-karier",
		label: "Bukti Karier",
		shortLabel: "Bukti",
		icon: FolderCheck,
		gradient: "bg-gradient-to-br from-sky-400 to-blue-500",
		text: "text-sky-700",
		tint: "bg-sky-50",
		border: "border-sky-100",
		activePill: "bg-sky-600 text-white shadow-sky-500/30",
		headerWash: "from-sky-500/12 via-blue-400/8 to-transparent",
		hex: ["#0ea5e9", "#3b82f6"],
		shadow: "rgba(14,165,233,0.42)",
	},
	finansial: {
		id: "finansial",
		label: "Finansial",
		shortLabel: "Finansial",
		icon: Wallet,
		gradient: "bg-gradient-to-br from-green-400 to-emerald-600",
		text: "text-green-700",
		tint: "bg-green-50",
		border: "border-green-100",
		activePill: "bg-green-600 text-white shadow-green-500/30",
		headerWash: "from-green-500/12 via-emerald-400/8 to-transparent",
		hex: ["#22c55e", "#059669"],
		shadow: "rgba(34,197,94,0.42)",
	},
	simulasi: {
		id: "simulasi",
		label: "Simulasi",
		shortLabel: "Simulasi",
		icon: PlaySquare,
		gradient: "bg-gradient-to-br from-indigo-500 to-fuchsia-500",
		text: "text-fuchsia-700",
		tint: "bg-fuchsia-50",
		border: "border-fuchsia-100",
		activePill:
			"bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-fuchsia-500/30",
		headerWash: "from-indigo-500/12 via-fuchsia-400/10 to-transparent",
		hex: ["#6366f1", "#d946ef"],
		shadow: "rgba(192,38,211,0.4)",
	},
	profil: {
		id: "profil",
		label: "Profil",
		shortLabel: "Profil",
		icon: User,
		gradient: "bg-gradient-to-br from-slate-500 to-indigo-600",
		text: "text-slate-700",
		tint: "bg-slate-100",
		border: "border-slate-200",
		activePill: "bg-slate-800 text-white shadow-slate-500/30",
		headerWash: "from-slate-400/12 via-indigo-300/8 to-transparent",
		hex: ["#64748b", "#4f46e5"],
		shadow: "rgba(71,85,105,0.4)",
	},
};

/** Tone tambahan non-modul untuk IconTile (status/kategori). */
export type ExtraTone =
	| "safe"
	| "caution"
	| "danger"
	| "neutral"
	| "indigo"
	| "violet"
	| "cyan"
	| "pink"
	| "teal"
	| "orange"
	| "blue";

export const EXTRA_TONES: Record<
	ExtraTone,
	{ gradient: string; shadow: string; text: string; tint: string; hex: string }
> = {
	safe: {
		gradient: "bg-gradient-to-br from-emerald-400 to-emerald-600",
		shadow: "rgba(5,150,105,0.42)",
		text: "text-emerald-700",
		tint: "bg-emerald-50",
		hex: "#10b981",
	},
	caution: {
		gradient: "bg-gradient-to-br from-amber-300 to-amber-500",
		shadow: "rgba(217,119,6,0.42)",
		text: "text-amber-700",
		tint: "bg-amber-50",
		hex: "#f59e0b",
	},
	danger: {
		gradient: "bg-gradient-to-br from-rose-400 to-rose-600",
		shadow: "rgba(225,29,72,0.42)",
		text: "text-rose-700",
		tint: "bg-rose-50",
		hex: "#f43f5e",
	},
	neutral: {
		gradient: "bg-gradient-to-br from-slate-300 to-slate-500",
		shadow: "rgba(71,85,105,0.35)",
		text: "text-slate-700",
		tint: "bg-slate-100",
		hex: "#94a3b8",
	},
	indigo: {
		gradient: "bg-gradient-to-br from-indigo-400 to-indigo-600",
		shadow: "rgba(79,70,229,0.45)",
		text: "text-indigo-700",
		tint: "bg-indigo-50",
		hex: "#6366f1",
	},
	violet: {
		gradient: "bg-gradient-to-br from-violet-400 to-violet-600",
		shadow: "rgba(124,58,237,0.42)",
		text: "text-violet-700",
		tint: "bg-violet-50",
		hex: "#8b5cf6",
	},
	cyan: {
		gradient: "bg-gradient-to-br from-cyan-400 to-sky-500",
		shadow: "rgba(8,145,178,0.42)",
		text: "text-cyan-700",
		tint: "bg-cyan-50",
		hex: "#06b6d4",
	},
	pink: {
		gradient: "bg-gradient-to-br from-pink-400 to-fuchsia-500",
		shadow: "rgba(219,39,119,0.4)",
		text: "text-pink-700",
		tint: "bg-pink-50",
		hex: "#ec4899",
	},
	teal: {
		gradient: "bg-gradient-to-br from-teal-400 to-teal-600",
		shadow: "rgba(13,148,136,0.42)",
		text: "text-teal-700",
		tint: "bg-teal-50",
		hex: "#14b8a6",
	},
	orange: {
		gradient: "bg-gradient-to-br from-orange-400 to-orange-600",
		shadow: "rgba(234,88,12,0.42)",
		text: "text-orange-700",
		tint: "bg-orange-50",
		hex: "#f97316",
	},
	blue: {
		gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
		shadow: "rgba(37,99,235,0.42)",
		text: "text-blue-700",
		tint: "bg-blue-50",
		hex: "#3b82f6",
	},
};

export type Tone = ModuleId | ExtraTone;

export function toneStyles(tone: Tone): {
	gradient: string;
	shadow: string;
	text: string;
	tint: string;
	hex: string;
} {
	if (tone in MODULES) {
		const m = MODULES[tone as ModuleId];
		return {
			gradient: m.gradient,
			shadow: m.shadow,
			text: m.text,
			tint: m.tint,
			hex: m.hex[0],
		};
	}
	return EXTRA_TONES[tone as ExtraTone];
}

export function moduleFromPath(pathname: string): ModuleId {
	const seg = pathname.split("/")[2] || "beranda";
	return (seg in MODULES ? seg : "beranda") as ModuleId;
}
