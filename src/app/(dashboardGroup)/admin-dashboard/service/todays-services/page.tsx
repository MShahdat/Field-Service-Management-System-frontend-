import TodaysServiceLists from "@/components/module/services/adm-todays-service-lists";
import { ItemShow } from "@/shared/items-show";
import SearchBar from "@/shared/search-bar";

const page = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flex flex-col space-y-6">
        <div className="rounded-2xl border border-border bg-card px-4 sm:px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <p className="whitespace-nowrap text-lg sm:text-xl font-semibold">
                  Todays Services
                </p>
                <SearchBar />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="whitespace-nowrap">Show</span>
                <ItemShow />
              </div>
            </div>
          </div>
        </div>
        <TodaysServiceLists />
      </div>
    </div>
  );
};

export default page;
