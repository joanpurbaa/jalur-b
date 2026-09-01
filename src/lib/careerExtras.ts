export const CV_STORAGE_KEY = "jalurB_cv";

export interface CvMeta {
	fileName: string;
	fileSize: number;
	uploadedAt: string;
}

export interface CareerHistoryItem {
	id: number;
	role: string;
	company: string;
	startDate: string;
	endDate: string;
	description: string;
}

export const dummyCareerHistory: CareerHistoryItem[] = [
	{
		id: 1,
		role: "Software Engineer",
		company: "PT Inovasi Digital",
		startDate: "Mar 2023",
		endDate: "Sekarang",
		description:
			"Merancang dan membangun fitur produk, mengoptimalkan performa aplikasi, dan berkolaborasi lintas tim.",
	},
	{
		id: 2,
		role: "Junior Developer",
		company: "Startup Fintech",
		startDate: "Jul 2021",
		endDate: "Feb 2023",
		description:
			"Mendukung pengembangan modul transaksi, menulis test, dan ikut serta dalam proses code review.",
	},
];

export function loadLocalCv(): CvMeta | null {
	try {
		const raw = localStorage.getItem(CV_STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as CvMeta;
		if (!parsed || typeof parsed.fileName !== "string") return null;
		return parsed;
	} catch {
		return null;
	}
}

export function saveLocalCv(meta: CvMeta | null): void {
	try {
		if (meta) {
			localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(meta));
		} else {
			localStorage.removeItem(CV_STORAGE_KEY);
		}
	} catch {
		// abaikan — penyimpanan tidak tersedia
	}
}

export function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
