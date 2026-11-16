import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { ModuleId } from "../../lib/modules";

interface PageHeaderProps {
	title: string;
	subtitle: string;
	eyebrow?: string;
	action?: ReactNode;
	module?: ModuleId;
	icon?: LucideIcon;
}

/**
 * Header halaman langsung di atas background netral: judul, subjudul
 * maksimal 1 baris di desktop, dan aksi halaman opsional di kanan.
 */
export default function PageHeader({
	title,
	subtitle,
	eyebrow,
	action,
}: PageHeaderProps) {
	return (
		<header className="mb-6 sm:mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div className="min-w-0">
				{eyebrow && (
					<p className="text-xs font-medium text-slate-500 mb-1 truncate">
						{eyebrow}
					</p>
				)}
				<h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-tight">
					{title}
				</h1>
				<p className="text-sm text-slate-600 mt-1 lg:truncate">
					{subtitle}
				</p>
			</div>
			{action && <div className="shrink-0 self-start sm:self-center">{action}</div>}
		</header>
	);
}
