import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateHomework() {
  const navigate = useNavigate();
  
  // Simule la liste des élèves assignés (à remplacer par l'API)
  const myStudents = [
    { id: 1, name: 'Léo Martin' },
    { id: 2, name: 'Emma Dubois' },
    { id: 3, name: 'Hugo Leroy' },
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    estimatedMinutes: '',
    difficulty: 'medium',
    priority: '2',
    childId: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Devoir à envoyer au backend :', formData);
    // Ici on appellera : fetch('/api/teacher/homework', { method: 'POST', body: JSON.stringify(formData) })
    alert("Le devoir a été créé avec succès ! Ses sous-tâches seront générées automatiquement.");
    navigate('/teacher/dashboard');
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[var(--sky)] selection:text-white" style={{ background: 'var(--linen)' }}>
      
      {/* Bouton de retour en haut à gauche pour l'ergonomie */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6">
        <button 
          onClick={() => navigate('/teacher/dashboard')}
          className="text-sm font-medium text-muted-foreground hover:text-ink transition-colors flex items-center gap-2"
        >
          <span>←</span> Retour au tableau de bord
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        
        {/* Titre de la page */}
        <div className="mb-10 animate-rise">
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-[1.1]">
            Créer un <em className="not-italic" style={{ color: 'var(--meadow)' }}>nouveau devoir.</em>
          </h1>
          <p className="mt-3 text-[16px] text-muted-foreground max-w-2xl">
            Définis l'objectif global. EduFlow se chargera de l'adapter au rythme de l'élève.
          </p>
        </div>

        <div className="paper-card animate-rise" style={{ animationDelay: '100ms' }}>
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
            
            {/* Ligne 1 : Titre et Élève */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Titre du devoir *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Exercices de fractions"
                  className="w-full h-12 px-4 bg-white/60 border border-border/40 rounded-xl focus:outline-none focus:border-border text-ink placeholder:text-muted-foreground shadow-sm transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Assigner à *</label>
                <select
                  name="childId"
                  required
                  value={formData.childId}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-white/60 border border-border/40 rounded-xl focus:outline-none focus:border-border text-ink shadow-sm transition-colors cursor-pointer"
                >
                  <option value="" disabled className="text-muted-foreground">Sélectionner un élève...</option>
                  {myStudents.map(student => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ligne 2 : Matière et Date limite */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Matière *</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Ex: Mathématiques"
                  className="w-full h-12 px-4 bg-white/60 border border-border/40 rounded-xl focus:outline-none focus:border-border text-ink placeholder:text-muted-foreground shadow-sm transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Date limite *</label>
                <input
                  type="date"
                  name="dueDate"
                  required
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-white/60 border border-border/40 rounded-xl focus:outline-none focus:border-border text-ink shadow-sm transition-colors cursor-pointer"
                />
              </div>
            </div>

            <hr className="border-border/40" />

            {/* Ligne 3 : Durée, Difficulté, Priorité */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Durée totale estimée *</label>
                <div className="relative">
                  <input
                    type="number"
                    name="estimatedMinutes"
                    required
                    min="5"
                    value={formData.estimatedMinutes}
                    onChange={handleChange}
                    placeholder="Ex: 40"
                    className="w-full h-12 px-4 bg-white/60 border border-border/40 rounded-xl focus:outline-none focus:border-border text-ink placeholder:text-muted-foreground shadow-sm transition-colors pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">min</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Niveau de difficulté</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-white/60 border border-border/40 rounded-xl focus:outline-none focus:border-border text-ink shadow-sm transition-colors cursor-pointer"
                >
                  <option value="easy">Facile</option>
                  <option value="medium">Moyenne</option>
                  <option value="hard">Difficile</option>
                </select>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Priorité</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-white/60 border border-border/40 rounded-xl focus:outline-none focus:border-border text-ink shadow-sm transition-colors cursor-pointer"
                >
                  <option value="3">Haute (Très urgent)</option>
                  <option value="2">Normale</option>
                  <option value="1">Basse</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[15px] font-medium text-ink">Description et consignes</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Détaille les attentes globales de ce devoir..."
                className="w-full p-4 bg-white/60 border border-border/40 rounded-xl focus:outline-none focus:border-border text-ink placeholder:text-muted-foreground shadow-sm transition-colors resize-y"
              ></textarea>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-border/40">
              <button
                type="button"
                onClick={() => navigate('/teacher/dashboard')}
                className="btn-paper btn-ghost w-full sm:w-auto"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-paper btn-primary w-full sm:w-auto"
              >
                Créer le devoir
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}