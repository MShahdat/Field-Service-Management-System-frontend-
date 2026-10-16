import { Logo } from "@/assets/logo";
import LoginForm from "@/components/forms/login-form";
import OneClickLogin, {
  type DemoAccount,
} from "@/components/module/auth/one-click-login";

const buildDemoAccounts = (): DemoAccount[] => {
  const candidates = [
    {
      label: process.env.SUPER_ADMIN_NAME ?? "Super Admin",
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD,
    },
    {
      label: process.env.TESTER_ADMIN_NAME ?? "Tester Admin",
      email: process.env.TESTER_ADMIN_EMAIL,
      password: process.env.TESTER_ADMIN_PASSWORD,
    },
    {
      label: process.env.TESTER_MANAGER_NAME ?? "Tester Manager",
      email: process.env.TESTER_MANAGER_EMAIL,
      password: process.env.TESTER_MANAGER_PASSWORD,
    },
  ];

  return candidates.filter((account): account is DemoAccount =>
    Boolean(account.email && account.password),
  );
};

export default function LoginPage() {
  const demoAccounts = buildDemoAccounts();

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src={"/login.jpg"}
          alt="login"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 px-6 py-4">
        <Logo />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-4">
            <OneClickLogin accounts={demoAccounts} />
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
