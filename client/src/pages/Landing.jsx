import { Button, Chip } from '@heroui/react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-10">
      
      {/* Barre de navigation */}
      <header className="mx-auto flex max-w-[85rem] items-center justify-between px-6 py-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-extrabold tracking-tight text-slate-900">EduFlow</span>
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Adapté à ton énergie
          </span>
        </div>

        {/* Faux menu central arrondi */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-full p-1 border border-slate-200">
          <span className="bg-slate-900 text-white px-5 py-1.5 rounded-full text-sm font-medium shadow-sm">
            Accueil
          </span>
          <span className="text-slate-600 px-5 py-1.5 rounded-full text-sm font-medium">
            Concept
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Se connecter
          </Link>
          <Button as={Link} to="/register" className="bg-slate-900 text-white font-bold rounded-full px-6 shadow-md">
            Créer un compte
          </Button>
        </div>
      </header>

      {/* La grande carte "Hero" (Style Bento) */}
      <main className="mx-auto max-w-[85rem] px-4 sm:px-6 mt-2">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-50 via-[#f0f7ff] to-[#e6f4f1] px-6 pt-16 pb-20 sm:px-16 sm:pt-24 lg:flex lg:items-center lg:justify-between lg:gap-10 border border-blue-100/50 lg:min-h-[480px]">
          
          {/* Contenu de gauche */}
          <div className="max-w-2xl lg:w-[55%] z-10 flex flex-col">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Chip variant="flat" className="bg-white text-slate-700 font-bold shadow-sm border border-slate-100 text-xs tracking-wide">
                Plateforme EduFlow
              </Chip>
              <Chip variant="flat" className="bg-white text-slate-400 font-bold shadow-sm border border-slate-100 text-xs tracking-wide uppercase">
                ✨ Projet ISEP 2026
              </Chip>
            </div>

            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem] leading-tight">
              La façon la plus sereine de gérer et faire ses devoirs.
            </h1>

            <p className="mb-6 text-base text-slate-600 sm:text-lg max-w-xl font-medium leading-relaxed">
              EduFlow combine un espace enfant adapté, des contrôles parents et la visibilité enseignants dans un espace de travail unique et bienveillant.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
               <Button as={Link} to="/register" size="lg" className="bg-edublue text-white font-bold rounded-full px-8 h-14 shadow-xl shadow-blue-500/20 w-full sm:w-auto text-base hover:scale-105 transition-transform">
                Commencer l'expérience
              </Button>
            </div>
          </div>

          {/* Le Mockup sombre de droite - CORRIGÉ ✅ */}
          <div className="relative mt-16 lg:mt-0 lg:w-[45%] flex items-end justify-center lg:justify-end lg:items-start">
            <div className="w-full max-w-[26rem] rounded-t-[2rem] bg-[#1a1c23] p-4 sm:p-6 text-white shadow-2xl relative translate-y-8 lg:translate-y-0 border-t border-l border-r border-slate-700/50 flex flex-col gap-4 lg:gap-5">
              
              {/* En-tête du dashboard sombre (Utilisation de flex-col et gap pour bloquer la superposition) */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Espace Enfant
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold tracking-tight text-white m-0 p-0 leading-none">Missions du jour</h3>
                  <Chip size="sm" className="bg-slate-800/80 text-green-400 border border-slate-700/50 font-bold">
                    En ligne
                  </Chip>
                </div>
              </div>

              {/* Les petites cartes statistiques */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 rounded-2xl bg-[#252830] p-5 border border-slate-700/50">
                  <span className="text-slate-400 text-xl">⚡</span>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold tracking-tight text-white">Faible</span>
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Énergie</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 rounded-2xl bg-[#252830] p-5 border border-slate-700/50">
                  <span className="text-slate-400 text-xl">🎯</span>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold tracking-tight text-white">Moyen</span>
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Concentration</span>
                  </div>
                </div>
              </div>
              
              {/* Bannière du bas */}
              <div className="flex justify-between items-center rounded-2xl bg-[#252830] p-5 border border-slate-700/50">
                 <div className="flex flex-col gap-1">
                   <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Algorithme Eduflow</span>
                   <span className="text-lg font-bold text-white">1 devoir prioritaire</span>
                 </div>
                 <div className="h-10 w-10 shrink-0 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                   <span className="text-slate-300">✓</span>
                 </div>
              </div>

            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}