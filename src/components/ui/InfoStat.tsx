interface InfoStatProps {
	label: string;
	value: string;
	tone?: "default" | "risk";
	badge?: React.ReactNode;
}

export default function InfoStat({
	label,
	value,
	tone = "default",
	badge,
}: InfoStatProps) {
	return (
		<div>
			<p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
			<div className="flex items-center gap-2 flex-wrap">
				<p
					className={`text-sm sm:text-base font-bold ${
						tone === "risk" ? "text-rose-700" : "text-slate-900"
					}`}>
					{value}
				</p>
				{badge}
			</div>
		</div>
	);
}
