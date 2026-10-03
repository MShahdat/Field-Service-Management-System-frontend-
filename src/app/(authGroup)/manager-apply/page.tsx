import { Logo } from "@/assets/logo";
import { ManagerApplyForm } from "@/components/forms/managerApply-form";

export default function ManagerApplyPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src={"/register.jpg"}
          alt="apply"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Logo />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ManagerApplyForm />
          </div>
        </div>
      </div>
    </div>
  );
}
