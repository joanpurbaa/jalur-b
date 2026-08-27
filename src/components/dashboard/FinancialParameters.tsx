import { useState } from "react";
import {
	PiggyBank,
	RefreshCcw,
	Receipt,
	CreditCard,
	Users,
} from "lucide-react";
import { financialData } from "../../data/dashboardDummyData";
import ParameterCard from "../ui/ParameterCard";
import AddParameterCard from "../ui/AddParameterCard";
import { PrimaryButton } from "../ui/PrimaryButton";
import type { FinanceTone } from "../../lib/status";

const iconMap = {
	PiggyBank,
	RefreshCcw,
	Receipt,
	CreditCard,
	Users,
};

type ParameterItem = (typeof financialData.parameters)[number];

const inputClass =
	"w-full px-4 py-3 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-neutral placeholder:text-neutral/40";

const savingsTypes = [
	"Tabungan Utama",
	"Dana Darurat",
	"Tabungan Jangka Panjang",
	"Investasi",
	"Lainnya",
];

const liquidityOptions = [
	"Mudah dicairkan",
	"Perlu proses",
	"Tidak mudah dicairkan",
];

function formatRupiah(n: number): string {
	return `Rp ${n.toLocaleString("id-ID")}`;
}

interface SavingsForm {
	name: string;
	nominal: string;
	type: string;
	liquidity: string;
	note: string;
}

