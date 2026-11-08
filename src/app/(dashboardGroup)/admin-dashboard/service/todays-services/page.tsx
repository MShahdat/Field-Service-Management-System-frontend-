import { sort } from "@/app/(publicGroup)/region/page";
import TodaysServiceLists from "@/components/module/services/adm-todays-service-lists";
import ServiceFilter, { STATUS_OPTIONS } from "@/components/module/services/service.filter";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import { SortShow } from "@/shared/sort.show";
import FilterBtn from "@/utils/filter.btn";


const page = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flex flex-col space-y-6">
        <Header
          label="Todays Service"
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

export default page;
