import PageHeader from "../layouts/PageHeader";
import { userProfile } from "../../data/dashboardDummyData";
import CareerHealthCard from "./CareerHealthCard";
import CareerSnapshotGrid from "./CareerSnapshotGrid";
import WeeklyFocusAndMission from "./WeeklyFocusAndMission";

export default function BerandaView() {
	return (
		<div>
			<PageHeader
				title={`Selamat datang kembali, ${userProfile.name}.`}
				subtitle="Berikut kondisi kariermu minggu ini."
			/>
			<CareerHealthCard />
			<CareerSnapshotGrid />
			<WeeklyFocusAndMission />
		</div>
	);
}
