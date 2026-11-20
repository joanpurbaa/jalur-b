import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	subtitle?: string;
	children: ReactNode;
	variant?: "modal" | "drawer";
	maxWidth?: string;
}

export default function Modal({
	open,
	onClose,
	title,
	subtitle,
	children,
	variant = "modal",
	maxWidth = "max-w-lg",
}: ModalProps) {
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;

	const content =
		variant === "drawer" ? (
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				className="fixed inset-0 z-[100] flex justify-end">
				<div
					className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs"
					onClick={onClose}
				/>
				<div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden">
					<div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-slate-100 shrink-0">
						<div>
							<h3 className="text-lg font-bold text-slate-900">{title}</h3>
							{subtitle && (
								<p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
							)}
						</div>
						<button
							type="button"
							onClick={onClose}
							aria-label="Tutup dialog"
							className="min-w-[40px] min-h-[40px] p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer flex items-center justify-center">
							<X size={18} />
						</button>
					</div>
					<div className="flex-1 overflow-y-auto p-6">{children}</div>
				</div>
			</div>
		) : (
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				className="fixed inset-0 z-[100] flex items-center justify-center p-4">
				<div
					className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs"
					onClick={onClose}
				/>
				<div
					className={`relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden`}>
					<div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
						<div>
							<h3 className="text-lg font-bold text-slate-900">{title}</h3>
							{subtitle && (
								<p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
							)}
						</div>
						<button
							type="button"
							onClick={onClose}
							aria-label="Tutup dialog"
							className="min-w-[40px] min-h-[40px] p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer flex items-center justify-center">
							<X size={18} />
						</button>
					</div>
					<div className="overflow-y-auto p-6">{children}</div>
				</div>
			</div>
		);

	if (typeof document === "undefined") return content;
	return createPortal(content, document.body);
}
