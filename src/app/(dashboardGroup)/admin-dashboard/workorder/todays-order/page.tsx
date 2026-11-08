import TodayOrderLists from "@/components/module/workorder/todays-order-lists";
import WorkOrderFilter from "@/components/module/workorder/workOrder.filter";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import FilterBtn from "@/utils/filter.btn";


const STATUS_OPTIONS = [
  { label: "Schedule", value: "SCHEDULED" },
  { label: "En_Route", value: "EN_ROUTE" },
  { label: "Started", value: "STARTED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const TodaysOrderPage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flex flex-col space-y-6">
        <Header
          label="Todays Work Order"
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
        <TodayOrderLists />
      </div>
    </div>
  );
};

export default TodaysOrderPage;
