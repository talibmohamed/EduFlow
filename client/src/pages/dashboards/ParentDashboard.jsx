import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import Header from '../../components/Header';
import { EmptyState } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { Link } from 'react-router-dom';


function suggestUsername(name) {
  const first = (name || '').trim().split(/\s+/)[0] || '';
  return first
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9_-]/g, '');
}

function ChildAvatar({ name }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div
      className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-border/40 bg-white/70 font-display text-xl text-ink shadow-sm"
      aria-hidden
    >
      {initial}
    </div>
  );
}

function ChildCard({ child }) {
 const meta = [
     child.age ? `${child.age} ans` : null,
     child.classLevel ? child.classLevel : null,
   ].filter(Boolean).join(' · ');

   return (
     <Link to={`/parent/child/${child.id}`} className="block hover:opacity-90 transition-opacity">
       <div className="paper-card flex items-center gap-5 p-6">
         <ChildAvatar name={child.name} />
         <div className="min-w-0 flex-1">
           <div className="font-display text-[19px] text-ink">{child.name}</div>
           {meta && (
             <div className="mt-1 text-sm text-muted-foreground">{meta}</div>
           )}
           <div className="mt-2 text-xs text-muted-foreground">
             Identifiant : <span className="font-medium text-ink/80">{child.username}</span>
           </div>
         </div>
         <span className="text-muted-foreground text-lg">›</span>
       </div>
     </Link>
   );
}

function AddChildModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [pin, setPin] = useState('');
  const [age, setAge] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);


  function handleNameChange(value) {
    setName(value);
    if (!usernameTouched) {
      setUsername(suggestUsername(value));
    }
  }

  function handleUsernameChange(value) {
    setUsernameTouched(true);
    setUsername(value.toLowerCase());
  }

  function handlePinChange(value) {

    const digits = value.replace(/\D/g, '').slice(0, 4);
    setPin(digits);
  }

  function reset() {
    setName('');
    setUsername('');
    setUsernameTouched(false);
    setPin('');
    setAge('');
    setClassLevel('');
    setError('');
    setSubmitting(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/api/parent/children', {
        name,
        username,
        pin,
        age: age === '' ? null : Number(age),
        class_level: classLevel === '' ? null : classLevel,
      });
      const created = res.data.data.child;
      reset();
      onCreated(created);
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || "Une erreur est survenue, réessaie.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    if (submitting) return;
    reset();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} placement="center" size="lg" backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className="font-display text-2xl text-ink">Ajouter un enfant</span>
          <span className="text-sm font-normal text-muted-foreground">
            Choisis un identifiant et un code à 4 chiffres que ton enfant utilisera pour se connecter.
          </span>
        </ModalHeader>
        <ModalBody className="gap-5">
          <form id="add-child-form" className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-border/60 bg-clay/40 p-3 text-sm font-medium text-ink">
                {error}
              </div>
            )}
            <Input
              isRequired
              label="Prénom"
              placeholder="Léa"
              value={name}
              onValueChange={handleNameChange}
              variant="bordered"
              radius="lg"
            />
            <Input
              isRequired
              label="Identifiant"
              description="Lettres, chiffres, tirets uniquement. 3 à 60 caractères."
              placeholder="lea"
              value={username}
              onValueChange={handleUsernameChange}
              variant="bordered"
              radius="lg"
            />
            <Input
              isRequired
              label="Code à 4 chiffres"
              description="Partage-le avec ton enfant pour qu'il puisse se connecter."
              placeholder="0000"
              value={pin}
              onValueChange={handlePinChange}
              variant="bordered"
              radius="lg"
              inputMode="numeric"
              maxLength={4}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Âge"
                placeholder="11"
                value={age}
                onValueChange={setAge}
                type="number"
                min={4}
                max={18}
                variant="bordered"
                radius="lg"
              />
              <Input
                label="Classe"
                placeholder="6ème"
                value={classLevel}
                onValueChange={setClassLevel}
                variant="bordered"
                radius="lg"
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose} isDisabled={submitting}>
            Annuler
          </Button>
          <Button color="primary" type="submit" form="add-child-form" isLoading={submitting}>
            Ajouter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChildren = useCallback(async () => {
    try {
      const res = await api.get('/api/parent/children');
      setChildren(res.data.data.children);
      setError(null);
    } catch {
      setError("Impossible de charger la liste des enfants. Réessaie dans un instant.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  function handleCreated(newChild) {
    setChildren((prev) => [...prev, newChild].sort((a, b) => a.name.localeCompare(b.name)));
  }

  return (
    <div
      className="flex min-h-screen flex-col selection:bg-[var(--sky)] selection:text-white"
      style={{ background: 'var(--linen)' }}
    >
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 p-6 lg:p-10 space-y-8">
        {error && (
          <div className="paper-card p-4 text-center text-[15px] font-medium text-ink" role="alert">
            {error}
          </div>
        )}

        {!loading && children.length === 0 ? (
          /* Landing-tier hero — only the first time a parent signs in with no kids */
          <section className="relative pt-4">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-16 bottom-0 -z-10"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, transparent 40%, oklch(0.93 0.04 240 / 0.35) 100%)',
              }}
            />

            <h1 className="mb-3 font-display text-3xl sm:text-4xl lg:text-5xl text-ink leading-[1.05] text-center">
              <span className="inline-block animate-breath mr-[0.28em]" style={{ animationDelay: '0ms' }}>
                Bonjour
              </span>
              <span className="inline-block animate-breath" style={{ animationDelay: '220ms' }}>
                <span className="swash">
                  <em className="not-italic" style={{ color: 'var(--sky)' }}>{user.name}</em>
                  <svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
                    <path
                      className="swash-path"
                      d="M3 9 C 50 3 90 12 140 6 S 196 4 197 7"
                      fill="none"
                      stroke="var(--honey)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      pathLength="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
                .
              </span>
            </h1>
            <p className="mb-10 text-center text-sm text-muted-foreground animate-rise" style={{ animationDelay: '500ms' }}>
              Ton tableau de bord prendra vie dès que tu auras ajouté ton premier enfant.
            </p>

            <div className="animate-rise" style={{ animationDelay: '700ms' }}>
              <EmptyState
                emoji="🌿"
                title="Aucun enfant pour le moment"
                description="Ajoute ton premier enfant pour commencer à suivre son rythme."
                action={
                  <Button color="primary" onPress={onOpen}>
                    + Ajouter un enfant
                  </Button>
                }
              />
            </div>
          </section>
        ) : (
          <>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center animate-rise">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
                  Mes enfants
                </h1>
                <p className="mt-2 text-[15px] text-muted-foreground">
                  Bonjour {user.name}. Ajoute un enfant pour suivre son rythme au quotidien.
                </p>
              </div>
              <Button color="primary" onPress={onOpen} className="flex-shrink-0">
                + Ajouter un enfant
              </Button>
            </div>

            {loading ? (
              <div className="paper-card p-10 text-center text-[15px] font-medium text-muted-foreground animate-pulse">
                Chargement de tes enfants...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 animate-rise" style={{ animationDelay: '100ms' }}>
                {children.map((child) => (
                  <ChildCard key={child.id} child={child} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <AddChildModal isOpen={isOpen} onClose={onClose} onCreated={handleCreated} />
    </div>
  );
}
