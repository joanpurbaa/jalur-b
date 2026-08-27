import {
	User,
	BarChart3,
	TrendingUp,
} from "lucide-react";
import { careerPathData } from "../../data/dashboardDummyData";
import CareerPathNode from "./CareerPathNode";

const roleIcons: Record<string, typeof BarChart3> = {
	"senior-software-engineer": TrendingUp,
	"fullstack-developer": BarChart3,
};

export default function CareerPathMap() {
	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-8 relative h-[480px] overflow-hidden">
			<svg
				className="absolute inset-0 w-full h-full"
				viewBox="0 0 100 100"
				preserveAspectRatio="none">
				{careerPathData.alternativeRoles.map((role) => {
					const isSelected = role.id === careerPathData.selectedRoleId;
					return (
						<line
							key={role.id}
							x1={50}
							y1={50}
							x2={role.position.left}
							y2={role.position.top}
							stroke={isSelected ? "#4F46E5" : "#D4D4D8"}
							strokeWidth={isSelected ? 0.35 : 0.25}
							strokeDasharray={isSelected ? undefined : "1.2 1.2"}
							vectorEffect="non-scaling-stroke"
						/>
					);
				})}
			</svg>

			<CareerPathNode
				variant="center"
				icon={User}
				title={careerPathData.currentRole.title}
				subtitle={careerPathData.currentRole.subtitle}
				style={{ top: "50%", left: "50%" }}
			/>

			{careerPathData.alternativeRoles.map((role) => (
				<CareerPathNode
					key={role.id}
					icon={roleIcons[role.id]}
					title={role.title}
					match={role.match}
					selected={role.id === careerPathData.selectedRoleId}
					style={{ top: `${role.position.top}%`, left: `${role.position.left}%` }}
				/>
			))}
		</div>
	);
}
