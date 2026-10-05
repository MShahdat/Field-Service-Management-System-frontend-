import PendingManagerLists from "@/components/module/manager/manager-approval/manager-lists";
import { ItemShow } from "@/shared/items-show";
import SearchBar from "@/shared/search-bar";

const ApproveManagerPage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flex flex-col space-y-6">
        <div className="rounded-2xl border border-border bg-card px-4 sm:px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <p className="whitespace-nowrap text-lg sm:text-xl font-semibold">
                  Pending Managers
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
        <PendingManagerLists />
      </div>
    </div>
  );
};

export default ApproveManagerPage;
