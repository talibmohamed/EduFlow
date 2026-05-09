import { Button, Card, CardBody } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

export default function ChildDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-edusoft font-sans">
      <Header />
      <main className="mx-auto max-w-5xl p-6">
        <Card className="shadow-lg">
          <CardBody className="p-8">
            <h1 className="text-3xl font-bold text-edublue">Espace enfant</h1>
            <p className="mt-3 text-lg text-eduink">Bonjour {user.name}</p>
            <p className="mt-2 text-sm text-gray-500">Les fonctionnalités arrivent bientôt.</p>
            <Button className="mt-6" color="primary" onPress={handleLogout}>
              Logout
            </Button>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
