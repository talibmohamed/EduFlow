import { Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-edusoft font-sans">
      <Header />
      <main className="mx-auto max-w-5xl p-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-edublue">Espace Enseignant</h1>
            <p className="mt-1 text-eduink/80">Bonjour {user.name}</p>
          </div>
          <Button
            color="primary"
            onPress={() => navigate('/teacher/homework/create')}
          >
            + Créer un nouveau devoir
          </Button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-eduink">Mes élèves assignés</h2>
          </div>
          <div className="p-8 text-center text-gray-500">
            [Liste des enfants et résumé hebdomadaire ici]
          </div>
        </div>
      </main>
    </div>
  );
}
