import { Card, CardBody } from '@heroui/react';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

export default function ParentDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-edusoft font-sans">
      <Header />
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="mb-6 text-3xl font-bold text-edublue">Vue d'ensemble - Famille {user.name}</h1>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="border-none shadow-sm">
            <CardBody className="p-6">
              <h3 className="mb-4 text-lg font-bold text-eduink">État de mon enfant</h3>
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center text-gray-400">
                [Historique énergie et concentration ici]
              </div>
            </CardBody>
          </Card>

          <Card className="border-none shadow-sm">
            <CardBody className="p-6">
              <h3 className="mb-4 text-lg font-bold text-eduink">Progression des devoirs</h3>
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center text-gray-400">
                [Liste des tâches terminées et reportées ici]
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}