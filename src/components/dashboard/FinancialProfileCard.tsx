import { useEffect, useState } from "react";
import { Wallet, CreditCard, Users, Coins, Pencil } from "lucide-react";
import ParameterCard from "../ui/ParameterCard";
import { SkeletonStatCard } from "../ui/Skeleton";
import { SecondaryButton } from "../ui/PrimaryButton";
import { Stagger, StaggerItem } from "../ui/Motion";
import { financialApi } from "../../services/financial";
import { formatRupiah } from "../../lib/format";
import type { FinancialProfileResponse } from "../../types/financial";
import { EditFinancialModal } from "../profile/EditFinancialModal";

const cardConfig: {
	label: string;
	sublabel: string;
	icon: typeof Wallet;
	value: (p: FinancialProfileResponse) => string;
}[] = [
	{
		label: "Pengeluaran Esensial / Bln",
		sublabel: "Kebutuhan pokok bulanan",
		icon: Wallet,
		value: (p) => formatRupiah(p.monthly_essential_expenses),
	},
	{
		label: "Cicilan Utang / Bln",
		sublabel: "Kewajiban rutin bulanan",
		icon: CreditCard,
		value: (p) => formatRupiah(p.monthly_debt_payment),
	},
	{
		label: "Jumlah Tanggungan",
		sublabel: "Anggota keluarga yang ditanggung",
		icon: Users,
		value: (p) => (p.dependents != null ? `${p.dependents} orang` : "0 orang"),
	},
	{
		label: "Mata Uang",
		sublabel: "Satuan perhitungan runway",
		icon: Coins,
		value: (p) => p.currency || "IDR",
	},
];

interface FinancialProfileCardProps {
	onChanged?: () => void | Promise<void>;
}

export default function FinancialProfileCard({
	onChanged,
}: FinancialProfileCardProps) {
	const [profile, setProfile] = useState<FinancialProfileResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [editOpen, setEditOpen] = useState(false);

	const load = async () => {
		try {
			const res = await financialApi.getOrCreate();
			setProfile(res.profile ?? null);
		} catch {
			setProfile(null);
		}
	};

	useEffect(() => {
		let active = true;
		financialApi
			.getOrCreate()
			.then((res) => {
				if (active) setProfile(res.profile ?? null);
			})
			.catch(() => {
				if (active) setProfile(null);
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	const handleSaved = async () => {
		await load();
		void onChanged?.();
	};

	return (
		<section className="mb-8" aria-label="Profil Finansial">
			<div className="flex flex-wrap items-center justify-between gap-3 mb-4">
				<div>
					<h3 className="text-base font-bold text-slate-900">
						Beban & Profil Finansial Bulanan
					</h3>
					<p className="text-xs sm:text-sm text-slate-500">
						Komponen pengeluaran yang menentukan kecepatan pemakaian dana
						cadangan
					</p>
				</div>
				<SecondaryButton
					size="sm"
					icon={<Pencil size={14} />}
					onClick={() => setEditOpen(true)}>
					Ubah Profil Finansial
				</SecondaryButton>
			</div>

			{loading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{[0, 1, 2, 3].map((i) => (
						<SkeletonStatCard key={i} />
					))}
				</div>
			) : (
				<Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{cardConfig.map((c) => (
						<StaggerItem key={c.label}>
							<ParameterCard
								label={c.label}
								sublabel={c.sublabel}
								value={profile ? c.value(profile) : "—"}
								icon={c.icon}
								onEdit={() => setEditOpen(true)}
							/>
						</StaggerItem>
					))}
				</Stagger>
			)}

			{editOpen && (
				<EditFinancialModal
					open={editOpen}
					onClose={() => setEditOpen(false)}
					onSaved={handleSaved}
				/>
			)}
		</section>
	);
}
