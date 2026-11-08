import { sort } from "@/app/(publicGroup)/region/page";
import CategoryLists from "@/components/module/cetegory/create-category/category-lists";
import { CategoryModal } from "@/components/module/cetegory/create-category/category-modal";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import SearchBar from "@/shared/search-bar";
import { SortShow } from "@/shared/sort.show";

const AllCategoryPage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flxe flex-col space-y-6">
        <Header
          label="Category Manage"
          controls={
            <>
              <SortShow
                obj={sort}
                sortKey="name"
              />
              <ItemShow />
              <CategoryModal mode="create" />
            </>
          }
        />
        <CategoryLists />
      </div>
    </div>
  );
};

export default AllCategoryPage;
