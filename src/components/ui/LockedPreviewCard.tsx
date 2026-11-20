import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Sparkles, type LucideIcon } from "lucide-react";
import { useCredits } from "../../context/CreditsContext";
import { CREDIT_FEATURES, type CreditFeatureId } from "../../lib/credits";
import IconTile from "./IconTile";

interface LockedPreviewCardProps {
	featureId: CreditFeatureId;
	title: string;
	subtitle?: string;
	icon?: LucideIcon;
	headerRight?: ReactNode;
	/** Tinggi area pratinjau saat kartu berstatus locked (default 210px). */
	previewMaxHeight?: string;
	/** Label opsional pada pill biaya di pojok kanan atas. */
	costLabel?: string;
	/** Teks singkat di kiri bawah area shadow saat locked. */
	lockedHint?: string;
	/**
	 * Konten statis dummy yang ditampilkan saat kartu berstatus locked
	 * (bagian atas terlihat sedikit, sisanya blur progresif sampai ke bawah).
	 * Begitu unlocked, otomatis diganti penuh oleh `children` (data real).
	 */
	lockedPreview?: ReactNode;
	/** Konten data real yang tampil utuh ketika kartu berstatus unlocked. */
	children: ReactNode;
	className?: string;
}

/**
 * Kartu terkunci bergaya referensi Strava (palet Indigo + Slate):
 * - Saat locked: menampilkan data statis dummy — bagian atas terlihat sedikit,
 *   lalu blur progresif sampai ke bawah dengan bottom shadow + panah kanan (→)
 *   di pojok kanan bawah yang langsung membuka `/harga` untuk membeli credit.
 * - Pill `Lock · X credit` di kanan atas tetap bisa diklik untuk memakai saldo credit.
 * - Saat unlocked: data dummy diganti penuh oleh data real (`children`) tanpa blur/shadow.
 */
export default function LockedPreviewCard({
	featureId,
	title,
	subtitle,
	icon,
	headerRight,
	previewMaxHeight = "max-h-[210px]",
	costLabel,
	lockedHint,
	lockedPreview,
	children,
	className = "",
}: LockedPreviewCardProps) {
	const navigate = useNavigate();
	const { isUnlocked, requestUnlock } = useCredits();
	const unlocked = isUnlocked(featureId);
	const meta = CREDIT_FEATURES[featureId];

	const handleGoToPricing = () => {
		navigate("/harga", { state: { fromFeature: featureId } });
	};

	return (
		<div
			className={`relative isolate flex flex-col overflow-hidden rounded-2xl bg-white border transition ${
				unlocked
					? "border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_12px_-4px_rgba(15,23,42,0.04)]"
					: "group border-slate-200/90 shadow-[0_2px_6px_rgba(15,23,42,0.06),0_12px_28px_-12px_rgba(15,23,42,0.18)] hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.08),0_16px_32px_-12px_rgba(15,23,42,0.22)]"
			} ${className}`}>
			{/* Header Kartu: bersih, selalu tajam */}
			<div className="relative z-[2] p-5 sm:p-6 pb-3 flex flex-wrap items-start justify-between gap-3">
				<div className="flex items-start gap-3 min-w-0 flex-1">
					{icon && (
						<IconTile
							icon={icon}
							tone={unlocked ? "indigo" : "neutral"}
							size="sm"
						/>
					)}
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-2">
							<h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
								{title}
							</h3>
							{unlocked && (
								<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
									<Sparkles size={10} />
									Terbuka
								</span>
							)}
						</div>
						{subtitle && (
							<p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
								{subtitle}
							</p>
						)}
					</div>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					{headerRight}
					{!unlocked && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								requestUnlock(featureId);
							}}
							title={`Buka dengan ${meta.cost} B-Credits`}
							className="press inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/90 text-indigo-700 text-[11px] font-semibold tabular transition cursor-pointer">
							<Lock size={11} strokeWidth={2.2} />
							<span>{costLabel ?? `${meta.cost} credit`}</span>
						</button>
					)}
				</div>
			</div>

			{/* Isi Kartu: data statis dummy saat locked (terlihat sedikit di atas, blur gelap progresif ke bawah), data real saat unlocked */}
			<div className="relative flex-1 overflow-hidden rounded-b-[15px]">
				<div
					className={`px-5 sm:px-6 ${
						unlocked
							? "pb-5 sm:pb-6"
							: `${previewMaxHeight} overflow-hidden pb-14 select-none pointer-events-none`
					}`}>
					{unlocked ? children : (lockedPreview ?? children)}
				</div>

				{/* Layer Progressive Blur gelap (slate/hitam) + Bottom Shadow + Panah → */}
				{!unlocked && (
					<>
						<div
							onClick={handleGoToPricing}
							aria-hidden
							className="absolute inset-0 z-[1] rounded-b-[15px] overflow-hidden cursor-pointer backdrop-blur-[7px] bg-slate-950/[0.04]"
							style={{
								WebkitMaskImage:
									"linear-gradient(to bottom, transparent 0%, transparent 22%, rgba(0,0,0,0.75) 44%, black 62%, black 100%)",
								maskImage:
									"linear-gradient(to bottom, transparent 0%, transparent 22%, rgba(0,0,0,0.75) 44%, black 62%, black 100%)",
								clipPath: "inset(0 round 0 0 15px 15px)",
							}}
						/>

						<div
							onClick={handleGoToPricing}
							role="button"
							tabIndex={0}
							aria-label={`Beli B-Credits untuk membuka data lengkap ${title}`}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									handleGoToPricing();
								}
							}}
							className="absolute inset-x-0 bottom-0 z-[2] rounded-b-[15px] overflow-hidden h-28 sm:h-32 flex items-end justify-between gap-3 px-5 sm:px-6 pb-4 pt-12 cursor-pointer shadow-[inset_0_-32px_40px_-14px_rgba(15,23,42,0.18)]"
							style={{
								background:
									"linear-gradient(to top, rgba(241,245,249,0.96) 0%, rgba(248,250,252,0.88) 45%, rgba(255,255,255,0.32) 76%, rgba(255,255,255,0) 100%)",
							}}>
							<div className="flex items-center gap-2 min-w-0">
								<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 border border-slate-200/90 text-slate-700 shrink-0">
									<Lock size={11} strokeWidth={2.2} />
								</span>
								<span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-700 transition truncate">
									{lockedHint ?? "Contoh tampilan · Beli credit untuk data aslimu"}
								</span>
							</div>

							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleGoToPricing();
								}}
								aria-label={`Buka halaman beli credit untuk ${title}`}
								title="Beli credit untuk membuka data aslimu"
								className="press shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-slate-200/90 text-slate-700 shadow-sm group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white group-hover:translate-x-0.5 transition cursor-pointer">
								<ArrowRight size={16} strokeWidth={2.1} />
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
