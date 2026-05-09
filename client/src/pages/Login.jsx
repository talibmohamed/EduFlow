import { Button, Card, CardBody, Input } from '@heroui/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const dashboardByRole = {
  child: '/child/dashboard',
  parent: '/parent/dashboard',
  teacher: '/teacher/dashboard',
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      navigate(dashboardByRole[user.role], { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Connexion impossible');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-edusoft p-6 font-sans">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody className="p-8">
          <h1 className="mb-6 text-center text-3xl font-bold text-edublue">Se connecter</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
            <Input
              isRequired
              label="Email"
              type="email"
              value={email}
              onValueChange={setEmail}
            />
            <Input
              isRequired
              label="Mot de passe"
              type="password"
              value={password}
              onValueChange={setPassword}
            />
            <Button color="primary" fullWidth isLoading={isSubmitting} type="submit">
              Se connecter
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link className="font-semibold text-edublue" to="/register">
              Créer un compte
            </Link>
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
