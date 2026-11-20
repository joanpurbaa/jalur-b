/**
 * Manual persistent cache di localStorage untuk menyimpan hasil analisis
 * dan hasil simulasi terakhir agar tetap tersedia saat berpindah halaman,
 * refresh, maupun kebutuhan demo/screenshot tanpa mengubah fungsi API backend.
 */

import { getToken } from "../services/http";

export type ManualCacheKey =
	| "career_health"
	| "career_risk"
	| "ai_exposure"
	| "career_pivot"
	| "financial"
	| "simulation_last";

export interface ManualCacheRecord<T> {
	data: T;
	savedAt: string;
}

const MANUAL_CACHE_PREFIX = "jb:manual-cache:v1";

function namespacePrefix(): string {
	const token = getToken() ?? "guest";
	return `${MANUAL_CACHE_PREFIX}:${token.slice(-8)}:`;
}

function fullKey(key: ManualCacheKey): string {
	return `${namespacePrefix()}${key}`;
}

export function saveManualCache<T>(key: ManualCacheKey, data: T): void {
	try {
		const record: ManualCacheRecord<T> = {
			data,
			savedAt: new Date().toISOString(),
		};
		localStorage.setItem(fullKey(key), JSON.stringify(record));
	} catch {
		// abaikan jika storage penuh atau diblokir browser
	}
}

export function loadManualCache<T>(
	key: ManualCacheKey,
): ManualCacheRecord<T> | null {
	try {
		const raw = localStorage.getItem(fullKey(key));
		if (!raw) return null;
		const parsed = JSON.parse(raw) as ManualCacheRecord<T>;
		if (!parsed || typeof parsed !== "object" || !("data" in parsed)) {
			return null;
		}
		return parsed;
	} catch {
		return null;
	}
}

export function removeManualCache(key: ManualCacheKey): void {
	try {
		localStorage.removeItem(fullKey(key));
	} catch {
		// abaikan
	}
}

export function clearAllManualCache(): void {
	try {
		const prefix = namespacePrefix();
		const keys = Object.keys(localStorage);
		for (const k of keys) {
			if (k.startsWith(prefix)) {
				localStorage.removeItem(k);
			}
		}
	} catch {
		// abaikan
	}
}

export interface ManualCacheSummaryItem {
	key: ManualCacheKey;
	label: string;
	cached: boolean;
	savedAt: string | null;
}

const CACHE_LABELS: Record<ManualCacheKey, string> = {
	career_health: "Kesehatan Karier",
	career_risk: "Risiko Karier",
	ai_exposure: "Skill & AI",
	career_pivot: "Jalur Karier",
	financial: "Finansial & Runway",
	simulation_last: "Hasil Simulasi Terakhir",
};

export function getManualCacheSummary(): {
	items: ManualCacheSummaryItem[];
	httpCacheCount: number;
} {
	const keys: ManualCacheKey[] = [
		"career_health",
		"career_risk",
		"ai_exposure",
		"career_pivot",
		"financial",
		"simulation_last",
	];

	const items: ManualCacheSummaryItem[] = keys.map((key) => {
		const rec = loadManualCache(key);
		return {
			key,
			label: CACHE_LABELS[key],
			cached: rec !== null,
			savedAt: rec?.savedAt ?? null,
		};
	});

	let httpCacheCount = 0;
	try {
		const token = getToken() ?? "";
		const httpPrefix = `jb:cache:v1:${token.slice(-8)}:`;
		for (const k of Object.keys(localStorage)) {
			if (k.startsWith(httpPrefix)) httpCacheCount += 1;
		}
	} catch {
		httpCacheCount = 0;
	}

	return { items, httpCacheCount };
}
