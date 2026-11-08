
import { sort } from "@/app/(publicGroup)/region/page";
import MyServiceLists from "@/components/module/services/cus-service-lists";
import { MyServiceModal } from "@/components/module/services/cus-service-modal";
import ServiceFilter, { STATUS_OPTIONS } from "@/components/module/services/service.filter";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import { SortShow } from "@/shared/sort.show";
import FilterBtn from "@/utils/filter.btn";

const MyServicesPage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flxe flex-col space-y-6">
        <Header
          label="My Services"
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
              <MyServiceModal mode="create" />
            </>
          }
        />

        <MyServiceLists />
      </div>
    </div>
  );
};

export default MyServicesPage;
