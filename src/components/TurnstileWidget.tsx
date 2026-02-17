import { useCallback, useRef, useState } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

const TOKEN_LIFETIME_MS = 300_000; // 300s per Cloudflare docs
const REFRESH_BUFFER_MS = 5_000;

export function useTurnstile() {
  const [token, setToken] = useState<string>();
  const tokenObtainedAt = useRef<number>(0);
  const ref = useRef<TurnstileInstance>(null);

  const onSuccess = useCallback((t: string) => {
    setToken(t);
    tokenObtainedAt.current = Date.now();
  }, []);

  const resetToken = useCallback(() => {
    setToken(undefined);
    tokenObtainedAt.current = 0;
    ref.current?.reset();
  }, []);

  const ensureFreshToken = useCallback(async (): Promise<
    string | undefined
  > => {
    const age = Date.now() - tokenObtainedAt.current;
    const isStale =
      !ref.current?.getResponse() ||
      ref.current?.isExpired() ||
      age >= TOKEN_LIFETIME_MS - REFRESH_BUFFER_MS;

    if (isStale) {
      setToken(undefined);
      tokenObtainedAt.current = 0;
      ref.current?.reset();
      try {
        return await ref.current?.getResponsePromise(60_000);
      } catch {
        return undefined;
      }
    }

    return ref.current?.getResponse();
  }, []);

  return {
    token,
    ref,
    onSuccess,
    onExpire: resetToken,
    onError: resetToken,
    ensureFreshToken,
    resetToken,
  };
}

export type UseTurnstileReturn = ReturnType<typeof useTurnstile>;

interface TurnstileWidgetProps {
  id: string;
  siteKey: string;
  turnstile: UseTurnstileReturn;
  className?: string;
}

export default function TurnstileWidget({
  id,
  siteKey,
  turnstile,
  className,
}: TurnstileWidgetProps) {
  return (
    <Turnstile
      ref={turnstile.ref}
      id={id}
      siteKey={siteKey}
      onSuccess={turnstile.onSuccess}
      onExpire={turnstile.onExpire}
      onError={turnstile.onError}
      options={{
        size: 'flexible',
        theme: 'light',
      }}
      className={className}
    />
  );
}
