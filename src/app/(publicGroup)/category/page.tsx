import PublicCategoryLists from "@/components/module/cetegory/pub-category-list";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import { SortShow } from "@/shared/sort.show";
import { sort } from "../region/page";


const CategoryPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-background">
      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 space-y-4">
        <Header
          label="Category"
          controls={
            <>
              <SortShow sortKey="name" obj={sort} />
              <ItemShow />
            </>
          }
        />
        <PublicCategoryLists />
      </section>
    </div>
  );
};

export default CategoryPage;