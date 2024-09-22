"use client";

import { Dispatch, SetStateAction, useMemo } from "react";

import { revalidateTag } from "next/cache";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { CommentItem } from "@/components/comments";
import { useConfirmableDelete } from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { tags } from "@/server-actions/config/tags";
import { useDeleteReviewMutation } from "@/store/slices/api/reviewSlice";
import { AnyObject, Review } from "@/types";

import { EllipsisHorizontalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

import { Avatar, Badge, Button, Card, Dropdown, Icon, Title, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface Props {
  review: Review;
  queryParams?: AnyObject;
  setCanReview?: Dispatch<SetStateAction<boolean>>;
}

const ProductReviewCard = ({ review, queryParams, setCanReview }: Props) => {
  const t = useTranslations();

  const { member } = useSession();

  const [confirmableDelete] = useConfirmableDelete({
    action: useDeleteReviewMutation
  });

  const isReviewOwnedByAuthMember = useMemo<boolean>(() => true, [review, member]);

  const displayConfirmableDeleteModal = () => {
    return confirmableDelete({
      id: review.id,
      title: t("reviews.delete_review"),
      description: t("reviews.verify_delete_alert_description"),
      okLabel: t("reviews.verify_delete_alert_confirm"),
      callback: () => {
        setCanReview && setCanReview(true);
        revalidateTag(tags.fetchReviews(queryParams?.relation_type, queryParams?.relation_slug));
        revalidateTag(tags.fetchReviewsDistribution(queryParams?.relation_type, queryParams?.relation_slug));
      }
    });
  };

  return (
    <Card className="mb-4 last:mb-0">
      <Card.Body
        className={cn(
          "!px-6 !pb-4 !pt-6",
          review.replies.length > 0 &&
            "after:absolute after:right-10 after:top-16 after:h-[calc(100%_-_160px)] after:border-r-2 after:border-dashed after:border-gray"
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          {review.user && (
            <Title
              prepend={
                <Avatar
                  size="lg"
                  imageUrl={review.user.avatar}
                  name={review.user.name}
                />
              }
              title={
                <Typography.Body
                  as="h6"
                  size="base"
                  className="font-medium"
                >
                  {review.user.name}
                </Typography.Body>
              }
              subtitle={
                <Typography.Body
                  size="md"
                  className="font-normal text-gray-700"
                  children={dayjs(review.created_at).fromNow(false)}
                />
              }
            />
          )}
          <div className="flex items-center gap-2">
            <Badge
              icon={
                <Icon color="warning">
                  <StarIcon />
                </Icon>
              }
              color="gray"
              rounded="full"
              children={`${review.rating}.0`}
            />
            {isReviewOwnedByAuthMember && (
              <Dropdown>
                <Dropdown.Trigger>
                  <Button
                    color="gray"
                    size="sm"
                    icon={
                      <Icon size="md">
                        <EllipsisHorizontalIcon />
                      </Icon>
                    }
                  />
                </Dropdown.Trigger>
                <Dropdown.Menu>
                  <Dropdown.Item
                    children={
                      <Typography.Body
                        size="md"
                        className="text-danger"
                        children={t("reviews.delete_review")}
                      />
                    }
                    icon={
                      <Icon size="sm">
                        <TrashIcon />
                      </Icon>
                    }
                    className="text-danger"
                    onClick={displayConfirmableDeleteModal}
                  />
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
        <div className={cn(review.replies.length > 0 && "ms-16")}>
          <Typography.Body
            as="p"
            size="md"
            className="font-normal text-gray-800"
            children={review.content}
          />
        </div>
        {review.replies.map((replay) => (
          <div
            key={replay.id}
            className="relative ms-16 mt-4 after:absolute after:-right-10 after:top-4 after:z-[1] after:h-[calc(100%_-_100px)] after:w-10 after:border-b-2 after:border-dashed after:border-gray"
          >
            <CommentItem comment={replay} />
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default ProductReviewCard;
