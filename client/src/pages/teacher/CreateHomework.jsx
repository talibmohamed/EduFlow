import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateHomework() {
  // Simule la liste des élèves assignés à cet enseignant (récupérés via l'API plus tard)
  const navigate = useNavigate();
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
    // Réinitialisation du formulaire (optionnel)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* En-tête du formulaire */}
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Créer un nouveau devoir</h1>
          <p className="text-indigo-100 mt-1">L'application se chargera de le découper en petites tâches pour l'élève.</p>
        </div>

        {/* Corps du formulaire */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Ligne 1 : Titre et Élève */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre du devoir *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Exercices de fractions"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigner à *</label>
              <select
                name="childId"
                required
                value={formData.childId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white outline-none"
              >
                <option value="" disabled>Sélectionner un élève...</option>
                {myStudents.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ligne 2 : Matière et Date limite */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Matière *</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Ex: Mathématiques"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date limite *</label>
              <input
                type="date"
                name="dueDate"
                required
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Ligne 3 : Durée, Difficulté, Priorité */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée estimée (min) *</label>
              <input
                type="number"
                name="estimatedMinutes"
                required
                min="5"
                value={formData.estimatedMinutes}
                onChange={handleChange}
                placeholder="Ex: 40"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulté</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white outline-none"
              >
                <option value="easy">Facile</option>
                <option value="medium">Moyenne</option>
                <option value="hard">Difficile</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorité (1 = Haute)</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white outline-none"
              >
                <option value="1">1 - Très urgent</option>
                <option value="2">2 - Normal</option>
                <option value="3">3 - Basse priorité</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description / Consignes</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Détails du devoir..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            ></textarea>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => navigate('/teacher/homework')}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition"
            >
              Créer le devoir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}