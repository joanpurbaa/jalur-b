import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SCROLL_THRESHOLD = 24;

export default function Navbar() {
	const navigate = useNavigate();
	const [scrolled, setScrolled] = useState(() =>
		typeof window !== "undefined" ? window.scrollY > SCROLL_THRESHOLD : false,
	);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header className="fixed inset-x-0 top-0 z-50">
			<div
				className={`mx-auto flex items-center justify-between transition-all duration-300 ease-in-out ${
					scrolled
						? "mt-3 w-[94%] max-w-6xl rounded-full border border-neutral/10 bg-white px-4 py-3 shadow-md backdrop-blur-2xl sm:w-[92%] sm:px-8 sm:py-4"
						: "w-full max-w-7xl rounded-none border-neutral/5 bg-white px-4 py-5 shadow-none sm:px-6 lg:px-10"
				}`}>
				<Link to="/" className="flex items-center gap-2">
					<img
						src="/icon.png"
						alt=""
						className="h-8 w-8 shrink-0 object-contain"
					/>
					<h1 className="text-lg font-extrabold text-primary">Jalur B</h1>
				</Link>

				<nav className="flex items-center gap-3 sm:gap-5 lg:gap-7">
					<a
						href="#masalah"
						className="hidden lg:inline text-sm font-normal text-neutral/70 transition hover:text-primary">
						Masalah
					</a>
					<a
						href="#solusi"
						className="hidden md:inline text-sm font-normal text-neutral/70 transition hover:text-primary">
						Solusi
					</a>
					<a
						href="#cara-kerja"
						className="hidden md:inline text-sm font-normal text-neutral/70 transition hover:text-primary">
						Cara kerja
					</a>
					<a
						href="#perusahaan"
						className="hidden lg:inline text-sm font-normal text-neutral/70 transition hover:text-primary">
						Perusahaan
					</a>
					<Link
						to="/harga"
						className="hidden sm:inline text-sm font-normal text-neutral/70 transition hover:text-primary">
						Harga
					</Link>
					<Link
						to="/login"
						className="text-xs sm:text-sm font-semibold text-neutral/80 transition hover:text-primary px-2 py-1.5">
						Masuk
					</Link>
					<button
						type="button"
						onClick={() => navigate("/register")}
						className="press inline-flex items-center gap-1.5 bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition rounded-xl hover:opacity-90 shrink-0 cursor-pointer">
						<span>Mulai sekarang</span>
						<ArrowRight size={13} />
					</button>
				</nav>
			</div>
		</header>
	);
}
