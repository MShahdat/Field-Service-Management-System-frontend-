'use client'

import { Button } from '../ui/button';
import { useOAuthLogin } from '@/hooks';

const FacebookIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#1877F2"
      d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07Z"
    />
    <path
      fill="#fff"
      d="M16.88 15.56l.53-3.49h-3.32V9.81c0-.96.46-1.89 1.96-1.89h1.5V4.95s-1.37-.24-2.68-.24c-2.74 0-4.54 1.68-4.54 4.7v2.66H7.29v3.49h3.04V24a12.1 12.1 0 0 0 3.75 0v-8.44h2.8Z"
    />
  </svg>
);

const FacebookAuth = ({ disabled }: { disabled?: boolean }) => {
  const { startOAuth } = useOAuthLogin();

  return (
    <Button
      variant="outline"
      type="button"
      disabled={disabled}
      onClick={() => startOAuth('facebook')}
      aria-label="Continue with Facebook"
      className="w-full"
    >
      <span className="flex items-center justify-center gap-2">
        <FacebookIcon />
        <span className="font-semibold">Facebook</span>
      </span>
    </Button>
  );
};

export default FacebookAuth;
