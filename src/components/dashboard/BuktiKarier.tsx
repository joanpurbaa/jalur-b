import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import { PrimaryButton, SecondaryButton } from "../ui/PrimaryButton";
import EvidenceForm from "./EvidenceForm";
import type { EvidenceFormHandle } from "./EvidenceForm";
import FilterTabs from "../ui/FilterTabs";
import EvidenceCard from "./EvidenceCard";
import EmptyState from "../ui/EmptyState";
import { SkeletonStatCard } from "../ui/Skeleton";
import Modal from "../ui/Modal";
import { Stagger, StaggerItem } from "../ui/Motion";
import { evidenceApi } from "../../services/evidence";
import { evidenceTypeLabels, formatEvidenceDate } from "../../lib/evidence";
import type {
	EvidenceItemCreate,
	EvidenceItemResponse,
	EvidenceItemUpdate,
	EvidenceType,
} from "../../types/evidence";

const filterOptions = ["Semua", ...Object.values(evidenceTypeLabels)];

const inputClass =
	"w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600";

function toDisplay(item: EvidenceItemResponse) {
	return {
		category: evidenceTypeLabels[item.evidence_type] ?? item.evidence_type,
		title: item.title,
		role: item.user_role || "Peran Utama",
		description: item.description,
		impactLabel: "Dampak & Hasil",
		impactValue: item.impact || "—",
		date: formatEvidenceDate(item.evidence_date),
		aiGenerated: item.ai_generated,
		attachmentUrl: item.attachment_url,
	};
}

interface EditForm {
	evidence_type: EvidenceType | "";
	title: string;
	description: string;
	impact: string;
	evidence_date: string;
}

const emptyEditForm: EditForm = {
	evidence_type: "",
	title: "",
	description: "",
	impact: "",
	evidence_date: "",
};

