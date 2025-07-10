// components/SpinUpStatus.tsx
import { useState, useEffect } from 'react';
import { Loader2, Wifi, WifiOff } from 'lucide-react';

interface SpinUpStatusProps {
  isSpinningUp: boolean;
  attempt?: number;
  onDismiss?: () => void;
}

export function SpinUpStatus({ isSpinningUp, attempt = 0, onDismiss }: SpinUpStatusProps) {
  const [dots, setDots] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!isSpinningUp) return;

    const startTime = Date.now();

    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Time counter
    const timeInterval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(timeInterval);
    };
  }, [isSpinningUp]);

  if (!isSpinningUp) return null;

  const getEstimatedTime = () => {
    if (timeElapsed < 30) return "30-60 seconds";
    if (timeElapsed < 60) return "About 1 minute";
    if (timeElapsed < 120) return "1-2 minutes";
    return "A few more minutes";
  };

  const getIcon = () => {
    if (timeElapsed < 10) return <WifiOff className="w-5 h-5 text-orange-500" />;
    if (timeElapsed < 60) return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    return <Wifi className="w-5 h-5 text-yellow-500" />;
  };

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">
            Service Starting Up{dots}
          </h4>
          <p className="text-gray-600 text-xs mt-1">
            The server was idle and is now spinning back up. This usually takes {getEstimatedTime()}.
          </p>
          {attempt > 0 && (
            <p className="text-blue-600 text-xs mt-1">
              Retry attempt {attempt}...
            </p>
          )}
          <div className="mt-2 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min((timeElapsed / 90) * 100, 100)}%`
              }}
            />
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Time elapsed: {timeElapsed}s
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

// Hook to use the spin-up status
export function useSpinUpStatus() {
  const [isSpinningUp, setIsSpinningUp] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const handleSpinUp = () => {
    setIsSpinningUp(true);
    setAttempt(0);
  };

  const handleRetry = (attemptNumber: number) => {
    setAttempt(attemptNumber);
  };

  const handleSuccess = () => {
    setIsSpinningUp(false);
    setAttempt(0);
  };

  const dismiss = () => {
    setIsSpinningUp(false);
  };

  return {
    isSpinningUp,
    attempt,
    handleSpinUp,
    handleRetry,
    handleSuccess,
    dismiss
  };
}
