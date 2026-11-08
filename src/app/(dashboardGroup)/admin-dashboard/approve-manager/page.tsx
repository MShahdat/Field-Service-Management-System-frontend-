
import PendingManagerLists from "@/components/module/manager/manager-approval/manager-lists";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";

const ApproveManagerPage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flex flex-col space-y-6">
        <Header
          label="Pending Managers"
          controls={
            <>
              <ItemShow />
            </>
          }
        />
        <PendingManagerLists />
      </div>
    </div>
  );
};

export default ApproveManagerPage;
