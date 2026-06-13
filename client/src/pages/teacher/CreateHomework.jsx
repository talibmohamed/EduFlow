import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

// DESIGN-SYSTEM §3: shared input styling for the whole form.
const inputClass =
  'w-full h-12 px-4 bg-card border border-border rounded-xl text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky transition-colors';
const selectClass = `${inputClass} cursor-pointer`;
const textareaClass =
  'w-full p-4 bg-card border border-border rounded-xl text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky transition-colors resize-y';

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function validateHomeworkForm(formData, today) {
  const title = formData.title.trim();
  const subject = formData.subject.trim();
  const estimatedMinutes = Number(formData.estimatedMinutes);
  const childId = Number(formData.childId);

  if (title.length < 3 || title.length > 160) {
    return 'Le titre doit comporter entre 3 et 160 caractères.';
  }
  if (!Number.isInteger(childId) || childId <= 0) {
    return 'Sélectionne un élève.';
  }
  if (subject.length < 1 || subject.length > 80) {
    return 'La matière doit comporter entre 1 et 80 caractères.';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dueDate)) {
    return 'Choisis une date limite valide.';
  }
  if (formData.dueDate < today) {
    return 'La date limite ne peut pas être passée.';
  }
  if (!Number.isInteger(estimatedMinutes) || estimatedMinutes <= 0) {
    return 'La durée estimée doit être un nombre positif.';
  }

  return null;
}

export default function CreateHomework() {
  const navigate = useNavigate();
  const [myStudents, setMyStudents] = useState([]);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const today = todayIsoDate();

  useEffect(() => {
    api.get('/api/teacher/children').then((res) => {
      setMyStudents(res.data.data.children);
    });
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    estimatedMinutes: '',
    difficulty: 'medium',
    priority: '2',
    childId: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const validationError = validateHomeworkForm(formData, today);
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/teacher/homework', {
        childId: Number(formData.childId),
        title: formData.title.trim(),
        description: formData.description.trim(),
        subject: formData.subject.trim(),
        dueDate: formData.dueDate,
        estimatedMinutes: Number(formData.estimatedMinutes),
        difficulty: formData.difficulty,
        priority: Number(formData.priority),
      });
      navigate('/teacher/dashboard');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Une erreur est survenue.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[var(--sky)] selection:text-white" style={{ background: 'var(--linen)' }}>

      {/* Bouton de retour en haut à gauche pour l'ergonomie */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6">
        <button
          onClick={() => navigate('/teacher/dashboard')}
          className="text-sm font-medium text-muted-foreground hover:text-ink transition-colors flex items-center gap-2"
        >
          <span>←</span> Retour au tableau de bord
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">

        {/* Titre de la page */}
        <div className="mb-10 animate-rise">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink leading-[1.1]">
            Créer un <em className="not-italic" style={{ color: 'var(--meadow)' }}>nouveau devoir.</em>
          </h1>
          <p className="mt-3 text-[16px] text-muted-foreground max-w-2xl">
            Définis l'objectif global. EduFlow se chargera de l'adapter au rythme de l'élève.
          </p>
        </div>

        <div className="paper-card animate-rise" style={{ animationDelay: '100ms' }}>
          <form onSubmit={handleSubmit} noValidate className="p-8 sm:p-10 space-y-8">

            {/* Ligne 1 : Titre et Élève */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Titre du devoir *</label>
                <input
                  type="text"
                  name="title"
                  minLength={3}
                  maxLength={160}
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Exercices de fractions"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Assigner à *</label>
                <select
                  name="childId"
                  value={formData.childId}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="" disabled className="text-muted-foreground">Sélectionner un élève...</option>
                  {myStudents.map(student => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ligne 2 : Matière et Date limite */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Matière *</label>
                <input
                  type="text"
                  name="subject"
                  maxLength={80}
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Ex: Mathématiques"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Date limite *</label>
                <input
                  type="date"
                  name="dueDate"
                  min={today}
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={selectClass}
                />
              </div>
            </div>

            <hr className="border-border/40" />

            {/* Ligne 3 : Durée, Difficulté, Priorité */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Durée totale estimée *</label>
                <div className="relative">
                  <input
                    type="number"
                    name="estimatedMinutes"
                    min="1"
                    value={formData.estimatedMinutes}
                    onChange={handleChange}
                    placeholder="Ex: 40"
                    className={`${inputClass} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">min</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Niveau de difficulté</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="easy">Facile</option>
                  <option value="medium">Moyenne</option>
                  <option value="hard">Difficile</option>
                </select>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-ink">Priorité</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="3">Haute (Très urgent)</option>
                  <option value="2">Normale</option>
                  <option value="1">Basse</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[15px] font-medium text-ink">Description et consignes</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Détaille les attentes globales de ce devoir..."
                className={textareaClass}
              ></textarea>
            </div>

            {submitError && (
              <div className="rounded-xl border border-border bg-clay p-4 text-sm text-ink">
                {submitError}
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-border/40">
              <button
                type="button"
                onClick={() => navigate('/teacher/dashboard')}
                className="btn-paper btn-ghost w-full sm:w-auto"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-paper btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Création en cours…' : 'Créer le devoir'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
