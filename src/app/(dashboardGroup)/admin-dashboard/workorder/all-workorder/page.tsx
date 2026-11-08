import { sort } from "@/app/(publicGroup)/region/page";
import WorkorderLists from "@/components/module/workorder/workorder-lists";
import WorkOrderFilter from "@/components/module/workorder/workOrder.filter";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import FilterBtn from "@/utils/filter.btn";


export const STATUS_OPTIONS = [
  { label: "Schedule", value: "SCHEDULED" },
  { label: "En_Route", value: "EN_ROUTE" },
  { label: "Started", value: "STARTED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const AllWorkOrderpage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flex flex-col space-y-6">
        <Header
          label="All Work Orders"
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
        <WorkorderLists />
      </div>
    </div>
  );
};

export default AllWorkOrderpage;