export default function BuktiKarier() {
	const [activeFilter, setActiveFilter] = useState("Semua");
	const [items, setItems] = useState<EvidenceItemResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState(false);
	const [toastMsg, setToastMsg] = useState<string | null>(null);
	const formRef = useRef<EvidenceFormHandle>(null);

	const [editing, setEditing] = useState<EvidenceItemResponse | null>(null);
	const [editForm, setEditForm] = useState<EditForm>(emptyEditForm);
	const [editFile, setEditFile] = useState<File | null>(null);
	const [removeAttachment, setRemoveAttachment] = useState(false);
	const [editSaving, setEditSaving] = useState(false);
	const [editError, setEditError] = useState("");

	const showToast = useCallback((msg: string) => {
		setToastMsg(msg);
		setTimeout(() => {
			setToastMsg((curr) => (curr === msg ? null : curr));
		}, 3500);
	}, []);

	useEffect(() => {
		let active = true;
		evidenceApi
			.list({ limit: 100 })
			.then((res) => {
				if (active) setItems(res.items);
			})
			.catch(() => {
				if (active) setLoadError(true);
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	const handleCreate = useCallback(
		async (payload: EvidenceItemCreate, file?: File | null) => {
			let created = await evidenceApi.create(payload);
			if (file) {
				try {
					created = await evidenceApi.uploadAttachment(created.id, file);
				} catch {
					// Upload lampiran gagal — bukti tetap tersimpan tanpa lampiran.
				}
			}
			setItems((prev) => [created, ...prev]);
			setActiveFilter("Semua");
			showToast("Bukti karier tersimpan ke portofoliomu.");
		},
		[showToast],
	);

	const openEdit = (item: EvidenceItemResponse) => {
		setEditForm({
			evidence_type: item.evidence_type,
			title: item.title,
			description: item.description,
			impact: item.impact || "",
			evidence_date: item.evidence_date || "",
		});
		setEditFile(null);
		setRemoveAttachment(false);
		setEditError("");
		setEditing(item);
	};

	const closeEdit = () => {
		setEditing(null);
		setEditForm(emptyEditForm);
		setEditFile(null);
		setRemoveAttachment(false);
		setEditError("");
	};

	const updateEditField = <K extends keyof EditForm>(
		key: K,
		value: EditForm[K],
	) => setEditForm((prev) => ({ ...prev, [key]: value }));

	const handleEditSave = async () => {
		if (!editing || editSaving) return;
		setEditSaving(true);
		setEditError("");
		try {
			const payload: EvidenceItemUpdate = {};
			if (editForm.evidence_type)
				payload.evidence_type = editForm.evidence_type;
			if (editForm.title.trim()) payload.title = editForm.title.trim();
			if (editForm.description.trim())
				payload.description = editForm.description.trim();
			if (editForm.impact.trim()) payload.impact = editForm.impact.trim();
			if (editForm.evidence_date)
				payload.evidence_date = editForm.evidence_date;

			let updated = await evidenceApi.update(editing.id, payload);
			if (editFile) {
				try {
					updated = await evidenceApi.uploadAttachment(editing.id, editFile);
				} catch {
					// Gagal mengunggah lampiran baru — field bukti tetap tersimpan.
				}
			} else if (removeAttachment) {
				try {
					await evidenceApi.deleteAttachment(editing.id);
					updated = { ...updated, attachment_url: null };
				} catch {
					// Gagal menghapus lampiran — field bukti tetap tersimpan.
				}
			}
			setItems((prev) =>
				prev.map((item) => (item.id === updated.id ? updated : item)),
			);
			closeEdit();
			showToast("Perubahan bukti karier disimpan.");
		} catch {
			setEditError("Gagal menyimpan bukti. Silakan coba lagi.");
		} finally {
			setEditSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!editing || editSaving) return;
		setEditSaving(true);
		setEditError("");
		try {
			await evidenceApi.remove(editing.id);
			setItems((prev) => prev.filter((item) => item.id !== editing.id));
			closeEdit();
			showToast("Bukti karier dihapus.");
		} catch {
			setEditError("Gagal menghapus bukti. Silakan coba lagi.");
		} finally {
			setEditSaving(false);
		}
	};

	const counts = useMemo(() => {
		const map: Record<string, number> = { Semua: items.length };
		for (const item of items) {
			const lbl = evidenceTypeLabels[item.evidence_type] ?? item.evidence_type;
			map[lbl] = (map[lbl] ?? 0) + 1;
		}
		return map;
	}, [items]);

	const filteredItems = items.filter(
		(item) =>
			activeFilter === "Semua" ||
			(evidenceTypeLabels[item.evidence_type] ?? item.evidence_type) ===
				activeFilter,
	);

	return (
		<div>
			<PageHeader
				title="Bukti Karier"
				subtitle="Simpan pencapaian, proyek, dan apresiasi kerjamu agar portofoliomu selalu siap."
				action={
					<PrimaryButton
						icon={<Plus size={16} />}
						onClick={() => formRef.current?.open()}>
						Tambah Bukti
					</PrimaryButton>
				}
			/>

			{toastMsg && (
				<div
					role="status"
					className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 flex items-center gap-2.5 text-sm font-semibold">
					<CheckCircle2 size={17} className="text-emerald-600 shrink-0" />
					<span>{toastMsg}</span>
				</div>
			)}

			<EvidenceForm ref={formRef} onSave={handleCreate} />

			{loading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{[0, 1, 2].map((i) => (
						<SkeletonStatCard key={i} className="h-64" />
					))}
				</div>
			) : items.length === 0 ? (
				loadError ? (
					<EmptyState
						illustration="evidence"
						title="Gagal memuat bukti karier"
						description="Kami belum dapat mengambil daftar bukti kariermu saat ini. Periksa koneksi internetmu lalu muat ulang halaman."
					/>
				) : (
					<EmptyState
						illustration="evidence"
						title="Portofolio bukti kariermu masih kosong"
						description="Simpan proyek, pencapaian, atau feedback penting selagi masih ingat. Dokumentasi ini sangat membantu saat memperbarui CV maupun menghadapi evaluasi kerja."
						action={
							<PrimaryButton
								icon={<Plus size={16} />}
								onClick={() => formRef.current?.open()}>
								Tambah Bukti Pertama
							</PrimaryButton>
						}
					/>
				)
			) : (
				<>
					<FilterTabs
						options={filterOptions}
						active={activeFilter}
						onChange={setActiveFilter}
						counts={counts}
					/>

					{filteredItems.length === 0 ? (
						<EmptyState
							illustration="evidence"
							title={`Belum ada bukti di kategori "${activeFilter}"`}
							description="Tambahkan bukti baru untuk kategori ini atau pilih kategori lainnya."
							action={
								<PrimaryButton
									icon={<Plus size={16} />}
									onClick={() => formRef.current?.open()}>
									Tambah Bukti
								</PrimaryButton>
							}
						/>
					) : (
						<Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
							{filteredItems.map((item) => (
								<StaggerItem key={item.id} className="h-full">
									<EvidenceCard
										{...toDisplay(item)}
										onEdit={() => openEdit(item)}
										onDelete={() => openEdit(item)}
									/>
								</StaggerItem>
							))}
						</Stagger>
					)}
				</>
			)}

			<Modal
				open={editing !== null}
				onClose={closeEdit}
				title="Edit Bukti Karier"
				subtitle="Perbarui rincian atau lampiran bukti kerjamu.">
				<div className="space-y-4">
					<div>
						<label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							Jenis Bukti
						</label>
						<select
							value={editForm.evidence_type}
							onChange={(e) =>
								updateEditField(
									"evidence_type",
									e.target.value as EvidenceType,
								)
							}
							className={inputClass}>
							{(Object.keys(evidenceTypeLabels) as EvidenceType[]).map(
								(type) => (
									<option key={type} value={type}>
										{evidenceTypeLabels[type]}
									</option>
								),
							)}
						</select>
					</div>
					<div>
						<label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							Judul
						</label>
						<input
							type="text"
							value={editForm.title}
							onChange={(e) => updateEditField("title", e.target.value)}
							className={inputClass}
						/>
					</div>
					<div>
						<label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							Deskripsi
						</label>
						<textarea
							rows={3}
							value={editForm.description}
							onChange={(e) => updateEditField("description", e.target.value)}
							className={`${inputClass} resize-none`}
						/>
					</div>
					<div>
						<label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							Dampak
						</label>
						<textarea
							rows={2}
							value={editForm.impact}
							onChange={(e) => updateEditField("impact", e.target.value)}
							className={`${inputClass} resize-none`}
						/>
					</div>
					<div>
						<label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							Tanggal
						</label>
						<input
							type="date"
							value={editForm.evidence_date}
							onChange={(e) =>
								updateEditField("evidence_date", e.target.value)
							}
							className={inputClass}
						/>
					</div>
					<div>
						<label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							Lampiran
						</label>
						{editing?.attachment_url && !removeAttachment ? (
							<div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 mb-2">
								<img
									src={editing.attachment_url}
									alt="Lampiran bukti"
									className="h-12 w-12 rounded-lg object-cover border border-slate-200"
								/>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-slate-600 truncate">
										{editing.attachment_url}
									</p>
									<button
										type="button"
										onClick={() => setRemoveAttachment(true)}
										className="text-xs font-semibold text-rose-700 hover:text-rose-800 transition cursor-pointer mt-1">
										Hapus Lampiran
									</button>
								</div>
							</div>
						) : null}
						{removeAttachment && (
							<p className="text-xs text-slate-600 mb-2">
								Lampiran saat ini akan dihapus.{" "}
								<button
									type="button"
									onClick={() => setRemoveAttachment(false)}
									className="text-indigo-700 font-semibold cursor-pointer">
									Batalkan
								</button>
							</p>
						)}
						<input
							type="file"
							accept="image/*"
							onChange={(e) => {
								setEditFile(e.target.files?.[0] ?? null);
								if (e.target.files?.[0]) setRemoveAttachment(false);
							}}
							className={`${inputClass} file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-indigo-700`}
						/>
						{editFile && (
							<p className="text-xs text-slate-600 mt-1.5">{editFile.name}</p>
						)}
					</div>
					{editError && (
						<p className="text-xs text-rose-700 font-semibold">{editError}</p>
					)}
				</div>
				<div className="flex items-center justify-between gap-2.5 mt-6 pt-4 border-t border-slate-100">
					<button
						type="button"
						onClick={() => void handleDelete()}
						disabled={editSaving}
						className="text-xs font-semibold text-rose-700 hover:text-rose-800 transition cursor-pointer disabled:opacity-50">
						Hapus Bukti
					</button>
					<div className="flex items-center gap-2.5">
						<SecondaryButton onClick={closeEdit}>Batal</SecondaryButton>
						<PrimaryButton
							onClick={() => void handleEditSave()}
							disabled={editSaving}>
							{editSaving ? "Menyimpan..." : "Simpan Perubahan"}
						</PrimaryButton>
					</div>
				</div>
			</Modal>
		</div>
	);
}