export default function FinancialParameters() {
	const [parameters, setParameters] = useState(financialData.parameters);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form, setForm] = useState<SavingsForm>({
		name: "",
		nominal: "",
		type: "",
		liquidity: "",
		note: "",
	});
	const [errors, setErrors] = useState<Record<string, boolean>>({});

	const [editing, setEditing] = useState<ParameterItem | null>(null);
	const [editForm, setEditForm] = useState({
		label: "",
		value: "",
		sublabel: "",
	});
	const [editErrors, setEditErrors] = useState({ label: false, value: false });

	const updateField = (key: keyof SavingsForm, value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	const resetForm = () => {
		setForm({ name: "", nominal: "", type: "", liquidity: "", note: "" });
		setErrors({});
	};

	const closeModal = () => {
		resetForm();
		setIsModalOpen(false);
	};

	const handleSave = () => {
		const nextErrors = {
			name: form.name.trim() === "",
			nominal: form.nominal.trim() === "",
			type: form.type === "",
			liquidity: form.liquidity === "",
		};
		setErrors(nextErrors);
		if (Object.values(nextErrors).some(Boolean)) return;

		setParameters((prev) => [
			...prev,
			{
				id:
					typeof crypto !== "undefined" && "randomUUID" in crypto
						? crypto.randomUUID()
						: String(Date.now()),
				label: form.name.trim(),
				value: formatRupiah(Number(form.nominal)),
				sublabel: `${form.type} · ${form.liquidity}`,
				icon: "PiggyBank",
				tone: "indigo" as FinanceTone,
			},
		]);
		closeModal();
	};

	const openEdit = (item: ParameterItem) => {
		setEditForm({
			label: item.label,
			value: item.value,
			sublabel: item.sublabel ?? "",
		});
		setEditErrors({ label: false, value: false });
		setEditing(item);
	};

	const updateEditField = (key: keyof typeof editForm, value: string) =>
		setEditForm((prev) => ({ ...prev, [key]: value }));

	const closeEdit = () => {
		setEditing(null);
		setEditForm({ label: "", value: "", sublabel: "" });
		setEditErrors({ label: false, value: false });
	};

	const handleEditSave = () => {
		const next = {
			label: editForm.label.trim() === "",
			value: editForm.value.trim() === "",
		};
		setEditErrors(next);
		if (Object.values(next).some(Boolean)) return;

		setParameters((prev) =>
			prev.map((p) =>
				p.id === editing?.id
					? {
							...p,
							label: editForm.label.trim(),
							value: editForm.value.trim(),
							sublabel: editForm.sublabel.trim() || null,
						}
					: p,
			),
		);
		closeEdit();
	};

	return (
		<div>
			<h3 className="text-sm font-bold text-neutral mb-3">Parameter Finansial</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{parameters.map((item) => (
					<ParameterCard
						key={item.id}
						label={item.label}
						value={item.value}
						sublabel={item.sublabel}
						icon={iconMap[item.icon as keyof typeof iconMap]}
						tone={item.tone as FinanceTone}
						onEdit={() => openEdit(item)}
					/>
				))}
				<AddParameterCard onClick={() => setIsModalOpen(true)} />
			</div>

			{isModalOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral/40 backdrop-blur-sm"
					onClick={closeModal}>
					<div
						className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral/5"
						onClick={(e) => e.stopPropagation()}>
						<div className="flex items-start justify-between mb-6">
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-neutral">
									Tambah Tabungan
								</h2>
								<p className="text-sm text-neutral/60 mt-1">
									Catat tabungan atau aset yang kamu miliki.
								</p>
							</div>
							<button
								type="button"
								onClick={closeModal}
								className="text-neutral/40 hover:text-neutral transition cursor-pointer">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="space-y-5">
							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Nama Tabungan <span className="text-red-500">*</span>
								</label>
								<input
									autoFocus
									type="text"
									value={form.name}
									onChange={(e) => updateField("name", e.target.value)}
									placeholder="Contoh: Tabungan BCA"
									className={inputClass}
								/>
								{errors.name && (
									<p className="text-xs text-red-500 mt-1">
										Nama tabungan wajib diisi.
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Nominal <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									inputMode="numeric"
									value={
										form.nominal
											? `Rp ${form.nominal.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
											: "Rp 0"
									}
									onChange={(e) =>
										updateField(
											"nominal",
											e.target.value.replace(/\D/g, ""),
										)
									}
									placeholder="Rp 0"
									className={inputClass}
								/>
								{errors.nominal && (
									<p className="text-xs text-red-500 mt-1">
										Nominal wajib diisi.
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Jenis Tabungan <span className="text-red-500">*</span>
								</label>
								<select
									value={form.type}
									onChange={(e) => updateField("type", e.target.value)}
									className={inputClass}>
									<option value="" disabled>
										Pilih jenis tabungan
									</option>
									{savingsTypes.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>
								{errors.type && (
									<p className="text-xs text-red-500 mt-1">
										Jenis tabungan wajib dipilih.
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Kemudahan Dicairkan <span className="text-red-500">*</span>
								</label>
								<select
									value={form.liquidity}
									onChange={(e) =>
										updateField("liquidity", e.target.value)
									}
									className={inputClass}>
									<option value="" disabled>
										Pilih kemudahan pencairan
									</option>
									{liquidityOptions.map((opt) => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
								{errors.liquidity && (
									<p className="text-xs text-red-500 mt-1">
										Kemudahan dicairkan wajib dipilih.
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Catatan
								</label>
								<textarea
									rows={3}
									value={form.note}
									onChange={(e) => updateField("note", e.target.value)}
									placeholder="Opsional"
									className={`${inputClass} resize-none`}
								/>
							</div>
						</div>

						<div className="mt-8 pt-6 border-t border-neutral/10 flex items-center justify-end gap-3">
							<button
								type="button"
								onClick={closeModal}
								className="px-5 py-2.5 text-sm font-medium rounded-full border border-neutral/20 text-neutral hover:bg-tertiary transition cursor-pointer">
								Batalkan
							</button>
							<PrimaryButton onClick={handleSave}>
								Simpan Tabungan
							</PrimaryButton>
						</div>
					</div>
				</div>
			)}

			{editing && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral/40 backdrop-blur-sm"
					onClick={closeEdit}>
					<div
						className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral/5"
						onClick={(e) => e.stopPropagation()}>
						<div className="flex items-start justify-between mb-6">
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-neutral">
									Edit Parameter
								</h2>
								<p className="text-sm text-neutral/60 mt-1">
									Perbarui data parameter finansialmu.
								</p>
							</div>
							<button
								type="button"
								onClick={closeEdit}
								className="text-neutral/40 hover:text-neutral transition cursor-pointer">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="space-y-5">
							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Nama <span className="text-red-500">*</span>
								</label>
								<input
									autoFocus
									type="text"
									value={editForm.label}
									onChange={(e) =>
										updateEditField("label", e.target.value)
									}
									placeholder="Contoh: Tabungan BCA"
									className={inputClass}
								/>
								{editErrors.label && (
									<p className="text-xs text-red-500 mt-1">
										Nama wajib diisi.
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Nilai <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={editForm.value}
									onChange={(e) =>
										updateEditField("value", e.target.value)
									}
									placeholder="Contoh: Rp 15.000.000"
									className={inputClass}
								/>
								{editErrors.value && (
									<p className="text-xs text-red-500 mt-1">
										Nilai wajib diisi.
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Catatan
								</label>
								<input
									type="text"
									value={editForm.sublabel}
									onChange={(e) =>
										updateEditField("sublabel", e.target.value)
									}
									placeholder="Opsional"
									className={inputClass}
								/>
							</div>
						</div>

						<div className="mt-8 pt-6 border-t border-neutral/10 flex items-center justify-end gap-3">
							<button
								type="button"
								onClick={closeEdit}
								className="px-5 py-2.5 text-sm font-medium rounded-full border border-neutral/20 text-neutral hover:bg-tertiary transition cursor-pointer">
								Batalkan
							</button>
							<PrimaryButton onClick={handleEditSave}>
								Simpan Perubahan
							</PrimaryButton>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
