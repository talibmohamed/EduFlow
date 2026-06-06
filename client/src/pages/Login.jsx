import { Input } from '@heroui/react';
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

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

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
    <div className="relative flex min-h-screen flex-col overflow-hidden selection:bg-[var(--sky)] selection:text-white" style={{ background: 'var(--linen)' }}>
      {/* Dawn gradient background from Hero */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, var(--linen) 0%, var(--linen) 40%, oklch(0.93 0.04 240 / 0.35) 100%)',
        }}
      />

      {/* Header aligné sur Nav.jsx */}
      <header className="p-6 lg:px-10 h-16 flex items-center">
        <Link to="/" className="font-display text-xl tracking-tight text-ink transition-transform hover:scale-105">
          EduFlow
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-6 pb-24">
        <div className="paper-card w-full max-w-[26rem] p-8 sm:p-10 animate-rise">
          
          <h1 className="mb-2 font-display text-3xl sm:text-4xl text-ink leading-tight">
            Bon retour 👋
          </h1>
          <p className="mb-8 text-[15px] text-muted-foreground">
            Connecte-toi pour retrouver le rythme de ta journée.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50/50 p-4 text-sm font-medium text-red-800 border border-red-100/50 animate-rise" style={{ animationDuration: '300ms' }}>
                {error}
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink/80">Adresse email</label>
              <Input
                isRequired
                placeholder="exemple@email.com"
                type="email"
                variant="bordered"
                radius="lg"
                value={email}
                onValueChange={setEmail}
                classNames={{
                  inputWrapper: "bg-white/60 border-border/40 hover:border-border h-12 shadow-sm transition-colors",
                  input: "text-ink placeholder:text-muted-foreground"
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink/80">Mot de passe</label>
              <Input
                isRequired
                placeholder="Ton mot de passe"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                radius="lg"
                value={password}
                onValueChange={setPassword}
                classNames={{
                  inputWrapper: "bg-white/60 border-border/40 hover:border-border h-12 pr-2 shadow-sm transition-colors",
                  input: "text-ink placeholder:text-muted-foreground"
                }}
                endContent={
                  <button className="focus:outline-none p-2 rounded-lg hover:bg-black/5 transition-colors" type="button" onClick={toggleVisibility} aria-label="Afficher le mot de passe">
                    {isVisible ? (
                      <svg className="text-xl text-ink/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} height="1em" width="1em">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="text-xl text-ink/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} height="1em" width="1em">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                }
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-paper btn-primary w-full flex justify-center items-center mt-4"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link className="font-medium transition-colors hover:opacity-80" style={{ color: 'var(--sky)' }} to="/register">
              Créer un compte
            </Link>
          </p>

          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border/40" aria-hidden />
            <span className="uppercase tracking-[0.18em]">ou</span>
            <span className="h-px flex-1 bg-border/40" aria-hidden />
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Tu es un enfant ?{' '}
            <Link className="font-medium transition-colors hover:opacity-80" style={{ color: 'var(--meadow)' }} to="/child-login">
              Se connecter avec un identifiant
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}