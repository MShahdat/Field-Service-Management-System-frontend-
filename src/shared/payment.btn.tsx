import { redirect } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePaymentCreate } from "@/hooks";
import { cn } from "@/lib/utils";

const PaymentBtn = ({
  workOrderId,
  className,
  children,
  disabled = false,
}: {
  workOrderId: string;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}) => {
  const { mutate, isPending } = usePaymentCreate();

  const handlePay = () => {
    const data = {
      workOrderId,
    };
    console.log("payment data", data);
    mutate(data, {
      onSuccess: (res) => {
        redirect(`${res.data.bkashURL}`);
      },
      onError: (er) => {
        toast.error(er.message);
        return;
      },
    });
  };
  return (
    <Button
      disabled={disabled}
      variant={"accepted"}
      className={cn("flex-1", className)}
      onClick={() => {
        handlePay();
        console.log("clicked");
      }}
    >
      {isPending ? (
        <>
          <Spinner /> Payment
        </>
      ) : (
        (children ?? "Payment")
      )}
    </Button>
  );
};

export default PaymentBtn;
