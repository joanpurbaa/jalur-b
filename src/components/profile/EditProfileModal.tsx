import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import { PrimaryButton, SecondaryButton } from "../ui/PrimaryButton";
import { personalInfo } from "../../data/dashboardDummyData";

interface EditModalProps {
	open: boolean;
	onClose: () => void;
}

export function EditProfileModal({ open, onClose }: EditModalProps) {
	return (
		<Modal open={open} onClose={onClose} title="Edit Profil">
			<FormField label="Nama" defaultValue={personalInfo.name} />
			<FormField label="Role" defaultValue={personalInfo.role} />
			<FormField label="Email" defaultValue={personalInfo.email} />
			<FormField label="Username" defaultValue={personalInfo.username} />
			<div className="flex justify-end gap-2.5 mt-2">
				<SecondaryButton onClick={onClose}>Batal</SecondaryButton>
				<PrimaryButton onClick={onClose}>Simpan</PrimaryButton>
			</div>
		</Modal>
	);
}
