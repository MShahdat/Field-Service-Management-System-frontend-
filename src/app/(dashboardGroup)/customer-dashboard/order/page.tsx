
import OrderLists from "@/components/module/workorder/cus-order-lists";
import WorkOrderFilter from "@/components/module/workorder/workOrder.filter";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import FilterBtn from "@/utils/filter.btn";
import { STATUS_OPTIONS } from "../../admin-dashboard/workorder/all-workorder/page";

const OrderPage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flxe flex-col space-y-6">
        <Header
          label="My Orders"
          controls={
            <>
              <FilterBtn
                label="Work Order Filter"
                component={
                  <>
                    <WorkOrderFilter STATUS_OPTIONS={STATUS_OPTIONS} />
                  </>
                }
              />
              <ItemShow />
            </>
          }
        />
        <OrderLists />
      </div>
    </div>
  );
};

export default OrderPage;
