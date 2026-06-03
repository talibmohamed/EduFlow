/*
 * EduFlow — landing page.
 *
 * Ported from the flow-gentle-day design (Lovable) into EduFlow's stack:
 * React + Vite + Tailwind v3 + react-router. A calm, adaptive homework
 * companion for children 8–14. No red, ever.
 */
import { EnergyProvider, useEnergy } from '../components/eduflow/EnergyContext';
import { Nav } from '../components/eduflow/Nav';
import { Hero } from '../components/eduflow/Hero';
import {
  Audiences,
  FAQ,
  FinalCTA,
  Footer,
  HowItWorks,
  InteractiveSample,
  Problem,
  Promise as PromiseSection,
  Reveal,
  Shift,
} from '../components/eduflow/Sections';

// The wrapper carries the global "energy" tone as a class, scoped to the
// landing so the auth pages and dashboards are never affected.
function LandingShell() {
  const { energy } = useEnergy();
  const tone = energy === 'rest' ? 'energy-rest' : energy === 'spark' ? 'energy-spark' : '';

  return (
    <main className={`eduflow-landing min-h-screen ${tone}`}>
      <Nav />
      <Hero />
      <Reveal>
        <Problem />
      </Reveal>
      <Reveal>
        <Shift />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <Audiences />
      </Reveal>
      <Reveal>
        <PromiseSection />
      </Reveal>
      <Reveal>
        <InteractiveSample />
      </Reveal>
      <Reveal>
        <FAQ />
      </Reveal>
      <Reveal>
        <FinalCTA />
      </Reveal>
      <Footer />
    </main>
  );
}

export default function Landing() {
  return (
    <EnergyProvider>
      <LandingShell />
    </EnergyProvider>
  );
}
