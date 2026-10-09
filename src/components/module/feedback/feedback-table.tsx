import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IFeedback } from "@/types";
import { formatDateTime } from "../customer-service/details-util";

type Props = {
  feedbacks: IFeedback[];
};

const FeedbackTeable = ({ feedbacks }: Props) => {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">No</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Feedback At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((feedback: IFeedback, idx: number) => {
              return (
                <TableRow key={feedback.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>
                    {feedback.workOrder.service.category.name ?? "-"}
                  </TableCell>
                  <TableCell>{feedback.rating ?? "0"}</TableCell>
                  <TableCell>{feedback.comment ?? "-"}</TableCell>
                  <TableCell>{formatDateTime(feedback.createdAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FeedbackTeable;
