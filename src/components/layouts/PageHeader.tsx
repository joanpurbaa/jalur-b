interface PageHeaderProps {
	title: string;
	subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
	return (
		<div className="mb-8">
			<h1 className="text-2xl sm:text-3xl font-bold text-neutral">{title}</h1>
			<p className="text-sm text-neutral/60 mt-1">{subtitle}</p>
		</div>
	);
}
