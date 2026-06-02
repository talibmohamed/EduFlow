import { Button, Input, Select, SelectItem } from '@heroui/react';
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
  // Utilisation d'un Set pour éviter le bug d'affichage de HeroUI
  const [role, setRole] = useState(new Set(['child'])); 
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const selectedRole = Array.from(role)[0];

    try {
      const user = await register(name, email, password, selectedRole);
      navigate(dashboardByRole[user.role], { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Inscription impossible');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans selection:bg-blue-200">
      
      {/* En-tête identique à Login */}
      <header className="p-6 sm:p-10">
        <Link to="/" className="inline-flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-edublue shadow-sm">
            <span className="text-xl font-bold text-white">E</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">EduFlow</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-6 pb-24">
        <div className="w-full max-w-[32rem] rounded-[2rem] border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200/50 sm:p-10">
          
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">Créer ton compte</h1>
          <p className="mb-8 text-sm font-medium text-slate-500">
            Configure ton accès et choisis comment utiliser la plateforme EduFlow.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-100">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              
              {/* NOM COMPLET */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Nom complet</label>
                <Input 
                  isRequired 
                  placeholder="Ex: Jean Dupont"
                  variant="bordered"
                  radius="lg"
                  value={name} 
                  onValueChange={setName} 
                  classNames={{
                    inputWrapper: "bg-white border-slate-300 hover:border-slate-500 h-12",
                  }}
                />
              </div>

              {/* TYPE DE COMPTE */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Type de compte</label>
                <Select
                  isRequired
                  variant="bordered"
                  radius="lg"
                  selectedKeys={role}
                  onSelectionChange={setRole}
                  classNames={{ 
                    trigger: "bg-white border-slate-300 hover:border-slate-500 h-12",
                    popoverContent: "bg-white border border-slate-200 shadow-xl rounded-xl p-1"
                  }}
                >
                  {roles.map((item) => (
                    <SelectItem key={item.key} className="text-slate-700 font-medium data-[hover=true]:bg-slate-100">
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Adresse email</label>
              <Input
                isRequired
                placeholder="nom@exemple.com"
                type="email"
                variant="bordered"
                radius="lg"
                value={email}
                onValueChange={setEmail}
                classNames={{
                  inputWrapper: "bg-white border-slate-300 hover:border-slate-500 h-12",
                }}
              />
            </div>

            {/* MOT DE PASSE */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Mot de passe</label>
              <Input
                isRequired
                placeholder="Min. 8 caractères"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                radius="lg"
                value={password}
                onValueChange={setPassword}
                classNames={{
                  inputWrapper: "bg-white border-slate-300 hover:border-slate-500 h-12 pr-2",
                }}
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <svg className="text-xl text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} height="1em" width="1em">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="text-xl text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} height="1em" width="1em">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                }
              />
            </div>
            
            <Button 
              color="primary" 
              fullWidth 
              isLoading={isSubmitting} 
              type="submit" 
              className="mt-2 h-12 rounded-xl bg-slate-900 font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
            >
              Créer mon compte
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Déjà un compte ?{' '}
            <Link className="font-bold text-edublue hover:underline" to="/login">
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}