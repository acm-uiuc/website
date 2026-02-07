import { useEffect, useState } from 'preact/hooks';

interface TypewriterHeroProps {
  messages: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterTyping?: number;
  pauseAfterDeleting?: number;
}
function shuffleExceptLast<T>(arr: T[]): T[] {
  if (arr.length <= 1) {
    return arr;
  }

  const result = [...arr];
  const lastIndex = result.length - 1;

  // Fisher-Yates shuffle on all elements except the last
  for (let i = lastIndex - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return [...result.slice(0, 3), result[result.length - 1]];
}
export default function TypewriterHero({
  messages,
  typingSpeed = 55,
  deletingSpeed = 40,
  pauseAfterTyping = 800,
  pauseAfterDeleting = 150,
}: TypewriterHeroProps) {
  const [shuffledMessages] = useState(() => shuffleExceptLast(messages));
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      // Show final message immediately
      setCurrentText(messages[messages.length - 1]);
      setIsComplete(true);
      return;
    }

    if (isComplete) {
      return;
    }

    const currentMessage = shuffledMessages[currentMessageIndex];
    const isLastMessage = currentMessageIndex === shuffledMessages.length - 1;

    if (isPaused) {
      const pauseDuration = isTyping ? pauseAfterTyping : pauseAfterDeleting;
      const timer = setTimeout(() => {
        setIsPaused(false);
        if (isTyping && isLastMessage) {
          setIsComplete(true);
        } else if (!isTyping) {
          setCurrentMessageIndex((prev) => prev + 1);
          setIsTyping(true);
        } else {
          setIsTyping(false);
        }
      }, pauseDuration);
      return () => clearTimeout(timer);
    }

    if (isTyping) {
      if (currentText.length < currentMessage.length) {
        const timer = setTimeout(() => {
          setCurrentText(currentMessage.slice(0, currentText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timer);
      }
      setIsPaused(true);
    } else {
      if (currentText.length > 0) {
        const timer = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deletingSpeed);
        return () => clearTimeout(timer);
      }
      setIsPaused(true);
    }
  }, [
    currentText,
    currentMessageIndex,
    isTyping,
    isPaused,
    isComplete,
    messages,
    typingSpeed,
    deletingSpeed,
    pauseAfterTyping,
    pauseAfterDeleting,
  ]);

  return (
    <span class="text-tangerine-400 inline-flex">
      {currentText}
      <span class="animate-blink ml-1" aria-hidden="true">
        |
      </span>
    </span>
  );
}
