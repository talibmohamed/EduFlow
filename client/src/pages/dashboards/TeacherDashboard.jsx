import { Button, Card, CardBody } from '@heroui/react';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-edusoft font-sans">
      <Header />
      <main className="mx-auto max-w-5xl p-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-edublue">Espace Enseignant</h1>
            <p className="mt-2 text-lg text-eduink">Bonjour {user.name}</p>
          </div>
          <Button color="primary" className="bg-edublue font-medium">
            + Créer un nouveau devoir
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardBody className="p-6">
              <h3 className="mb-4 text-lg font-bold text-eduink">Mes élèves assignés</h3>
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
                [Liste des enfants et résumé hebdomadaire ici]
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}