import IncomingOrderLists from "@/components/module/workorder/incoming-order-lists";
import WorkOrderFilter from "@/components/module/workorder/workOrder.filter";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import SearchBar from "@/shared/search-bar";
import FilterBtn from "@/utils/filter.btn";

const IncomingOrderPage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flex flex-col space-y-6">
        <Header
          label="Imcoming Orders"
          controls={
            <>
              <FilterBtn
                label="Work Order Filter"
                component={
                  <>
                    <WorkOrderFilter />
                  </>
                }
              />
              <ItemShow />
            </>
          }
        />
        <IncomingOrderLists />
      </div>
    </div>
  );
};
export default IncomingOrderPage;
