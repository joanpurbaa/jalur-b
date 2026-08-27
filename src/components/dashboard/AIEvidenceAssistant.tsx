import {
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { PrimaryButton } from "../ui/PrimaryButton";

const evidenceTypes = [
	"project",
	"achievement",
	"feedback",
	"certificate",
	"award",
	"training",
	"other",
];

const inputClass =
	"w-full px-4 py-3 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-neutral placeholder:text-neutral/40";

export interface EvidenceInput {
	id: string;
	category: string;
	title: string;
	role: string;
	description: string;
	impactLabel: string;
	impactValue: string;
	date: string;
	aiGenerated: boolean;
}

export interface AIEvidenceAssistantHandle {
	open: () => void;
}

interface AIEvidenceAssistantProps {
	onSave: (item: EvidenceInput) => void;
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

// Mock "AI": deterministic restructure of the user's OWN words.
// It never invents metrics — impact stays "Dampak belum disebutkan."
// unless the user's story already states one.
// "2026-01-15" -> "15 Jan 2026" (matches EvidenceCard display)
function formatDate(value: string): string {
	if (!value) return "";
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"Mei",
		"Jun",
		"Jul",
		"Agu",
		"Sep",
		"Okt",
		"Nov",
		"Des",
	];
	const [year, month, day] = value.split("-");
	const idx = Number(month) - 1;
	if (Number.isNaN(idx) || idx < 0 || idx > 11) return value;
	return `${Number(day)} ${months[idx]} ${year}`;
}

function buildEvidence(story: string, role: string, impactInput: string) {
	const clean = story.trim().replace(/\s+/g, " ");
	const base = clean
		.split(" ")
		.slice(0, 6)
		.join(" ")
		.replace(/[.,]/g, "");
	const title = base
		? base.charAt(0).toUpperCase() + base.slice(1)
		: "Pencapaian Baru";

	// Only use the user-provided impact; never invent one from the story.
	const impact = impactInput.trim()
		? impactInput.trim()
		: "Dampak belum disebutkan.";

	return {
		title,
		role: role || "—",
		description: clean || "—",
		impact,
		date: "",
	};
}

type Generated = {
	title: string;
	role: string;
	description: string;
	impact: string;
	date: string;
};

const AIEvidenceAssistant = forwardRef<
	AIEvidenceAssistantHandle,
	AIEvidenceAssistantProps
>(({ onSave }, ref) => {
	const [step, setStep] = useState<"input" | "processing" | "review">("input");
	const [story, setStory] = useState("");
	const [evidenceType, setEvidenceType] = useState("");
	const [impactInput, setImpactInput] = useState("");
	const [attachmentName, setAttachmentName] = useState("");
	const [dateInput, setDateInput] = useState("");
	const [generated, setGenerated] = useState<Generated>({
		title: "",
		role: "",
		description: "",
		impact: "",
		date: "",
	});
	const [isEditing, setIsEditing] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useImperativeHandle(ref, () => ({
		open: () => {
			setStep("input");
			setIsEditing(false);
			textareaRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			setTimeout(() => textareaRef.current?.focus(), 50);
		},
	}));

	const canGenerate = story.trim().length > 0 && evidenceType !== "";

	const handleGenerate = () => {
		if (!canGenerate) return;
		setStep("processing");
		setTimeout(() => {
			const result = buildEvidence(
				story,
				getOnboardingRole(),
				impactInput,
			);
			result.date = dateInput;
			setGenerated(result);
			setIsEditing(false);
			setStep("review");
		}, 1200);
	};

	const updateGenerated = (key: keyof Generated, value: string) =>
		setGenerated((prev) => ({ ...prev, [key]: value }));

	const handleSave = () => {
		onSave({
			id:
				typeof crypto !== "undefined" && "randomUUID" in crypto
					? crypto.randomUUID()
					: String(Date.now()),
			category: evidenceType,
			title: generated.title,
			role: generated.role,
			description: generated.description,
			impactLabel: "Impact",
			impactValue: generated.impact,
			date: formatDate(generated.date) || "—",
			aiGenerated: true,
		});
		setStep("input");
		setStory("");
		setEvidenceType("");
		setImpactInput("");
		setAttachmentName("");
		setDateInput("");
		setIsEditing(false);
	};

	return (
		<div className="bg-primary/5 rounded-2xl border border-primary/20 border-l-4 border-l-primary shadow-sm p-6 mb-8 relative overflow-hidden">
			{step === "input" && (
				<>
					<div className="flex items-center gap-2 text-primary font-bold text-sm mb-5">
						<Sparkles size={16} />
						<span>AI Evidence Assistant</span>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
						<div>
							<label className="text-xs font-semibold text-neutral/70 mb-2 block">
								Ceritakan pencapaianmu dengan bahasamu sendiri
							</label>
							<textarea
								ref={textareaRef}
								rows={4}
								value={story}
								onChange={(e) => setStory(e.target.value)}
								placeholder="Contoh: Aku membantu tim membuat sistem baru yang membuat proses kerja lebih cepat..."
								className={`${inputClass} resize-none bg-white`}
							/>
						</div>

						<div className="flex flex-col gap-4">
							<div>
								<label className="text-xs font-semibold text-neutral/70 mb-2 block">
									Jenis Bukti
								</label>
								<select
									value={evidenceType}
									onChange={(e) => setEvidenceType(e.target.value)}
									className={inputClass}>
									<option value="" disabled>
										Pilih jenis bukti...
									</option>
									{evidenceTypes.map((type) => (
										<option key={type} value={type}>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="text-xs font-semibold text-neutral/70 mb-2 block">
									Lampiran (opsional)
								</label>
								<input
									type="file"
									onChange={(e) =>
										setAttachmentName(e.target.files?.[0]?.name ?? "")
									}
									className="w-full text-xs text-neutral/60 file:mr-3 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20"
								/>
								{attachmentName && (
									<p className="text-xs text-neutral/60 mt-1">
										File terpilih: {attachmentName}
									</p>
								)}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
						<div>
							<label className="text-xs font-semibold text-neutral/70 mb-2 block">
								Dampak (opsional)
							</label>
							<textarea
								rows={3}
								value={impactInput}
								onChange={(e) => setImpactInput(e.target.value)}
								placeholder="Contoh: Campaign menghasilkan peningkatan engagement sebesar 45%."
								className={`${inputClass} resize-none bg-white`}
							/>
						</div>
						<div>
							<label className="text-xs font-semibold text-neutral/70 mb-2 block">
								Tanggal (opsional)
							</label>
							<input
								type="date"
								value={dateInput}
								onChange={(e) => setDateInput(e.target.value)}
								className={`${inputClass} text-neutral/60`}
							/>
						</div>
					</div>

					<div className="flex items-center justify-end mt-4">
						<PrimaryButton
							icon={<Sparkles size={14} />}
							disabled={!canGenerate}
							onClick={handleGenerate}>
							Bantu Susun dengan AI →
						</PrimaryButton>
					</div>
				</>
			)}

			{step === "processing" && (
				<div className="flex flex-col items-center justify-center py-10 gap-4">
					<Loader2 size={28} className="text-primary animate-spin" />
					<p className="text-sm text-neutral/60">
						Jalur B sedang menyusun bukti kariermu...
					</p>
				</div>
			)}

			{step === "review" && (
				<>
					<div className="flex items-center gap-2 text-primary font-bold text-sm mb-5">
						<Sparkles size={16} />
						<span>Hasil Transformasi</span>
					</div>

					{!isEditing ? (
						<div className="space-y-4">
							<div>
								<p className="text-[11px] text-neutral/50 font-medium mb-1">
									Judul
								</p>
								<p className="text-base font-bold text-neutral">
									{generated.title}
								</p>
							</div>
							<div>
								<p className="text-[11px] text-neutral/50 font-medium mb-1">
									Role
								</p>
								<p className="text-sm font-semibold text-primary">
									{generated.role}
								</p>
							</div>
							<div>
								<p className="text-[11px] text-neutral/50 font-medium mb-1">
									Apa yang dilakukan
								</p>
								<p className="text-sm text-neutral/60 leading-relaxed">
									{generated.description}
								</p>
							</div>
							<div className="bg-neutral/5 rounded-xl p-4">
								<p className="text-[11px] text-neutral/50 font-medium mb-1">
									Dampak
								</p>
								<p className="text-sm font-bold text-neutral">
									{generated.impact}
								</p>
							</div>
							{generated.date && (
								<div>
									<p className="text-[11px] text-neutral/50 font-medium mb-1">
										Tanggal
									</p>
									<p className="text-sm text-neutral/60">
										{formatDate(generated.date)}
									</p>
								</div>
							)}
							{attachmentName && (
								<div>
									<p className="text-[11px] text-neutral/50 font-medium mb-1">
										Lampiran
									</p>
									<p className="text-sm text-neutral/60">{attachmentName}</p>
								</div>
							)}
						</div>
					) : (
						<div className="space-y-4">
							<div>
								<label className="text-[11px] text-neutral/50 font-medium mb-1 block">
									Judul
								</label>
								<input
									type="text"
									value={generated.title}
									onChange={(e) => updateGenerated("title", e.target.value)}
									className={inputClass}
								/>
							</div>
							<div>
								<label className="text-[11px] text-neutral/50 font-medium mb-1 block">
									Role
								</label>
								<input
									type="text"
									value={generated.role}
									onChange={(e) => updateGenerated("role", e.target.value)}
									className={inputClass}
								/>
							</div>
							<div>
								<label className="text-[11px] text-neutral/50 font-medium mb-1 block">
									Apa yang dilakukan
								</label>
								<textarea
									rows={3}
									value={generated.description}
									onChange={(e) =>
										updateGenerated("description", e.target.value)
									}
									className={`${inputClass} resize-none`}
								/>
							</div>
							<div>
								<label className="text-[11px] text-neutral/50 font-medium mb-1 block">
									Dampak
								</label>
								<textarea
									rows={2}
									value={generated.impact}
									onChange={(e) => updateGenerated("impact", e.target.value)}
									className={`${inputClass} resize-none`}
								/>
							</div>
							<div>
								<label className="text-[11px] text-neutral/50 font-medium mb-1 block">
									Tanggal (opsional)
								</label>
								<input
									type="date"
									value={generated.date}
									onChange={(e) => updateGenerated("date", e.target.value)}
									className={`${inputClass} text-neutral/60`}
								/>
							</div>
							<div>
								<label className="text-[11px] text-neutral/50 font-medium mb-1 block">
									Lampiran (opsional)
								</label>
								<input
									type="file"
									onChange={(e) =>
										setAttachmentName(e.target.files?.[0]?.name ?? "")
									}
									className="w-full text-xs text-neutral/60 file:mr-3 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20"
								/>
								{attachmentName && (
									<p className="text-xs text-neutral/60 mt-1">
										File terpilih: {attachmentName}
									</p>
								)}
							</div>
						</div>
					)}

					<div className="flex items-center justify-end gap-4 mt-5">
						<button
							type="button"
							onClick={() => setIsEditing(!isEditing)}
							className="text-xs font-semibold text-primary hover:opacity-70 transition">
							{isEditing ? "Lihat Hasil" : "Edit Manual"}
						</button>
						<PrimaryButton onClick={handleSave}>Simpan Bukti</PrimaryButton>
					</div>
				</>
			)}
		</div>
	);
});

AIEvidenceAssistant.displayName = "AIEvidenceAssistant";

export default AIEvidenceAssistant;
