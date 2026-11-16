interface FilterTabsProps {
	options: string[];
	active: string;
	onChange: (value: string) => void;
	counts?: Record<string, number>;
}

export default function FilterTabs({
	options,
	active,
	onChange,
	counts,
}: FilterTabsProps) {
	return (
		<div
			role="tablist"
			aria-label="Filter jenis bukti karier"
			className="flex flex-wrap gap-2 mb-6">
			{options.map((option) => {
				const isActive = active === option;
				const count = counts?.[option];

				return (
					<button
						key={option}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onChange(option)}
						className={`press min-h-[38px] inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
							isActive
								? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
								: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
						}`}>
						<span>{option}</span>
						{count != null && (
							<span
								className={`px-1.5 py-0.5 rounded-md text-[11px] font-semibold tabular ${
									isActive
										? "bg-white/20 text-white"
										: "bg-slate-100 text-slate-600"
								}`}>
								{count}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
}
