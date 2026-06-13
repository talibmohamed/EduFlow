import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const dashboardByRole = {
  child: '/child/dashboard',
  parent: '/parent/dashboard',
  teacher: '/teacher/dashboard',
};

const routePrefixesByRole = {
  child: ['/child'],
  parent: ['/parent'],
  teacher: ['/teacher'],
};

function getRedirectForUser(user, next) {
  const fallback = dashboardByRole[user.role] ?? '/';
  const allowedPrefixes = routePrefixesByRole[user.role] ?? [];

  if (
    typeof next === 'string'
    && next.startsWith('/')
    && !next.startsWith('//')
    && allowedPrefixes.some((prefix) => next === prefix || next.startsWith(`${prefix}/`))
  ) {
    return next;
  }

  return fallback;
}

const inputClass =
  'w-full rounded-[14px] border border-border bg-card px-4 py-3 text-[15px] text-ink placeholder:text-muted-foreground/70 outline-none transition-shadow duration-300 focus:border-sky/50 focus:shadow-[0_0_0_4px_oklch(0.58_0.19_263/0.12)]';

const inputClassCentered = `${inputClass} text-center tracking-[0.5em]`;

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven initial state: ?mode=register | ?role=child
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'signin';
  const initialSigninRole = searchParams.get('role') === 'child' ? 'child' : 'adult';

  const [mode, setMode] = useState(initialMode);
  const [signinRole, setSigninRole] = useState(initialSigninRole);
  const [registerRole, setRegisterRole] = useState('parent');

  function handleModeChange(nextMode) {
    setMode(nextMode);
    // keep the URL clean — mode only persists if non-default
    const next = new URLSearchParams(searchParams);
    if (nextMode === 'register') {
      next.set('mode', 'register');
      next.delete('role');
    } else {
      next.delete('mode');
    }
    setSearchParams(next, { replace: true });
  }

  function onAuthSuccess(user) {
    navigate(getRedirectForUser(user, searchParams.get('next')), { replace: true });
  }

  return (
    <main
      className="relative min-h-screen w-full text-ink selection:bg-[var(--sky)] selection:text-white"
      style={{ background: 'var(--linen)' }}
    >
      {/* Dawn through curtains */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] opacity-70"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 0%, oklch(0.92 0.06 240 / 0.6), transparent 70%)',
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-[1080px] flex-col px-5 sm:px-8">
        <header className="flex items-center justify-between pt-6 sm:pt-8">
          <Link to="/" className="font-display text-[18px] tracking-tight text-ink" aria-label="EduFlow">
            EduFlow
          </Link>
          <Link to="/" className="text-[13px] text-muted-foreground transition-colors hover:text-ink">
            ← Retour à l'accueil
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-12 sm:py-16">
          <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(420px,460px)] lg:gap-16">
            <WelcomeWhisper mode={mode} signinRole={signinRole} />

            <div className="paper-card animate-rise relative p-7 sm:p-9">
              <ModeToggle mode={mode} onChange={handleModeChange} />

              <div className="mt-7">
                {mode === 'signin' ? (
                  <SignInBlock
                    signinRole={signinRole}
                    setSigninRole={setSigninRole}
                    onSuccess={onAuthSuccess}
                  />
                ) : (
                  <RegisterBlock
                    registerRole={registerRole}
                    setRegisterRole={setRegisterRole}
                    onSuccess={onAuthSuccess}
                  />
                )}
              </div>

              <div className="mt-7 flex items-center gap-3">
                <span className="pencil-divider flex-1" />
                <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">ou</span>
                <span className="pencil-divider flex-1" />
              </div>

              <p className="mt-6 text-center text-[13px] text-muted-foreground">
                {mode === 'signin' ? (
                  <>
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeChange('register')}
                      className="font-medium transition-colors hover:opacity-80"
                      style={{ color: 'var(--sky)' }}
                    >
                      Créer un compte
                    </button>
                  </>
                ) : (
                  <>
                    Déjà un compte ?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeChange('signin')}
                      className="font-medium transition-colors hover:opacity-80"
                      style={{ color: 'var(--sky)' }}
                    >
                      Se connecter
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <footer className="py-8 text-center text-[12px] text-muted-foreground">
          Un compagnon calme pour les devoirs. Pensé pour les enfants de 8 à 14 ans.
        </footer>
      </div>
    </main>
  );
}

