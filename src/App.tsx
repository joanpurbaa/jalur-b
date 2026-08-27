import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import BerandaView from "./components/dashboard/BerandaView";
import KesehatanKarier from "./components/dashboard/KesehatanKarier";
import JalurKarier from "./components/dashboard/JalurKarier";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RisikoKarier from "./components/dashboard/RisikoKarier";
import BuktiKarier from "./components/dashboard/BuktiKarier";
import Finansial from "./components/dashboard/Finansial";
import Skill from "./components/dashboard/Skill";
import Simulasi from "./components/dashboard/Simulasi";
import Profil from "./components/dashboard/Profil";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Navigate to="/login" replace />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/onboarding" element={<Onboarding />} />

				<Route path="/dashboard" element={<Dashboard />}>
					<Route index element={<Navigate to="beranda" replace />} />
					<Route path="beranda" element={<BerandaView />} />
					<Route path="kesehatan-karier" element={<KesehatanKarier />} />
					<Route path="risiko-karier" element={<RisikoKarier />} />
					<Route path="skill" element={<Skill />} />
					<Route path="jalur-karier" element={<JalurKarier />} />
					<Route path="bukti-karier" element={<BuktiKarier />} />
					<Route path="finansial" element={<Finansial />} />
					<Route path="simulasi" element={<Simulasi />} />
					<Route path="profil" element={<Profil />} />
				</Route>
			</Routes>
		</Router>
	);
}
