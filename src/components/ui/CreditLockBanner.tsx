import { Coins, Lock } from "lucide-react";
import { useCredits } from "../../context/CreditsContext";
import { CREDIT_FEATURES, type CreditFeatureId } from "../../lib/credits";
import { PrimaryButton } from "./PrimaryButton";
import IconTile from "./IconTile";

interface CreditCostPillProps {
	cost: number;
	className?: string;
}

/** Pill kecil ikon gembok + biaya credit untuk tombol atau item terkunci. */
export function CreditCostPill({ cost, className = "" }: CreditCostPillProps) {
	return (
		<span
			className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-[11px] font-semibold tabular shrink-0 ${className}`}>
			<Lock size={10} strokeWidth={2.2} />
			<span>{cost} credit</span>
		</span>
	);
}

interface CreditGateCardProps {
	featureId: CreditFeatureId;
	title?: string;
	subtitle?: string;
	ctaLabel?: string;
	onUnlocked?: () => void;
	compact?: boolean;
}

/**
 * Kartu gate terkunci yang tenang dan jelas untuk fitur berbayar B-Credits.
 */
export function CreditGateCard({
	featureId,
	title,
	subtitle,
	ctaLabel,
	onUnlocked,
	compact = false,
}: CreditGateCardProps) {
	const { requestUnlock, balance } = useCredits();
	const meta = CREDIT_FEATURES[featureId];

	return (
		<div
			className={`rounded-xl border border-indigo-200/80 bg-white/95 backdrop-blur-xs shadow-sm ${
				compact ? "p-4" : "p-5 sm:p-6"
			}`}>
			<div
				className={`flex flex-col ${
					compact ? "gap-3" : "sm:flex-row sm:items-center justify-between gap-4"
				}`}>
				<div className="flex items-start gap-3 min-w-0">
					<IconTile icon={Lock} tone="indigo" size={compact ? "sm" : "md"} />
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-2">
							<h4 className="text-sm font-bold text-slate-900">
								{title ?? meta.label}
							</h4>
							<CreditCostPill cost={meta.cost} />
						</div>
						<p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
							{subtitle ?? meta.description}
						</p>
						<p className="text-[11px] text-slate-500 mt-1.5 inline-flex items-center gap-1 tabular">
							<Coins size={11} className="text-indigo-600" />
							Saldo saat ini: <strong className="text-slate-700">{balance} credit</strong>
						</p>
					</div>
				</div>

				<div className="shrink-0">
					<PrimaryButton
						size="sm"
						fullWidth={compact}
						icon={<Lock size={13} />}
						onClick={() => requestUnlock(featureId, onUnlocked)}>
						{ctaLabel ?? `Buka · ${meta.cost} credit`}
					</PrimaryButton>
				</div>
			</div>
		</div>
	);
}
