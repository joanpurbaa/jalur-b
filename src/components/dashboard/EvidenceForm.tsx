import {
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import {
	Award,
	BookOpen,
	FolderKanban,
	Medal,
	MessageSquareQuote,
	PlusCircle,
	Sparkles,
	Trophy,
	type LucideIcon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "../ui/PrimaryButton";
import Modal from "../ui/Modal";
import { evidenceTypeLabels } from "../../lib/evidence";
import { profileApi } from "../../services/profile";
import type { EvidenceItemCreate, EvidenceType } from "../../types/evidence";

const inputClass =
	"w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm text-neutral placeholder:text-neutral/40 transition";

const TYPE_ICONS: Record<EvidenceType, LucideIcon> = {
	project: FolderKanban,
	achievement: Trophy,
	feedback: MessageSquareQuote,
	certificate: Medal,
	award: Award,
	training: BookOpen,
	other: Sparkles,
};

export interface EvidenceFormHandle {
	open: () => void;
}

interface EvidenceFormProps {
	onSave: (
		payload: EvidenceItemCreate,
		file?: File | null,
	) => Promise<unknown> | void;
}

function getOnboardingRole(): string {
	try {
		const raw = localStorage.getItem("jalurB_onboarding");
		if (!raw) return "";
		const data = JSON.parse(raw) as { role?: string };
		return data.role ?? "";
	} catch {
		return "";
	}
}

const EvidenceForm = forwardRef<EvidenceFormHandle, EvidenceFormProps>(
	({ onSave }, ref) => {
		const [isOpen, setIsOpen] = useState(false);
		const [evidenceType, setEvidenceType] = useState<EvidenceType | "">("project");
		const [title, setTitle] = useState("");
		const [description, setDescription] = useState("");
		const [impact, setImpact] = useState("");
		const [date, setDate] = useState("");
		const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
		const [saving, setSaving] = useState(false);
		const [saveError, setSaveError] = useState("");
		const titleRef = useRef<HTMLInputElement>(null);

		useImperativeHandle(ref, () => ({
			open: () => {
				setIsOpen(true);
				setTimeout(() => titleRef.current?.focus(), 80);
			},
		}));

		const canSave = evidenceType !== "" && title.trim().length > 0;

		const reset = () => {
			setEvidenceType("project");
			setTitle("");
			setDescription("");
			setImpact("");
			setDate("");
			setAttachmentFile(null);
			setSaveError("");
		};

		const handleClose = () => {
			if (saving) return;
			setIsOpen(false);
		};

		const handleSave = async () => {
			if (saving || !canSave) return;
			setSaving(true);
			setSaveError("");
			try {
				const profile = await profileApi.get().catch(() => null);
				const userRole =
					profile?.profile?.current_role_name?.trim() ||
					getOnboardingRole().trim();

				await onSave(
					{
						evidence_type: evidenceType as EvidenceType,
						title: title.trim(),
						user_role: userRole,
						description: description.trim(),
						impact: impact.trim() || "Dampak belum disebutkan.",
						evidence_date: date || null,
						ai_generated: false,
					},
					attachmentFile,
				);
				reset();
				setIsOpen(false);
			} catch {
				setSaveError("Gagal menyimpan bukti. Silakan coba lagi.");
			} finally {
				setSaving(false);
			}
		};

		return (
			<Modal
				open={isOpen}
				onClose={handleClose}
				variant="drawer"
				title="Tambah Bukti Karier"
				subtitle="Catat proyek, pencapaian, atau apresiasi selagi masih segar di ingatanmu.">
				<div className="space-y-5">
					<div>
						<label className="text-xs font-bold uppercase tracking-wider text-neutral/60 mb-2 block">
							Pilih Jenis Bukti
						</label>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
							{(Object.keys(evidenceTypeLabels) as EvidenceType[]).map(
								(type) => {
									const Icon = TYPE_ICONS[type];
									const selected = evidenceType === type;
									return (
										<button
											key={type}
											type="button"
											onClick={() => setEvidenceType(type)}
											className={`press flex items-center gap-2 p-2.5 rounded-2xl border text-left text-xs font-bold transition cursor-pointer ${
												selected
													? "bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-500/25"
													: "bg-white border-slate-200 text-neutral/75 hover:bg-slate-50"
											}`}>
											<Icon
												size={15}
												className={
													selected ? "text-sky-600" : "text-neutral/50"
												}
											/>
											<span className="truncate">
												{evidenceTypeLabels[type]}
											</span>
										</button>
									);
								},
							)}
						</div>
					</div>

					<div>
						<label className="text-xs font-bold text-neutral/70 mb-1.5 block">
							Judul Bukti <span className="text-rose-500">*</span>
						</label>
						<input
							ref={titleRef}
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Contoh: Memimpin migrasi sistem pembayaran tepat waktu"
							className={inputClass}
						/>
					</div>

					<div>
						<label className="text-xs font-bold text-neutral/70 mb-1.5 block">
							Cerita Singkat & Peranmu
						</label>
						<textarea
							rows={3}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Apa tantangannya dan apa kontribusi spesifik yang kamu lakukan?"
							className={`${inputClass} resize-none`}
						/>
					</div>

					<div>
						<label className="text-xs font-bold text-neutral/70 mb-1.5 block">
							Dampak / Hasil Terukur
						</label>
						<textarea
							rows={2}
							value={impact}
							onChange={(e) => setImpact(e.target.value)}
							placeholder="Contoh: Waktu proses turun 40% dan kepuasan tim meningkat."
							className={`${inputClass} resize-none`}
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="text-xs font-bold text-neutral/70 mb-1.5 block">
								Tanggal (opsional)
							</label>
							<input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								className={inputClass}
							/>
						</div>

						<div>
							<label className="text-xs font-bold text-neutral/70 mb-1.5 block">
								Lampiran Gambar (opsional)
							</label>
							<input
								type="file"
								accept="image/*"
								onChange={(e) =>
									setAttachmentFile(e.target.files?.[0] ?? null)
								}
								className={`${inputClass} text-xs py-2.5 file:mr-2.5 file:cursor-pointer file:rounded-lg file:border-0 file:bg-sky-100 file:px-2.5 file:py-1 file:text-xs file:font-bold file:text-sky-800`}
							/>
							{attachmentFile && (
								<p className="text-[11px] text-neutral/60 mt-1 truncate">
									{attachmentFile.name}
								</p>
							)}
						</div>
					</div>

					{saveError && (
						<p className="text-xs text-rose-600 font-semibold">{saveError}</p>
					)}

					<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
						<SecondaryButton onClick={handleClose} disabled={saving}>
							Batal
						</SecondaryButton>
						<PrimaryButton
							tone="bukti-karier"
							icon={<PlusCircle size={15} />}
							disabled={!canSave || saving}
							onClick={() => void handleSave()}>
							{saving ? "Menyimpan..." : "Simpan Bukti"}
						</PrimaryButton>
					</div>
				</div>
			</Modal>
		);
	},
);

EvidenceForm.displayName = "EvidenceForm";

export default EvidenceForm;
