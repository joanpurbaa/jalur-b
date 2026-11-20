import { Suspense, lazy } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { MotionConfig } from "motion/react";
import RequireAuth from "./components/auth/RequireAuth";
import GuestOnly from "./components/auth/GuestOnly";
import OnboardingRoute from "./components/auth/OnboardingRoute";
import { AuthProvider } from "./context/AuthContext";
import { CreditsProvider } from "./context/CreditsContext";
import { SkeletonHero, SkeletonStatCard } from "./components/ui/Skeleton";

const Home = lazy(() => import("./pages/Home"));
const Harga = lazy(() => import("./pages/Harga"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const GoogleCallback = lazy(() => import("./pages/GoogleCallback"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const BerandaView = lazy(() => import("./components/dashboard/BerandaView"));
const KesehatanKarier = lazy(
	() => import("./components/dashboard/KesehatanKarier"),
);
const RisikoKarier = lazy(() => import("./components/dashboard/RisikoKarier"));
const Skill = lazy(() => import("./components/dashboard/Skill"));
const JalurKarier = lazy(() => import("./components/dashboard/JalurKarier"));
const BuktiKarier = lazy(() => import("./components/dashboard/BuktiKarier"));
const Finansial = lazy(() => import("./components/dashboard/Finansial"));
const Simulasi = lazy(() => import("./components/dashboard/Simulasi"));
const Profil = lazy(() => import("./components/dashboard/Profil"));

function RouteFallback() {
	return (
		<div className="min-h-[60vh] p-6 sm:p-10 max-w-6xl mx-auto space-y-6">
			<SkeletonHero />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<SkeletonStatCard />
				<SkeletonStatCard />
				<SkeletonStatCard />
				<SkeletonStatCard />
			</div>
		</div>
	);
}

export default function App() {
	return (
		<MotionConfig reducedMotion="user">
			<Router>
				<AuthProvider>
					<CreditsProvider>
						<Suspense fallback={<RouteFallback />}>
							<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/harga" element={<Harga />} />
								<Route
									path="/login"
								element={
									<GuestOnly>
										<Login />
									</GuestOnly>
								}
							/>
							<Route
								path="/register"
								element={
									<GuestOnly>
										<Register />
									</GuestOnly>
								}
							/>
							<Route path="/auth/callback" element={<GoogleCallback />} />
							<Route
								path="/onboarding"
								element={
									<OnboardingRoute>
										<Onboarding />
									</OnboardingRoute>
								}
							/>

							<Route
								path="/dashboard"
								element={
									<RequireAuth>
										<Dashboard />
									</RequireAuth>
								}>
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
						</Suspense>
					</CreditsProvider>
				</AuthProvider>
			</Router>
		</MotionConfig>
	);
}
