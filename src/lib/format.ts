/**
 * Helper format angka & teks untuk presentasi. Tidak mengubah data —
 * hanya cara menampilkan.
 */

const idDecimal1 = new Intl.NumberFormat("id-ID", {
	minimumFractionDigits: 1,
	maximumFractionDigits: 1,
});
const idInt = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

/** "9,8" — selalu satu desimal (konsisten di seluruh app). */
export function formatDecimal1(value: number): string {
	return idDecimal1.format(Number.isFinite(value) ? value : 0);
}

/** "9,8 bulan" */
export function formatMonths(value: number, unit = "bulan"): string {
	return `${formatDecimal1(value)} ${unit}`;
}

/** "59" — bulat, pemisah ribuan id-ID. */
export function formatInt(value: number): string {
	return idInt.format(Number.isFinite(value) ? Math.round(value) : 0);
}

/** "71%" */
export function formatPercent(value: number): string {
	return `${formatInt(value)}%`;
}

/** "Rp 1.250.000" */
export function formatRupiah(raw: string | number | null | undefined): string {
	if (raw == null || raw === "") return "—";
	const n = typeof raw === "number" ? raw : Number(raw);
	if (!Number.isFinite(n)) return "—";
	return `Rp ${idInt.format(Math.round(n))}`;
}

/** "joan orlanda" → "Joan Orlanda" */
export function capitalizeName(name: string | null | undefined): string {
	if (!name) return "";
	return name
		.trim()
		.split(/\s+/)
		.map((w) =>
			w
				.split("-")
				.map((p) => (p ? p[0].toLocaleUpperCase("id-ID") + p.slice(1).toLocaleLowerCase("id-ID") : p))
				.join("-"),
		)
		.join(" ");
}

export function firstName(name: string | null | undefined): string {
	return capitalizeName(name).split(" ")[0] ?? "";
}

export function initials(name: string | null | undefined, max = 2): string {
	const parts = capitalizeName(name).split(" ").filter(Boolean);
	return parts
		.slice(0, max)
		.map((p) => p[0])
		.join("")
		.toUpperCase();
}

/** Sapaan sesuai waktu lokal. */
export function greetingForTime(date = new Date()): string {
	const h = date.getHours();
	if (h >= 4 && h < 11) return "Selamat pagi";
	if (h >= 11 && h < 15) return "Selamat siang";
	if (h >= 15 && h < 18) return "Selamat sore";
	return "Selamat malam";
}

export function formatDateID(value: string | null | undefined): string {
	if (!value) return "—";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}
