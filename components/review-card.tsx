import { Review } from "@/types";

import { Avatar, Card, Typography } from "@msaaqcom/abjad";

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <Card className="h-full w-full">
      <Card.Body className="flex h-full flex-col gap-4">
        <Typography.Text
          className="text-sm font-medium"
          children={review.content}
        />
        {review.user && (
          <div className="flex gap-4">
            <Avatar
              className="flex-shrink-0"
              imageUrl={review.user?.avatar}
              name={review.user?.name}
            />
            <Typography.Text
              className="text-base font-medium"
              children={review.user?.name}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
