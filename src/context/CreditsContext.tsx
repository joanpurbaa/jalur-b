import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import CreditUnlockModal from "../components/ui/CreditUnlockModal";
import {
	CREDIT_FEATURES,
	type CreditFeatureId,
	type CreditFeatureMeta,
	type EmploymentStatus,
} from "../lib/credits";

interface StoredCreditsState {
	balance: number;
	unlocked: CreditFeatureId[];
	trialGranted: boolean;
	trialExpiresAt: string | null;
	trialBannerDismissed: boolean;
}

const CREDITS_STORAGE_KEY = "jalurB_credits_v2";
const EMPLOYMENT_STATUS_KEY = "jalurB_employment_status_v1";

const DEFAULT_CREDITS_STATE: StoredCreditsState = {
	balance: 0,
	unlocked: [],
	trialGranted: false,
	trialExpiresAt: null,
	trialBannerDismissed: false,
};

function readCreditsState(): StoredCreditsState {
	try {
		const raw = localStorage.getItem(CREDITS_STORAGE_KEY);
		if (!raw) return DEFAULT_CREDITS_STATE;
		const parsed = JSON.parse(raw) as Partial<StoredCreditsState>;
		return {
			balance: typeof parsed.balance === "number" ? Math.max(0, parsed.balance) : 0,
			unlocked: Array.isArray(parsed.unlocked) ? parsed.unlocked : [],
			trialGranted: Boolean(parsed.trialGranted),
			trialExpiresAt:
				typeof parsed.trialExpiresAt === "string" ? parsed.trialExpiresAt : null,
			trialBannerDismissed: Boolean(parsed.trialBannerDismissed),
		};
	} catch {
		return DEFAULT_CREDITS_STATE;
	}
}

function readEmploymentStatus(): EmploymentStatus {
	try {
		const raw = localStorage.getItem(EMPLOYMENT_STATUS_KEY);
		if (raw === "working" || raw === "stopped" || raw === "never_worked") {
			return raw;
		}
		return "working";
	} catch {
		return "working";
	}
}

interface UnlockPromptState {
	feature: CreditFeatureMeta;
	onUnlocked?: () => void;
}

interface CreditsContextValue {
	balance: number;
	unlockedCount: number;
	trialGranted: boolean;
	trialExpiresAt: string | null;
	trialBannerDismissed: boolean;
	isUnlocked: (featureId: CreditFeatureId) => boolean;
	requestUnlock: (featureId: CreditFeatureId, onUnlocked?: () => void) => void;
	grantFirstSimulationTrial: () => boolean;
	dismissTrialBanner: () => void;
	addMockCredits: (amount: number) => void;
	resetCreditsDemo: () => void;
	activateTrialDemo: () => void;
	relockAllFeatures: () => void;
	employmentStatus: EmploymentStatus;
	setEmploymentStatus: (status: EmploymentStatus) => void;
}

const CreditsContext = createContext<CreditsContextValue | null>(null);

