import { Card, CardBody } from '@heroui/react';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

export default function ChildDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-edusoft font-sans">
      <Header />
      <main className="mx-auto max-w-3xl p-6 space-y-8">
        {/* Zone 1: État du jour */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-edublue">Comment te sens-tu aujourd'hui {user.name} ?</h2>
          <Card className="border-none shadow-sm">
            <CardBody className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
              [Le formulaire Énergie / Concentration viendra ici]
            </CardBody>
          </Card>
        </section>

        {/* Zone 2: Devoirs adaptés */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-edublue">Tes missions du jour</h2>
          <Card className="border-none shadow-sm">
            <CardBody className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
              [La liste des devoirs recommandés viendra ici]
            </CardBody>
          </Card>
        </section>

        {/* Zone 3: Progression positive */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-edublue">Ta progression</h2>
          <Card className="border-none bg-green-50 shadow-sm">
            <CardBody className="rounded-xl border-2 border-dashed border-green-200 p-8 text-center font-medium text-green-600">
              [Les messages positifs et les tâches terminées viendront ici]
            </CardBody>
          </Card>
        </section>
      </main>
    </div>
  );
}