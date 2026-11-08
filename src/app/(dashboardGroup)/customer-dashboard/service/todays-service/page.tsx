
import TodaysServiceLists from "@/components/module/services/cus-today-service-lists";
import Header from "@/shared/header";
import { SortShow } from "@/shared/sort.show";
import { sort } from "@/app/(publicGroup)/region/page";
import { ItemShow } from "@/shared/items-show";
import FilterBtn from "@/utils/filter.btn";
import ServiceFilter, { STATUS_OPTIONS } from "@/components/module/services/service.filter";

const TodaysServicesPage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flxe flex-col space-y-6">
        <Header
          label="Todays Services"
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
        <TodaysServiceLists />
      </div>
    </div>
  );
};

export default TodaysServicesPage;
