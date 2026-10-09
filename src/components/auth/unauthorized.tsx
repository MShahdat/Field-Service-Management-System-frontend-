import { ShieldAlert } from "lucide-react";
import Link from "next/link";

const UnauthorizedPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="p-3 bg-red-200 rounded-full">
          <ShieldAlert className="text-red-500 size-7" />
        </div>
        <div className="">
          <p className="text-red-600">You do not access to this component </p>
          <p className="text-sm">
            Go back{" "}
            <Link href={"/"} className="underline">
              Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
