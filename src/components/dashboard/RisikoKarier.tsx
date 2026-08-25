import { User, Building2, Bot, TrendingDown, BrainCircuit } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import { riskData } from "../../data/dashboardDummyData";
import RiskStatusCard from "./RiskStatusCard";
import RiskDimensionCard from "./RiskDimensionCard";
import AIAnalysisPanel from "./AIAnalysisPanel";
import EarlyWarningCard from "./EarlyWarningCard";

const icons = [User, Building2, Bot, TrendingDown, BrainCircuit];

export default function RisikoKarier() {
	return (
		<div>
			<PageHeader
				title="Risiko Karier"
				subtitle="Pantau lanskap industri dan persiapkan dirimu menghadapi perubahan tren yang berpotensi memengaruhi peranmu saat ini."
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
				<div className="lg:col-span-2">
					<RiskStatusCard />
					<h3 className="text-sm font-bold text-neutral mb-3">Dimensi Risiko</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{riskData.dimensions.map((item, index) => (
							<RiskDimensionCard
								key={item.title}
								title={item.title}
								description={item.description}
								level={item.level}
								icon={icons[index]}
							/>
						))}
					</div>
				</div>

				<AIAnalysisPanel />
			</div>

			<EarlyWarningCard />
		</div>
	);
}
