import { Input } from '@heroui/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ChildLogin() {
  const { loginAsChild } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleUsernameChange(value) {
    setUsername(value.trim().toLowerCase());
  }

  function handlePinChange(value) {
    // numeric only, max 4
    setPin(value.replace(/\D/g, '').slice(0, 4));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await loginAsChild(username, pin);
      navigate('/child/dashboard', { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          ? "Identifiant ou code incorrect. Réessaie."
          : "Connexion impossible. Réessaie dans un instant.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden selection:bg-[var(--sky)] selection:text-white"
      style={{ background: 'var(--linen)' }}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, var(--linen) 0%, var(--linen) 40%, oklch(0.93 0.04 240 / 0.35) 100%)',
        }}
      />

      <header className="p-6 lg:px-10 h-16 flex items-center">
        <Link
          to="/"
          className="font-display text-xl tracking-tight text-ink transition-transform hover:scale-105"
        >
          EduFlow
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-6 pb-24">
        <div className="paper-card w-full max-w-[26rem] p-8 sm:p-10 animate-rise">
          <div className="mb-8 text-center">
            <div className="mb-4 text-5xl" aria-hidden>
              👋
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
              Bienvenue !
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Connecte-toi pour voir tes missions du jour.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div
                className="rounded-xl border border-border/60 bg-clay/40 p-4 text-sm font-medium text-ink"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink/80">Ton identifiant</label>
              <Input
                isRequired
                autoFocus
                placeholder="Ex: lucas"
                variant="bordered"
                radius="lg"
                value={username}
                onValueChange={handleUsernameChange}
                autoComplete="username"
                classNames={{
                  inputWrapper:
                    'bg-white/60 border-border/40 hover:border-border h-12 shadow-sm transition-colors',
                  input: 'text-ink placeholder:text-muted-foreground',
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink/80">Ton code (4 chiffres)</label>
              <Input
                isRequired
                placeholder="0000"
                type="password"
                variant="bordered"
                radius="lg"
                value={pin}
                onValueChange={handlePinChange}
                inputMode="numeric"
                maxLength={4}
                autoComplete="off"
                classNames={{
                  inputWrapper:
                    'bg-white/60 border-border/40 hover:border-border h-12 shadow-sm transition-colors',
                  input: 'text-ink placeholder:text-muted-foreground tracking-[0.5em] text-center',
                }}
              />
              <p className="text-xs text-muted-foreground">
                Si tu ne t'en souviens plus, demande à tes parents.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || pin.length !== 4 || !username}
              className="btn-paper btn-primary mt-4 flex w-full items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Connexion...' : "C'est parti !"}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border/40" aria-hidden />
            <span className="uppercase tracking-[0.18em]">ou</span>
            <span className="h-px flex-1 bg-border/40" aria-hidden />
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Tu es un parent ou un enseignant ?{' '}
            <Link
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--sky)' }}
              to="/login"
            >
              Se connecter avec un email
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