/* ---------------- Welcome aside ---------------- */

function WelcomeWhisper({ mode, signinRole }) {
  const isRegister = mode === 'register';

  const eyebrow = isRegister ? 'Un nouveau départ' : 'Bon retour';

  const heading = isRegister ? (
    <>
      Crée un coin <br />
      <span className="text-sky">calme</span> pour ton enfant.
    </>
  ) : (
    <>
      On a gardé ta place. <br />
      <span className="text-sky">Prends ton temps.</span>
    </>
  );

  const sub = isRegister
    ? "Créer un compte ne prend que quelques respirations. Pas de streaks, pas de badges, pas de rappels qui piquent."
    : signinRole === 'child'
      ? "Connecte-toi avec ton identifiant et ton code à 4 chiffres. Demande à un adulte si tu ne t'en souviens plus."
      : "Rien ne s'est accumulé. Aujourd'hui est un nouveau jour — commence où tu veux.";

  const bullets = isRegister
    ? [
        'Un état du matin en deux secondes.',
        "Des devoirs qui s'adaptent au jour.",
        "Les parents voient l'effort, pas la performance.",
      ]
    : [
        'Un état du matin en deux secondes.',
        "Une journée qui s'ajuste à ton énergie.",
        'Pas de retard, jamais.',
      ];

  return (
    <aside className="hidden flex-col justify-center lg:flex">
      <p className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      <h1 className="animate-breath mt-3 font-display text-[40px] leading-[1.1] text-ink">
        {heading}
      </h1>
      <p className="mt-5 max-w-[380px] text-[15px] leading-relaxed text-muted-foreground">{sub}</p>
      <ul className="mt-8 max-w-[360px] space-y-3 text-[14px] text-ink/80">
        {bullets.map((line) => (
          <li key={line} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-[7px] inline-block h-[6px] w-[6px] rounded-full bg-honey"
              style={{ boxShadow: '0 0 8px oklch(0.86 0.16 95 / 0.6)' }}
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ---------------- Mode toggle (sign in / register) ---------------- */

function ModeToggle({ mode, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Se connecter ou créer un compte"
      className="relative grid grid-cols-2 gap-1 rounded-full bg-clay/60 p-1 text-[13px] font-medium"
    >
      <span
        aria-hidden
        className="absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-full bg-card shadow-[0_1px_2px_rgba(40,30,20,0.06),0_4px_10px_rgba(40,30,20,0.06)] transition-transform duration-500"
        style={{ transform: mode === 'signin' ? 'translateX(4px)' : 'translateX(calc(100% + 0px))' }}
      />
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'signin'}
        onClick={() => onChange('signin')}
        className="relative z-10 rounded-full py-2.5 transition-colors"
        style={{ color: mode === 'signin' ? 'var(--ink)' : 'oklch(0.48 0.02 255)' }}
      >
        Se connecter
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'register'}
        onClick={() => onChange('register')}
        className="relative z-10 rounded-full py-2.5 transition-colors"
        style={{ color: mode === 'register' ? 'var(--ink)' : 'oklch(0.48 0.02 255)' }}
      >
        Créer un compte
      </button>
    </div>
  );
}

/* ---------------- Role chips ---------------- */

function RoleChip({ active, onClick, title, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-[16px] border px-4 py-3 text-left transition-all duration-300"
      style={{
        borderColor: active ? 'oklch(0.58 0.19 263 / 0.4)' : 'var(--border)',
        background: active ? 'oklch(0.58 0.19 263 / 0.06)' : 'var(--card)',
        boxShadow: active
          ? '0 2px 4px rgba(40,30,20,0.04), 0 10px 22px rgba(40,30,20,0.06)'
          : '0 1px 2px rgba(40,30,20,0.03)',
      }}
    >
      <div className="text-[13px] font-semibold text-ink">{title}</div>
      <div className="mt-0.5 text-[12px] text-muted-foreground">{sub}</div>
    </button>
  );
}

/* ---------------- Field helper ---------------- */

function Field({ label, hint, htmlFor, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink">
          {label}
        </label>
        {hint ? <span className="text-[12px] text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function FormError({ message }) {
  if (!message) return null;
  return (
    <div
      className="rounded-xl border border-border/60 bg-clay/40 p-3 text-[13px] font-medium text-ink"
      role="alert"
    >
      {message}
    </div>
  );
}

/* ---------------- Sign in (parent/teacher vs child) ---------------- */

function SignInBlock({ signinRole, setSigninRole, onSuccess }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <span className="text-[13px] font-medium text-ink">Tu te connectes en tant que…</span>
        <div className="grid grid-cols-2 gap-2.5">
          <RoleChip
            active={signinRole === 'adult'}
            onClick={() => setSigninRole('adult')}
            title="Parent ou enseignant"
            sub="Avec un email"
          />
          <RoleChip
            active={signinRole === 'child'}
            onClick={() => setSigninRole('child')}
            title="Enfant"
            sub="Avec un identifiant"
          />
        </div>
      </div>

      {signinRole === 'adult' ? (
        <AdultSignInForm onSuccess={onSuccess} />
      ) : (
        <ChildSignInForm onSuccess={onSuccess} />
      )}
    </div>
  );
}

function AdultSignInForm({ onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      onSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Connexion impossible. Réessaie.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <FormError message={error} />

      <Field htmlFor="signin-email" label="Email">
        <input
          id="signin-email"
          type="email"
          autoComplete="email"
          required
          placeholder="toi@maison.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field htmlFor="signin-password" label="Mot de passe">
        <input
          id="signin-password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="btn-paper btn-primary mt-1 w-full disabled:opacity-50"
      >
        {submitting ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}

function ChildSignInForm({ onSuccess }) {
  const { loginAsChild } = useAuth();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handlePinChange(value) {
    setPin(value.replace(/\D/g, '').slice(0, 4));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await loginAsChild(username.trim().toLowerCase(), pin);
      onSuccess(user);
    } catch {
      setError("Identifiant ou code incorrect. Réessaie.");
    } finally {
      setSubmitting(false);
    }
  }

  const isValid = username.trim().length >= 3 && pin.length === 4;

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <FormError message={error} />

      <Field htmlFor="signin-username" label="Ton identifiant">
        <input
          id="signin-username"
          type="text"
          autoComplete="username"
          required
          autoFocus
          placeholder="lucas"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field
        htmlFor="signin-pin"
        label="Ton code (4 chiffres)"
        hint="Demande à un adulte si tu l'as oublié."
      >
        <input
          id="signin-pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          required
          maxLength={4}
          placeholder="0000"
          value={pin}
          onChange={(e) => handlePinChange(e.target.value)}
          className={inputClassCentered}
        />
      </Field>

      <button
        type="submit"
        disabled={!isValid || submitting}
        className="btn-paper btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Connexion…' : "C'est parti !"}
      </button>
    </form>
  );
}

/* ---------------- Register (parent / teacher) ---------------- */

function RegisterBlock({ registerRole, setRegisterRole, onSuccess }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await register(name.trim(), email.trim().toLowerCase(), password, registerRole);
      onSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Inscription impossible. Réessaie.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <FormError message={error} />

      <div className="space-y-2">
        <span className="text-[13px] font-medium text-ink">Tu crées un compte en tant que…</span>
        <div className="grid grid-cols-2 gap-2.5">
          <RoleChip
            active={registerRole === 'parent'}
            onClick={() => setRegisterRole('parent')}
            title="Parent"
            sub="Pour suivre mon enfant"
          />
          <RoleChip
            active={registerRole === 'teacher'}
            onClick={() => setRegisterRole('teacher')}
            title="Enseignant"
            sub="Pour créer des devoirs"
          />
        </div>
      </div>

      <p className="-mt-1 text-[12px] text-muted-foreground">
        Les enfants ne créent pas leur compte eux-mêmes — un parent l'ajoute depuis son tableau de bord.
      </p>

      <Field htmlFor="register-name" label="Nom complet">
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          required
          placeholder="Ex : Alex Morgan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field htmlFor="register-email" label="Email">
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          required
          placeholder="toi@maison.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field htmlFor="register-password" label="Mot de passe" hint="Au moins 8 caractères">
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="btn-paper btn-primary mt-1 w-full disabled:opacity-50"
      >
        {submitting ? 'Création…' : 'Créer un compte calme'}
      </button>
    </form>
  );
}