export function CreditsProvider({ children }: { children: ReactNode }) {
	const navigate = useNavigate();
	const [state, setState] = useState<StoredCreditsState>(readCreditsState);
	const [employmentStatus, setEmploymentStatusState] =
		useState<EmploymentStatus>(readEmploymentStatus);
	const [prompt, setPrompt] = useState<UnlockPromptState | null>(null);

	useEffect(() => {
		try {
			localStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(state));
		} catch {
			// abaikan bila storage tidak tersedia
		}
	}, [state]);

	const setEmploymentStatus = useCallback((status: EmploymentStatus) => {
		setEmploymentStatusState(status);
		try {
			localStorage.setItem(EMPLOYMENT_STATUS_KEY, status);
		} catch {
			// abaikan
		}
	}, []);

	const isUnlocked = useCallback(
		(featureId: CreditFeatureId) => state.unlocked.includes(featureId),
		[state.unlocked],
	);

	const requestUnlock = useCallback(
		(featureId: CreditFeatureId, onUnlocked?: () => void) => {
			if (state.unlocked.includes(featureId)) {
				onUnlocked?.();
				return;
			}
			setPrompt({
				feature: CREDIT_FEATURES[featureId],
				onUnlocked,
			});
		},
		[state.unlocked],
	);

	const handleConfirmSpend = useCallback(() => {
		if (!prompt) return;
		const { feature, onUnlocked } = prompt;
		if (state.balance < feature.cost) return;

		setState((prev) => {
			if (prev.balance < feature.cost) return prev;
			const nextUnlocked = prev.unlocked.includes(feature.id)
				? prev.unlocked
				: [...prev.unlocked, feature.id];
			return {
				...prev,
				balance: prev.balance - feature.cost,
				unlocked: nextUnlocked,
			};
		});
		setPrompt(null);
		onUnlocked?.();
	}, [prompt, state.balance]);

	const handleBuyPack = useCallback(() => {
		setPrompt(null);
		navigate("/harga");
	}, [navigate]);

	const grantFirstSimulationTrial = useCallback((): boolean => {
		let grantedNow = false;
		setState((prev) => {
			if (prev.trialGranted) return prev;
			grantedNow = true;
			const expires = new Date();
			expires.setDate(expires.getDate() + 14);
			return {
				...prev,
				balance: prev.balance + 6,
				trialGranted: true,
				trialExpiresAt: expires.toISOString(),
				trialBannerDismissed: false,
			};
		});
		return grantedNow;
	}, []);

	const dismissTrialBanner = useCallback(() => {
		setState((prev) => ({
			...prev,
			trialBannerDismissed: true,
		}));
	}, []);

	const addMockCredits = useCallback((amount: number) => {
		if (amount <= 0) return;
		setState((prev) => ({
			...prev,
			balance: prev.balance + amount,
		}));
	}, []);

	const resetCreditsDemo = useCallback(() => {
		setState(DEFAULT_CREDITS_STATE);
	}, []);

	const activateTrialDemo = useCallback(() => {
		const expires = new Date();
		expires.setDate(expires.getDate() + 14);
		setState({
			balance: 6,
			unlocked: [],
			trialGranted: true,
			trialExpiresAt: expires.toISOString(),
			trialBannerDismissed: false,
		});
	}, []);

	const relockAllFeatures = useCallback(() => {
		setState((prev) => ({
			...prev,
			unlocked: [],
		}));
	}, []);

	const value = useMemo<CreditsContextValue>(
		() => ({
			balance: state.balance,
			unlockedCount: state.unlocked.length,
			trialGranted: state.trialGranted,
			trialExpiresAt: state.trialExpiresAt,
			trialBannerDismissed: state.trialBannerDismissed,
			isUnlocked,
			requestUnlock,
			grantFirstSimulationTrial,
			dismissTrialBanner,
			addMockCredits,
			resetCreditsDemo,
			activateTrialDemo,
			relockAllFeatures,
			employmentStatus,
			setEmploymentStatus,
		}),
		[
			state.balance,
			state.unlocked.length,
			state.trialGranted,
			state.trialExpiresAt,
			state.trialBannerDismissed,
			isUnlocked,
			requestUnlock,
			grantFirstSimulationTrial,
			dismissTrialBanner,
			addMockCredits,
			resetCreditsDemo,
			activateTrialDemo,
			relockAllFeatures,
			employmentStatus,
			setEmploymentStatus,
		],
	);

	return (
		<CreditsContext.Provider value={value}>
			{children}
			<CreditUnlockModal
				open={Boolean(prompt)}
				feature={prompt?.feature ?? null}
				balance={state.balance}
				trialGranted={state.trialGranted}
				onClose={() => setPrompt(null)}
				onConfirm={handleConfirmSpend}
				onBuyPack={handleBuyPack}
			/>
		</CreditsContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCredits(): CreditsContextValue {
	const ctx = useContext(CreditsContext);
	if (!ctx) {
		throw new Error("useCredits harus dipakai di dalam CreditsProvider");
	}
	return ctx;
}
