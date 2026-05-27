import { useState } from 'react';
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
import { QUESTIONS } from './data/questions';
import type { IndustryId, Environment, OrgSize } from './types';

type Stage = 'intro' | 'industry' | 'environment' | 'orgsize' | 'quiz' | 'results';

export default function App() {
  const [stage, setStage]               = useState<Stage>('intro');
  const [industry, setIndustry]         = useState<IndustryId | null>(null);
  const [environment, setEnvironment]   = useState<Environment | null>(null);
  const [orgSize, setOrgSize]           = useState<OrgSize | null>(null);
  const [step, setStep]                 = useState(0);
  const [answers, setAnswers]           = useState<(number | null)[]>(() =>
    new Array(QUESTIONS.length).fill(null),
  );

  function handleSelect(qIdx: number, optIdx: number) {
    setAnswers(prev => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  }

  function handleRetake() {
    window.scrollTo({ top: 0 });
    setIndustry(null);
    setEnvironment(null);
    setOrgSize(null);
    setStep(0);
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setStage('intro');
  }

  function goToQuiz() {
    setStage('quiz');
    setStep(0);
    window.scrollTo({ top: 0 });
  }

  function goToResults() {
    setStage('results');
    window.scrollTo({ top: 0 });
  }

  // Wide on results, narrower on quiz steps
  const wrapMax = stage === 'results' ? 'max-w-[1600px]' : 'max-w-quiz';

  return (
    <div className="flex flex-col min-h-screen">
      <Header onRetake={stage === 'results' ? handleRetake : undefined} />
      <Breadcrumb />

      <main className={`flex-1 mx-auto w-full ${wrapMax} px-4 sm:px-6 lg:px-10 py-8 sm:py-10 transition-[max-width] duration-300`}>
        <AnimatePresence mode="wait" initial={false}>
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
            />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
