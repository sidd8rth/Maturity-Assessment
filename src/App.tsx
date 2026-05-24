import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Breadcrumb } from './components/Breadcrumb';
import { IntroScreen } from './screens/IntroScreen';
import { IndustryScreen } from './screens/IndustryScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { QUESTIONS } from './data/questions';
import type { IndustryId } from './types';

type Stage = 'intro' | 'industry' | 'quiz' | 'results';

export default function App() {
  const [stage, setStage]               = useState<Stage>('intro');
  const [industry, setIndustry]         = useState<IndustryId | null>(null);
  const [otherLabel, setOtherLabel]     = useState('');
  const [step, setStep]                 = useState(0);
  const [answers, setAnswers]           = useState<(number | null)[]>(() =>
    new Array(QUESTIONS.length).fill(null),
  );
  const [plainMode, setPlainMode]       = useState(false);

  function handleSelect(qIdx: number, optIdx: number) {
    setAnswers(prev => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  }

  function handleRetake() {
    setStage('intro');
    setIndustry(null);
    setOtherLabel('');
    setStep(0);
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setPlainMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToQuiz() {
    setStage('quiz');
    setStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToResults() {
    setStage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Container width expands on results screen for the 2-column layout
  const wrapMax = stage === 'results' ? 'max-w-[1440px]' : 'max-w-quiz';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Breadcrumb />

      <main className={`flex-1 mx-auto w-full ${wrapMax} px-4 sm:px-6 lg:px-8 py-8 sm:py-10 transition-[max-width] duration-300`}>
        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <IntroScreen
              key="intro"
              onStart={() => setStage('industry')}
            />
          )}

          {stage === 'industry' && (
            <IndustryScreen
              key="industry"
              selected={industry}
              otherLabel={otherLabel}
              onSelect={setIndustry}
              onOtherLabel={setOtherLabel}
              onBack={() => setStage('intro')}
              onNext={goToQuiz}
            />
          )}

          {stage === 'quiz' && (
            <QuizScreen
              key="quiz"
              step={step}
              answers={answers}
              plainMode={plainMode}
              onSelect={handleSelect}
              onPlainModeChange={setPlainMode}
              onBack={() => {
                if (step === 0) setStage('industry');
                else setStep(s => s - 1);
              }}
              onNext={() => setStep(s => Math.min(s + 1, QUESTIONS.length - 1))}
              onFinish={goToResults}
            />
          )}

          {stage === 'results' && industry && (
            <ResultsScreen
              key="results"
              answers={answers}
              industry={industry}
              onRetake={handleRetake}
            />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
