import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import CareerAssessmentModal from "../components/dashboard/CareerAssessmentModal";
import { careerHealthApi } from "../services/careerHealth";
import { useCredits } from "./CreditsContext";

interface CareerAssessmentContextValue {
	openCareerAssessment: () => void;
	refreshKey: number;
	hasExistingAssessment: boolean;
}

const CareerAssessmentContext =
	createContext<CareerAssessmentContextValue | null>(null);

export function CareerAssessmentProvider({ children }: { children: ReactNode }) {
	const { isUnlocked, requestUnlock } = useCredits();
	const [isOpen, setIsOpen] = useState(false);
	const [openCount, setOpenCount] = useState(0);
	const [refreshKey, setRefreshKey] = useState(0);
	const [hasExistingAssessment, setHasExistingAssessment] = useState(false);

	useEffect(() => {
		let active = true;
		careerHealthApi
			.latest()
			.then((res) => {
				if (active && res) setHasExistingAssessment(true);
			})
			.catch(() => {
				if (active) setHasExistingAssessment(false);
			});
		return () => {
			active = false;
		};
	}, [refreshKey]);

	const openCareerAssessment = useCallback(() => {
		const openNow = () => {
			setOpenCount((c) => c + 1);
			setIsOpen(true);
		};
		// 1 assessment dasar per bulan gratis; analisis ulang memakai 2 credit
		if (hasExistingAssessment && !isUnlocked("re_assessment")) {
			requestUnlock("re_assessment", openNow);
			return;
		}
		openNow();
	}, [hasExistingAssessment, isUnlocked, requestUnlock]);

	const handleSaved = useCallback(() => {
		setHasExistingAssessment(true);
		setRefreshKey((k) => k + 1);
		setIsOpen(false);
	}, []);

	return (
		<CareerAssessmentContext.Provider
			value={{ openCareerAssessment, refreshKey, hasExistingAssessment }}>
			{children}
			<CareerAssessmentModal
				key={openCount}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onSaved={handleSaved}
			/>
		</CareerAssessmentContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCareerAssessment(): CareerAssessmentContextValue {
	const ctx = useContext(CareerAssessmentContext);
	if (!ctx) {
		throw new Error(
			"useCareerAssessment harus dipakai di dalam CareerAssessmentProvider",
		);
	}
	return ctx;
}