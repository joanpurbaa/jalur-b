import { Outlet } from "react-router-dom";
import Sidebar from "../components/layouts/Sidebar";

export default function Dashboard() {
	return (
		<div className="min-h-screen bg-[#F9F9FB] flex font-sans">
			<Sidebar />

			<main className="flex-1 p-6 sm:p-10 overflow-y-auto">
				{/* <Header /> */}
				<Outlet />
			</main>
		</div>
	);
}
