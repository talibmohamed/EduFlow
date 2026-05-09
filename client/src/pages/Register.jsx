import { Button, Card, CardBody, Input, Select, SelectItem } from '@heroui/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const dashboardByRole = {
  child: '/child/dashboard',
  parent: '/parent/dashboard',
  teacher: '/teacher/dashboard',
};

const roles = [
  { key: 'child', label: 'Enfant' },
  { key: 'parent', label: 'Parent' },
  { key: 'teacher', label: 'Enseignant' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('child');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await register(name, email, password, role);
      navigate(dashboardByRole[user.role], { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Inscription impossible');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-edusoft p-6 font-sans">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody className="p-8">
          <h1 className="mb-6 text-center text-3xl font-bold text-edublue">Créer un compte</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
            <Input isRequired label="Nom" value={name} onValueChange={setName} />
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
            <Select
              isRequired
              label="Rôle"
              selectedKeys={[role]}
              onSelectionChange={(keys) => setRole(Array.from(keys)[0])}
            >
              {roles.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>
            <Button color="primary" fullWidth isLoading={isSubmitting} type="submit">
              Créer le compte
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link className="font-semibold text-edublue" to="/login">
              Se connecter
            </Link>
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
