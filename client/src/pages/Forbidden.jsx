import { Button, Card, CardBody } from '@heroui/react';
import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-edusoft p-6 font-sans">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody className="p-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-edublue">Accès refusé</h1>
          <Button as={Link} color="primary" to="/">
            Retour à l'accueil
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}
