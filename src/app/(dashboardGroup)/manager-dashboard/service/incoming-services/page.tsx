
import { sort } from "@/app/(publicGroup)/region/page";
import IncomingServiceLists from "@/components/module/services/man-incomming-service-lists";
import ServiceFilter from "@/components/module/services/service.filter";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import { SortShow } from "@/shared/sort.show";
import FilterBtn from "@/utils/filter.btn";

const IncomingServicePage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flex flex-col space-y-6">
        <Header
          label="Incoming Services"
          controls={
            <>
              <FilterBtn
                label="Service Filter"
                component={
                  <>
                    <ServiceFilter />
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
        <IncomingServiceLists />
      </div>
    </div>
  );
};

export default IncomingServicePage;
