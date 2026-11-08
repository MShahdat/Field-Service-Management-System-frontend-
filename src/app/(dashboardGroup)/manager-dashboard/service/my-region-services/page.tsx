
import { sort } from "@/app/(publicGroup)/region/page";
import ServiceLists from "@/components/module/services/man-service-region-lists";
import ServiceFilter from "@/components/module/services/service.filter";

import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import { SortShow } from "@/shared/sort.show";
import FilterBtn from "@/utils/filter.btn";


export const STATUS_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "In_Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
]

const MyRegionServices = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flex flex-col space-y-6">
        <Header
          label="My Region Services"
          controls={
            <>
              <FilterBtn
                label="Service Filter"
                component={
                  <>
                    <ServiceFilter obj={STATUS_OPTIONS} />
                  </>
                }
              />
              <SortShow
                sortKey="title"
                obj={sort}
              />
              <ItemShow />
            </>
          }
        />
        <ServiceLists />
      </div>
    </div>
  );
};

export default MyRegionServices;
