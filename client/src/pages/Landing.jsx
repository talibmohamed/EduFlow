import { Card, CardBody } from '@heroui/react';

export default function Landing() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-edusoft p-6 font-sans">
      <Card className="max-w-md w-full shadow-lg">
        <CardBody className="text-center p-10">
          <h1 className="text-4xl font-bold text-edublue mb-3">EduFlow</h1>
          <p className="text-eduink text-lg">Les devoirs, adaptés à ton énergie.</p>
          <p className="text-sm text-gray-500 mt-6">Authentification arrive bientôt.</p>
        </CardBody>
      </Card>
    </main>
  );
}
