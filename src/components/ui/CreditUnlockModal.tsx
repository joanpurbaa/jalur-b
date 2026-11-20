import { AlertCircle, Coins, Gift, Lock, ShoppingBag, Sparkles } from "lucide-react";
import Modal from "./Modal";
import IconTile from "./IconTile";
import { PrimaryButton, SecondaryButton } from "./PrimaryButton";
import type { CreditFeatureMeta } from "../../lib/credits";

interface CreditUnlockModalProps {
	open: boolean;
	feature: CreditFeatureMeta | null;
	balance: number;
	trialGranted: boolean;
	onClose: () => void;
	onConfirm: () => void;
	onBuyPack: () => void;
}

export default function CreditUnlockModal({
	open,
	feature,
	balance,
	trialGranted,
	onClose,
	onConfirm,
	onBuyPack,
}: CreditUnlockModalProps) {
	if (!feature) return null;

	const hasEnough = balance >= feature.cost;
	const remainingAfter = balance - feature.cost;

	return (
		<Modal
			open={open}
			onClose={onClose}
			title="Buka Fitur dengan B-Credits"
			subtitle="Akses fitur analisis mendalam sesuai kebutuhanmu, tanpa langganan bulanan."
			maxWidth="max-w-md">
			<div className="space-y-5">
				<div className="rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-4 flex items-start gap-3.5">
					<IconTile icon={Lock} tone="indigo" size="md" />
					<div className="min-w-0 flex-1">
						<div className="flex items-center justify-between gap-2">
							<p className="text-sm font-bold text-slate-900 leading-snug">
								{feature.label}
							</p>
							<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-semibold shrink-0 tabular">
								<Coins size={11} />
								{feature.cost} credit
							</span>
						</div>
						<p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
							{feature.description}
						</p>
					</div>
				</div>

				<div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2.5 text-xs">
					<div className="flex items-center justify-between">
						<span className="text-slate-500 font-medium">Saldo B-Credits saat ini</span>
						<span className="font-bold text-slate-900 tabular inline-flex items-center gap-1">
							<Coins size={13} className="text-indigo-600" />
							{balance} credit
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-slate-500 font-medium">Biaya fitur ini</span>
						<span className="font-semibold text-indigo-700 tabular">
							-{feature.cost} credit
						</span>
					</div>
					{hasEnough && (
						<div className="flex items-center justify-between pt-2 border-t border-slate-200">
							<span className="text-slate-600 font-semibold">Sisa saldo setelah dibuka</span>
							<span className="font-bold text-emerald-700 tabular">
								{remainingAfter} credit
							</span>
						</div>
					)}
				</div>

				{!hasEnough && (
					<div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 flex items-start gap-2.5 text-xs text-amber-950">
						<AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
						<div className="space-y-1">
							<p className="font-semibold">
								Saldo belum cukup (butuh {feature.cost} credit, saldo saat ini {balance} credit).
							</p>
							{!trialGranted && (
								<p className="text-amber-900/85 inline-flex items-center gap-1">
									<Gift size={12} className="shrink-0" />
									<span>
										Tips: Jalankan simulasi pertamamu di menu Simulasi untuk klaim{" "}
										<strong>6 credit gratis (14 hari)</strong>.
									</span>
								</p>
							)}
						</div>
					</div>
				)}

				<div className="flex flex-col sm:flex-row gap-2.5 pt-1">
					{hasEnough ? (
						<>
							<PrimaryButton
								fullWidth
								icon={<Sparkles size={15} />}
								onClick={onConfirm}>
								Pakai {feature.cost} credit
							</PrimaryButton>
							<SecondaryButton
								fullWidth
								icon={<ShoppingBag size={15} />}
								onClick={onBuyPack}>
								Beli paket
							</SecondaryButton>
						</>
					) : (
						<PrimaryButton
							fullWidth
							icon={<ShoppingBag size={15} />}
							onClick={onBuyPack}>
							Beli paket
						</PrimaryButton>
					)}
				</div>

				<p className="text-[11px] text-center text-slate-500">
					Fitur inti (runway, Transition Gap 1 peran, hak pesangon &amp; JKP) selalu gratis.
					Mode demo — tanpa pembayaran sungguhan.
				</p>
			</div>
		</Modal>
	);
}
