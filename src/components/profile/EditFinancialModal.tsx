import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import { PrimaryButton, SecondaryButton } from "../ui/PrimaryButton";
import { financialData } from "../../data/dashboardDummyData";

interface EditModalProps {
	open: boolean;
	onClose: () => void;
}

export function EditFinancialModal({ open, onClose }: EditModalProps) {
	return (
		<Modal open={open} onClose={onClose} title="Edit Data Finansial">
			{financialData.parameters.map((item) => (
				<FormField key={item.id} label={item.label} defaultValue={item.value} />
			))}
			<div className="flex justify-end gap-2.5 mt-2">
				<SecondaryButton onClick={onClose}>Batal</SecondaryButton>
				<PrimaryButton onClick={onClose}>Simpan</PrimaryButton>
			</div>
		</Modal>
	);
}
