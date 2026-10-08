import PaymentLists from "@/components/module/payment/payment-lists";
import Header from "@/shared/header";

const PaymentPage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flex flex-col space-y-6">
        <Header label="Payments" />
        <PaymentLists />
      </div>
    </div>
  );
};

export default PaymentPage;
