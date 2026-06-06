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
        
        <div className="flex items-center gap-4 sm:gap-5">
          
          {/* Infos de l'utilisateur (cachées sur très petits écrans) */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-[15px] font-medium text-ink">{user.name}</span>
            <span className="rounded-full border border-border/60 bg-clay px-2.5 py-0.5 text-xs font-medium tracking-wide text-ink/75 uppercase">
              {roleLabels[user.role]}
            </span>
          </div>
          
          {/* Bouton de déconnexion stylé comme les boutons de l'accueil */}
          <button 
            onClick={handleLogout} 
            className="btn-paper btn-ghost !py-2 !px-4 text-sm"
          >
            Déconnexion
          </button>
          
        </div>
      </div>
    </header>
  );
}