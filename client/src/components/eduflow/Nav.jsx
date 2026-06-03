import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-16 transition-all duration-500 ${
        scrolled ? 'nav-frosted' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl h-full px-6 lg:px-10 flex items-center justify-between">
        <a href="#top" className="font-display text-xl tracking-tight text-ink">
          EduFlow
        </a>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="hidden sm:inline-flex btn-paper btn-ghost !py-2 !px-4 text-sm">
            Log in
          </Link>
          <Link to="/register" className="btn-paper btn-primary !py-2.5 !px-5 text-sm">
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
