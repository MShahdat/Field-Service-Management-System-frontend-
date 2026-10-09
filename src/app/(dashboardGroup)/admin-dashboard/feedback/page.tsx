import FeedbackLists from "@/components/module/feedback/feedback-lists";
import Header from "@/shared/header";

const FeedbackPage = () => {
  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flex flex-col space-y-6">
        <Header label="Feedbacks" />
        <FeedbackLists />
      </div>
    </div>
  );
};

export default FeedbackPage;
