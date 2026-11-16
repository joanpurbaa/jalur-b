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
 * Token navigasi modul. Seluruh aksen modul disatukan ke warna brand indigo
 * dan skala netral slate agar tidak saling berebut perhatian.
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
	gradient: string;
	text: string;
	tint: string;
	border: string;
	activePill: string;
	headerWash: string;
	hex: [string, string];
	shadow: string;
}

const BRAND_THEME = {
	gradient: "bg-indigo-600",
	text: "text-indigo-700",
	tint: "bg-indigo-50",
	border: "border-indigo-100",
	activePill: "bg-indigo-50 text-indigo-700",
	headerWash: "",
	hex: ["#4f46e5", "#6366f1"] as [string, string],
	shadow: "rgba(79,70,229,0.12)",
};

export const MODULES: Record<ModuleId, ModuleTheme> = {
	beranda: {
		id: "beranda",
		label: "Beranda",
		shortLabel: "Beranda",
		icon: Home,
		...BRAND_THEME,
	},
	"kesehatan-karier": {
		id: "kesehatan-karier",
		label: "Kesehatan Karier",
		shortLabel: "Kesehatan",
		icon: HeartPulse,
		...BRAND_THEME,
	},
	"risiko-karier": {
		id: "risiko-karier",
		label: "Risiko Karier",
		shortLabel: "Risiko",
		icon: ShieldAlert,
		...BRAND_THEME,
	},
	skill: {
		id: "skill",
		label: "Skill & AI",
		shortLabel: "Skill",
		icon: Sparkles,
		...BRAND_THEME,
	},
	"jalur-karier": {
		id: "jalur-karier",
		label: "Jalur Karier",
		shortLabel: "Jalur",
		icon: GitFork,
		...BRAND_THEME,
	},
	"bukti-karier": {
		id: "bukti-karier",
		label: "Bukti Karier",
		shortLabel: "Bukti",
		icon: FolderCheck,
		...BRAND_THEME,
	},
	finansial: {
		id: "finansial",
		label: "Finansial",
		shortLabel: "Finansial",
		icon: Wallet,
		...BRAND_THEME,
	},
	simulasi: {
		id: "simulasi",
		label: "Simulasi",
		shortLabel: "Simulasi",
		icon: PlaySquare,
		...BRAND_THEME,
	},
	profil: {
		id: "profil",
		label: "Profil",
		shortLabel: "Profil",
		icon: User,
		...BRAND_THEME,
	},
};

/** Alias tone ke indigo/netral/status muted saja. */
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

const INDIGO_TILE = {
	gradient: "bg-indigo-50 text-indigo-600 border border-indigo-100",
	shadow: "none",
	text: "text-indigo-700",
	tint: "bg-indigo-50",
	hex: "#4f46e5",
};

const SLATE_TILE = {
	gradient: "bg-slate-100 text-slate-600 border border-slate-200/80",
	shadow: "none",
	text: "text-slate-700",
	tint: "bg-slate-100",
	hex: "#475569",
};

export const EXTRA_TONES: Record<
	ExtraTone,
	{ gradient: string; shadow: string; text: string; tint: string; hex: string }
> = {
	safe: {
		gradient: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
		shadow: "none",
		text: "text-emerald-700",
		tint: "bg-emerald-50",
		hex: "#059669",
	},
	caution: {
		gradient: "bg-amber-50 text-amber-700 border border-amber-200/80",
		shadow: "none",
		text: "text-amber-700",
		tint: "bg-amber-50",
		hex: "#d97706",
	},
	danger: {
		gradient: "bg-rose-50 text-rose-700 border border-rose-200/80",
		shadow: "none",
		text: "text-rose-700",
		tint: "bg-rose-50",
		hex: "#e11d48",
	},
	neutral: SLATE_TILE,
	indigo: INDIGO_TILE,
	violet: INDIGO_TILE,
	cyan: INDIGO_TILE,
	pink: INDIGO_TILE,
	teal: INDIGO_TILE,
	orange: INDIGO_TILE,
	blue: INDIGO_TILE,
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
		return INDIGO_TILE;
	}
	return EXTRA_TONES[tone as ExtraTone] ?? SLATE_TILE;
}

export function moduleFromPath(pathname: string): ModuleId {
	const seg = pathname.split("/")[2] || "beranda";
	return (seg in MODULES ? seg : "beranda") as ModuleId;
}
