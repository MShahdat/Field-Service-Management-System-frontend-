
import PubRegionLists from "@/components/module/region/pub-region-lists";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import { SortShow } from "@/shared/sort.show";

export const metadata = {
  title: "Service regions | FieldDesk",
  description:
    "Browse the service areas covered by FieldDesk managers and technicians.",
};

export const sort = [
  { label: "Newest", value: "newest" },
  { label: "Alphabatic Order", value: "asc" },
  { label: "Alphabatic Reverse", value: "desc" },
];


const RegionPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-background">
      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 space-y-4">
        <Header
          label="Regions"
          controls={
            <>
              <SortShow
                key="sort"
                obj={sort}
                sortKey="area"
              />
              <ItemShow />
            </>
          }
        />
        <PubRegionLists />
      </section>
    </div>
  );
};

export default RegionPage;
