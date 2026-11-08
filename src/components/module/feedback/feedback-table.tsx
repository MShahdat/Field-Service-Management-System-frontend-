import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IFeedback, Meta } from "@/types";
import { formatDateTime } from "../services/details-util";

type Props = {
  feedbacks: IFeedback[];
  meta?: Meta
};

const FeedbackTable = ({ feedbacks, meta }: Props) => {
  const startIndex = ((meta?.page ?? 1) - 1) * ((meta?.limit ?? feedbacks.length) || 1) + 1

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">No</TableHead>
              <TableHead>Service Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Feedback At</TableHead>
              <TableHead>Last Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((feedback: IFeedback, idx: number) => {
              return (
                <TableRow key={feedback.id}>
                  <TableCell className="font-medium">{idx + startIndex}</TableCell>
                  <TableCell>
                    {feedback.workOrder.service.title ?? "-"}
                  </TableCell>
                  <TableCell>
                    {feedback.workOrder.service.category.name ?? "-"}
                  </TableCell>
                  <TableCell>{feedback.rating ?? "0"}</TableCell>
                  <TableCell>{feedback.comment ?? "-"}</TableCell>
                  <TableCell>{formatDateTime(feedback.createdAt)}</TableCell>
                  <TableCell>{formatDateTime(feedback.updatedAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FeedbackTable;
