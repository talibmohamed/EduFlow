import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. On importe l'outil de navigation

export default function TeacherDashboard() {
  const navigate = useNavigate(); // 2. On l'initialise

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Espace Enseignant</h1>
          
          {/* 3. On ajoute l'événement onClick sur le bouton */}
          <button 
            onClick={() => navigate('/teacher/homework/create')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
          >
            + Créer un nouveau devoir
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700">Mes Élèves Assignés</h2>
          </div>
          
          <div className="p-8 text-center text-gray-500">
            [Liste des enfants et résumé hebdomadaire ici]
          </div>
        </div>
      </div>
    </div>
  );
}