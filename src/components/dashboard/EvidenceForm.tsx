import {
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import {
	Award,
	BookOpen,
	FileText,
	FolderKanban,
	Medal,
	MessageSquareQuote,
	Plus,
	Trophy,
	type LucideIcon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "../ui/PrimaryButton";
import Modal from "../ui/Modal";
import { evidenceTypeLabels } from "../../lib/evidence";
import { profileApi } from "../../services/profile";
import type { EvidenceItemCreate, EvidenceType } from "../../types/evidence";

const inputClass =
	"w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 text-sm text-slate-900 placeholder:text-slate-400 transition";

const TYPE_ICONS: Record<EvidenceType, LucideIcon> = {
	project: FolderKanban,
	achievement: Trophy,
	feedback: MessageSquareQuote,
	certificate: Medal,
	award: Award,
	training: BookOpen,
	other: FileText,
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
						<label className="text-xs font-semibold text-slate-700 mb-2 block">
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
											className={`press min-h-[42px] flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-semibold transition cursor-pointer ${
												selected
													? "bg-indigo-50 border-indigo-600 text-indigo-800"
													: "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
											}`}>
											<Icon
												size={15}
												className={
													selected ? "text-indigo-600" : "text-slate-500"
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
						<label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							Judul Bukti <span className="text-rose-600">*</span>
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
						<label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							Cerita Singkat & Peranmu
						</label>
						<textarea
							rows={3}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Apa tantangannya dan kontribusi spesifik yang kamu lakukan?"
							className={`${inputClass} resize-none`}
						/>
					</div>

					<div>
						<label className="text-xs font-semibold text-slate-700 mb-1.5 block">
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
							<label className="text-xs font-semibold text-slate-700 mb-1.5 block">
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
							<label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								Lampiran Gambar (opsional)
							</label>
							<input
								type="file"
								accept="image/*"
								onChange={(e) =>
									setAttachmentFile(e.target.files?.[0] ?? null)
								}
								className={`${inputClass} text-xs py-2 file:mr-2.5 file:cursor-pointer file:rounded-lg file:border-0 file:bg-indigo-50 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-indigo-700`}
							/>
							{attachmentFile && (
								<p className="text-xs text-slate-500 mt-1 truncate">
									{attachmentFile.name}
								</p>
							)}
						</div>
					</div>

					{saveError && (
						<p className="text-xs text-rose-700 font-semibold">{saveError}</p>
					)}

					<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
						<SecondaryButton onClick={handleClose} disabled={saving}>
							Batal
						</SecondaryButton>
						<PrimaryButton
							icon={<Plus size={15} />}
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
