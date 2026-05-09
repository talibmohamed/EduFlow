import { Button, Chip } from '@heroui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const dashboardByRole = {
  child: '/child/dashboard',
  parent: '/parent/dashboard',
  teacher: '/teacher/dashboard',
};

const roleLabels = {
  child: 'Enfant',
  parent: 'Parent',
  teacher: 'Enseignant',
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) {
    return null;
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link className="text-xl font-bold text-edublue" to={dashboardByRole[user.role]}>
          EduFlow
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium text-eduink sm:inline">{user.name}</span>
          <Chip color="primary" size="sm" variant="flat">
            {roleLabels[user.role]}
          </Chip>
          <Button color="primary" size="sm" variant="flat" onPress={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
