import PaymentLists from "@/components/module/payment/payment-lists";
import PaymentFilter from "@/components/module/payment/payment.filter";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import { SortShow } from "@/shared/sort.show";
import FilterBtn from "@/utils/filter.btn";

const sort = [
  { label: "Newest", value: "newest" },
  { label: "Amount Low < High", value: "asc" },
  { label: "Amount High > Low", value: "desc" },
];

const MyPaymentPage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flxe flex-col space-y-6">
        <Header
          label="Payments"
          controls={
            <>
              <FilterBtn
                label="Payment Filter"
                component={
                  <>
                    <PaymentFilter />
                  </>
                }
              />
              <SortShow
                sortKey="amount"
                obj={sort}
              />
              <ItemShow />
            </>
          }
        />
        <PaymentLists />
      </div>
    </div>
  );
};

export default MyPaymentPage;
