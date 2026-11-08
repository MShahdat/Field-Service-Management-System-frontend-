import { sort } from "@/app/(publicGroup)/region/page";
import TechnicianFilters from "@/components/module/technician/technician-filters";
import UserFilters from "@/components/module/user/user-filters";
import UserLists from "@/components/module/user/user-lists";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import { SortShow } from "@/shared/sort.show";
import FilterBtn from "@/utils/filter.btn";



const AllUserpage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flxe flex-col space-y-6">
        <Header
          label="Users Manage"
          controls={
            <>
              <FilterBtn
                label="User Filter"
                component={
                  <>
                    <UserFilters />
                  </>
                }
              />
              <SortShow
                obj={sort}
                sortKey="name"
              />
              <ItemShow />
            </>
          }
        />
        <UserLists />
      </div>
    </div>
  );
};

export default AllUserpage;
