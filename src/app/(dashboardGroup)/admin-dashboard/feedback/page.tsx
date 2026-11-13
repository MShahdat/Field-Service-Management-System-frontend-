import FeedbackFilters from "@/components/module/feedback/feedback-filter";
import FeedbackLists from "@/components/module/feedback/feedback-lists";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import { SortShow } from "@/shared/sort.show";
import FilterBtn from "@/utils/filter.btn";


const sort = [
  { label: "Newest", value: "newest" },
  { label: "Rating Low < High", value: "asc" },
  { label: "Rating High > Low", value: "desc" },
];

const FeedbackPage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flex flex-col space-y-6">
        <Header
          label="Feedbacks"
          controls={
            <>
              <FilterBtn
                label="Feedback Filter"
                component={
                  <>
                    <FeedbackFilters />
                  </>
                }
              />
              <SortShow
                obj={sort}
                sortKey="rating"
              />
              <ItemShow />
            </>
          }
        />
        <FeedbackLists />
      </div>
    </div>
  );
};

export default FeedbackPage;
