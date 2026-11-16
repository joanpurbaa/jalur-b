import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import IconTile from "../ui/IconTile";
import { MODULES, moduleFromPath, type ModuleId } from "../../lib/modules";

interface PageHeaderProps {
	title: string;
	subtitle: string;
	eyebrow?: string;
	action?: ReactNode;
	module?: ModuleId;
	icon?: LucideIcon;
}

export default function PageHeader({
	title,
	subtitle,
	eyebrow,
	action,
	module,
	icon,
}: PageHeaderProps) {
	const location = useLocation();
	const modId = module ?? moduleFromPath(location.pathname);
	const theme = MODULES[modId];
	const Icon = icon ?? theme.icon;

	return (
		<header
			className={`relative overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-r ${theme.headerWash} bg-white/75 backdrop-blur-md p-5 sm:p-6 mb-7 shadow-[0_8px_28px_-14px_rgba(30,27,75,0.12)]`}>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-start sm:items-center gap-4 min-w-0">
					<IconTile icon={Icon} tone={modId} size="lg" />
					<div className="min-w-0">
						<span
							className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.text}`}>
							{eyebrow ?? theme.label}
						</span>
						<h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral tracking-tight mt-0.5">
							{title}
						</h1>
						<p className="text-sm sm:text-[15px] text-neutral/65 mt-1 leading-relaxed">
							{subtitle}
						</p>
					</div>
				</div>
				{action && <div className="shrink-0 self-start sm:self-center">{action}</div>}
			</div>
		</header>
	);
}
