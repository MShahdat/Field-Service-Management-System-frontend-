'use client'

import { Button } from '../ui/button';
import { useOAuthLogin } from '@/hooks';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.76c1.76 0 3.34.6 4.58 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.1C6.22 6.87 8.87 4.76 12 4.76Z"
    />
  </svg>
);

const GoogleAuth = ({ disabled }: { disabled?: boolean }) => {
  const { startOAuth } = useOAuthLogin();

  // console.log('google', startOAuth)

  return (
    <Button
      variant="outline"
      type="button"
      disabled={disabled}
      onClick={() => startOAuth('google')}
      aria-label="Continue with Google"
      className="w-full"
    >
      <span className="flex items-center justify-center gap-2">
        <GoogleIcon />
        <span className="font-semibold">Google</span>
      </span>
    </Button>
  );
};

export default GoogleAuth;
