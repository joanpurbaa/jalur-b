import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import { PrimaryButton, SecondaryButton } from "../ui/PrimaryButton";
import { careerInfo } from "../../data/dashboardDummyData";

interface EditModalProps {
	open: boolean;
	onClose: () => void;
}

export function EditCareerModal({ open, onClose }: EditModalProps) {
	return (
		<Modal open={open} onClose={onClose} title="Edit Data Karier">
			<FormField label="Jabatan" defaultValue={careerInfo.role} />
			<FormField label="Lama Bekerja" defaultValue={careerInfo.tenure} />
			<div className="flex justify-end gap-2.5 mt-2">
				<SecondaryButton onClick={onClose}>Batal</SecondaryButton>
				<PrimaryButton onClick={onClose}>Simpan</PrimaryButton>
			</div>
		</Modal>
	);
}
