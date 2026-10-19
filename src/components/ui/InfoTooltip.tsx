import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  text: string;
  className?: string;
}

export default function InfoTooltip({ text, className = "" }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <span ref={ref} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        aria-label={text}
        aria-describedby={open ? "info-tooltip-content" : undefined}
        aria-expanded={open}
        className="inline-flex items-center justify-center rounded-full p-0.5 hover:bg-neutral/10 transition focus:outline-none focus:ring-2 focus:ring-primary/30"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(!open)}>
        <Info size={12} className="text-neutral/40" />
      </button>
      {open && (
        <span
          id="info-tooltip-content"
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded-lg border border-neutral/10 bg-white px-3 py-2 text-left text-xs font-normal leading-relaxed text-neutral shadow-xl">
          {text}
        </span>
      )}
    </span>
  );
}
