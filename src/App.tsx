import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Breadcrumb } from './components/Breadcrumb';
import { IntroScreen } from './screens/IntroScreen';
import { IndustryScreen } from './screens/IndustryScreen';
import { EnvironmentScreen } from './screens/EnvironmentScreen';
import { OrgSizeScreen } from './screens/OrgSizeScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { LoginScreen } from './screens/LoginScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { useAuth } from './lib/auth';
import { QUESTIONS } from './data/questions';
import type { AssessmentRow } from './lib/assessments';
import type { IndustryId, Environment, OrgSize } from './types';

type Stage = 'history' | 'intro' | 'industry' | 'environment' | 'orgsize' | 'quiz' | 'results';

export default function App() {
  const { session, loading, signOut, user } = useAuth();

  const [stage, setStage]               = useState<Stage>('history');
  const [industry, setIndustry]         = useState<IndustryId | null>(null);
  const [environment, setEnvironment]   = useState<Environment | null>(null);
  const [orgSize, setOrgSize]           = useState<OrgSize | null>(null);
  const [step, setStep]                 = useState(0);
  const [answers, setAnswers]           = useState<(number | null)[]>(() =>
    new Array(QUESTIONS.length).fill(null),
  );
  const [openedAssessment, setOpenedAssessment] = useState<AssessmentRow | null>(null);

  function handleSelect(qIdx: number, optIdx: number) {
    setAnswers(prev => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  }

  const handleRetake = useCallback(() => {
    // Hard reload to guarantee clean state. Both Retake entry points wire here.
    window.location.reload();
  }, []);

  function goToQuiz() {
    setStage('quiz');
    setStep(0);
    window.scrollTo(0, 0);
  }

  function goToResults() {
    setOpenedAssessment(null);
    setStage('results');
    window.scrollTo(0, 0);
  }

  function startNewCheck() {
    setIndustry(null);
    setEnvironment(null);
    setOrgSize(null);
    setStep(0);
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setOpenedAssessment(null);
    setStage('intro');
    window.scrollTo(0, 0);
  }

  function openHistoryItem(row: AssessmentRow) {
    setOpenedAssessment(row);
    setIndustry(row.industry);
    setEnvironment(row.environment);
    setOrgSize(row.org_size);
    setAnswers(row.answers);
    setStage('results');
    window.scrollTo(0, 0);
  }

  function goToHistory() {
    setOpenedAssessment(null);
    setStage('history');
    window.scrollTo(0, 0);
  }

  const wrapMax = stage === 'results' ? 'max-w-[1600px]' : 'max-w-quiz';

  // ── Auth gate ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-mute">
        Loading…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <Breadcrumb />
        <main className="flex-1 mx-auto w-full max-w-quiz px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <LoginScreen />
        </main>
        <Footer />
      </div>
    );
  }

  // ── Authed app ───────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        onRetake={stage === 'results' ? handleRetake : undefined}
        onHistory={stage !== 'history' ? goToHistory : undefined}
        userEmail={user?.email ?? null}
        onSignOut={signOut}
      />
      <Breadcrumb />

      <main className={`flex-1 mx-auto w-full ${wrapMax} px-4 sm:px-6 lg:px-10 py-8 sm:py-10 transition-[max-width] duration-300`}>
        <AnimatePresence mode="wait" initial={false}>
          {stage === 'history' && (
            <HistoryScreen
              key="history"
              onNewCheck={startNewCheck}
              onOpen={openHistoryItem}
            />
          )}

          {stage === 'intro' && (
            <IntroScreen key="intro" onStart={() => setStage('industry')} />
          )}

          {stage === 'industry' && (
            <IndustryScreen
              key="industry"
              selected={industry}
              onSelect={setIndustry}
              onBack={() => setStage('intro')}
              onNext={() => setStage('environment')}
            />
          )}

          {stage === 'environment' && (
            <EnvironmentScreen
              key="environment"
              selected={environment}
              onSelect={setEnvironment}
              onBack={() => setStage('industry')}
              onNext={() => setStage('orgsize')}
            />
          )}

          {stage === 'orgsize' && (
            <OrgSizeScreen
              key="orgsize"
              selected={orgSize}
              onSelect={setOrgSize}
              onBack={() => setStage('environment')}
              onNext={goToQuiz}
            />
          )}

          {stage === 'quiz' && (
            <QuizScreen
              key="quiz"
              step={step}
              answers={answers}
              onSelect={handleSelect}
              onBack={() => {
                if (step === 0) setStage('orgsize');
                else setStep(s => s - 1);
              }}
              onNext={() => setStep(s => Math.min(s + 1, QUESTIONS.length - 1))}
              onFinish={goToResults}
            />
          )}

          {stage === 'results' && (
            <ResultsScreen
              key="results"
              answers={answers}
              industry={industry!}
              environment={environment!}
              orgSize={orgSize!}
              onRetake={handleRetake}
              isViewingHistorical={Boolean(openedAssessment)}
            />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
