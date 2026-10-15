import OtpPage from "@/components/forms/otp.form";
import Header from "@/components/module/auth/header";
import Link from "next/link";

export default function EmailVerifyPage() {
  return (
    <div>
      <Header />
      <div className="max-w-md mx-auto">
        <OtpPage />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected by FieldDesk secure verification
          <span className="mx-2 text-border">•</span>
          <Link href="/contact" className="underline-offset-4 hover:underline">
            Privacy
          </Link>
          <span className="mx-2 text-border">•</span>
          <Link href="/contact" className="underline-offset-4 hover:underline">
            Terms
          </Link>
        </p>
      </div>
    </div>
  );
}
