interface SkeletonProps {
	className?: string;
}

/** Skeleton dengan kilau halus (shimmer). */
export default function Skeleton({ className = "" }: SkeletonProps) {
	return (
		<div
			aria-hidden
			className={`relative overflow-hidden bg-slate-900/[0.06] rounded-lg ${className}`}>
			<div className="absolute inset-0 -translate-x-full motion-safe:animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
		</div>
	);
}

export function SkeletonText({
	width = "w-full",
	className = "",
}: { width?: string; className?: string }) {
	return <Skeleton className={`h-3.5 ${width} ${className}`} />;
}

export function SkeletonCircle({ size = "w-9 h-9" }: { size?: string }) {
	return <Skeleton className={`${size} rounded-full`} />;
}

export function SkeletonButton({ className = "" }: SkeletonProps) {
	return <Skeleton className={`h-10 w-36 rounded-full ${className}`} />;
}

/** Skeleton kartu statistik: tile + label + angka. */
export function SkeletonStatCard({ className = "" }: SkeletonProps) {
	return (
		<div className={`card-3d p-5 ${className}`} aria-busy="true" aria-label="Memuat">
			<div className="flex items-center gap-3">
				<Skeleton className="h-11 w-11 rounded-[14px]" />
				<Skeleton className="h-3.5 w-24" />
			</div>
			<Skeleton className="mt-5 h-8 w-28" />
			<Skeleton className="mt-3 h-2.5 w-full rounded-full" />
		</div>
	);
}

/** Skeleton hero: ring + teks. */
export function SkeletonHero({ className = "" }: SkeletonProps) {
	return (
		<div
			className={`card-3d p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 ${className}`}
			aria-busy="true"
			aria-label="Memuat">
			<Skeleton className="h-40 w-40 rounded-full" />
			<div className="flex-1 w-full space-y-3">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-7 w-3/4" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-2/3" />
			</div>
		</div>
	);
}
