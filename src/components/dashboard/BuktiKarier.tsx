import { useRef, useState } from "react";
import { PlusCircle } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import { evidenceCategories, evidenceItems } from "../../data/dashboardDummyData";
import { PrimaryButton } from "../ui/PrimaryButton";
import AIEvidenceAssistant from "./AIEvidenceAssistant";
import type {
	AIEvidenceAssistantHandle,
	EvidenceInput,
} from "./AIEvidenceAssistant";
import FilterTabs from "../ui/FilterTabs";
import EvidenceCard from "./EvidenceCard";

export default function BuktiKarier() {
	const [activeFilter, setActiveFilter] = useState("Semua");
	const [evidenceList, setEvidenceList] =
		useState<EvidenceInput[]>(evidenceItems);
	const assistantRef = useRef<AIEvidenceAssistantHandle>(null);

	const handleSave = (item: EvidenceInput) => {
		setEvidenceList((prev) => [item, ...prev]);
	};

	const filteredItems = evidenceList.filter(
		(item) => activeFilter === "Semua" || item.category === activeFilter,
	);

	return (
		<div>
			<PageHeader
				title="Bukti Karier"
				subtitle="Simpan pencapaianmu sekarang. Jangan tunggu sampai kamu membutuhkannya."
			/>

			<AIEvidenceAssistant ref={assistantRef} onSave={handleSave} />

			{evidenceList.length === 0 ? (
				<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-10 text-center">
					<h3 className="text-lg font-bold text-neutral">
						Belum ada bukti karier
					</h3>
					<p className="text-sm text-neutral/60 mt-2 max-w-md mx-auto leading-relaxed">
						Mulai simpan project, pencapaian, atau pengalaman pentingmu
						sekarang. Nanti kamu akan berterima kasih saat membutuhkannya.
					</p>
					<div className="mt-5 flex justify-center">
						<PrimaryButton
							icon={<PlusCircle size={14} />}
							onClick={() => assistantRef.current?.open()}>
							Tambah Bukti
						</PrimaryButton>
					</div>
				</div>
			) : (
				<>
					<FilterTabs
						options={evidenceCategories}
						active={activeFilter}
						onChange={setActiveFilter}
					/>

					{filteredItems.length === 0 ? (
						<p className="text-sm text-neutral/50">
							Tidak ada bukti pada kategori ini.
						</p>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
							{filteredItems.map((item) => (
								<EvidenceCard key={item.id} {...item} />
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
}
