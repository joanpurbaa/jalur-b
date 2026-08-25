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
import Login from "./pages/Login";
import Register from "./pages/Register";
import RisikoKarier from "./components/dashboard/RisikoKarier";

export default function App() {
	return (
		<Router>
			<Routes>
				{/* <Route path="/" element={<Navigate to="/onboarding" replace />} /> */}
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/onboarding" element={<Onboarding />} />

				<Route path="/dashboard" element={<Dashboard />}>
					<Route index element={<Navigate to="beranda" replace />} />
					<Route path="beranda" element={<BerandaView />} />
					<Route path="kesehatan-karier" element={<KesehatanKarier />} />
					<Route path="risiko-karier" element={<RisikoKarier />} />
				</Route>
			</Routes>
		</Router>
	);
}
