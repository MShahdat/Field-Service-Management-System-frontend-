
import { sort } from "@/app/(publicGroup)/region/page";
import RegionLists from "@/components/module/region/region-lists";
import { RegionModal } from "@/components/module/region/region-modal";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import { SortShow } from "@/shared/sort.show";

const AllRegionsPage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flxe flex-col space-y-6">
        <Header
          label="Region Manage"
          controls={
            <>
              <SortShow
                obj={sort}
                sortKey="area"
              />
              <ItemShow />
              <RegionModal mode="create" />
            </>
          }
        />
        <RegionLists />
      </div>
    </div>
  );
};

export default AllRegionsPage;
