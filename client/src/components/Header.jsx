import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const dashboardByRole = {
  child: '/child/dashboard',
  parent: '/parent/dashboard',
  teacher: '/teacher/dashboard',
};

const roleLabels = {
  child: 'Enfant',
  parent: 'Parent',
  teacher: 'Enseignant',
};

// Subtle role-specific dot in the pill. Sky for parent (trust),
// meadow for teacher (positive), warm ink dot for child (calm).
const roleDot = {
  child: 'var(--ink)',
  parent: 'var(--sky)',
  teacher: 'var(--meadow)',
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Effet de défilement pour activer le fond "verre dépoli" comme sur l'accueil
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate('/auth');
  }

  if (!user) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 inset-x-0 z-50 h-16 transition-all duration-500 border-b ${
        scrolled ? 'nav-frosted border-border/40' : 'bg-transparent border-transparent'
      }`}
    >
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6 lg:px-10">
        
        {/* Logo avec la typo d'accueil */}
        <Link className="font-display text-xl tracking-tight text-ink transition-transform hover:scale-105" to={dashboardByRole[user.role]}>
          EduFlow
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-5">

          {/* Name hidden on mobile to save room — pill stays always visible */}
          <span className="hidden text-[15px] font-medium text-ink sm:inline">
            {user.name}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-clay px-2.5 py-0.5 text-xs font-medium tracking-wide text-ink/75 uppercase">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: roleDot[user.role] }}
            />
            {roleLabels[user.role]}
          </span>

          <button
            onClick={handleLogout}
            className="btn-paper btn-ghost text-sm"
          >
            Déconnexion
          </button>

        </div>
      </div>
    </header>
  );
}