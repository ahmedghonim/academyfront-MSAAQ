"use client";

import { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import StarsRating from "@/components/stars-rating";
import { useAppDispatch, useAppSelector, useResponseToastHandler } from "@/hooks";
import { FetchErrorType, FetchReturnValue } from "@/server-actions/config/base-query";
import { useCreateReviewMutation, useUpdateReviewMutation } from "@/store/slices/api/reviewSlice";
import { setEditingReview, setOpenRatingModal } from "@/store/slices/courses-slice";
import { Course, Product, Review, getProductType } from "@/types";

import { Button, Form, Modal } from "@msaaqcom/abjad";

interface IFormInputs {
  content: string;
  rating: number;
}

interface Props {
  product: Course | Product;
  callback?: (_: Review) => void;
  title?: string;
}

const RateProductModal = ({ product, title, callback }: Props) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { editingReview: review, openRatingModal } = useAppSelector((state) => state.courses);

  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const schema = yup.object().shape({
    content: yup.string().required(),
    rating: yup.number().required()
  });

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { isDirty, isSubmitting, isValid }
  } = useForm<IFormInputs>({
    defaultValues: {
      content: "",
      rating: 0
    },
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (review) {
      reset({
        content: review.content,
        rating: review.rating
      });
    }
  }, [review]);

  const { displayErrors, displaySuccess } = useResponseToastHandler({ setError });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const response = (await (review
      ? updateReview({
          id: review.id,
          rating: data.rating,
          content: data.content
        })
      : createReview({
          content: data.content,
          rating: data.rating,
          relation_id: product.id,
          relation_type: getProductType(product)
        }))) as FetchReturnValue<any, FetchErrorType>;

    if (displayErrors(response)) return;

    if (!response.data) return;

    displaySuccess(
      response as FetchReturnValue<
        {
          message?: { title?: string; body: string };
        },
        FetchErrorType
      >
    );

    if (response.data) {
      callback?.(response.data.data);
    }
    reset({
      content: "",
      rating: 0
    });
    dispatch(setOpenRatingModal(false));
    dispatch(setEditingReview(null));
  };

  return (
    <>
      <Modal
        open={openRatingModal}
        onDismiss={() => {
          dispatch(setOpenRatingModal(false));
          dispatch(setEditingReview(null));
        }}
        bordered
      >
        <Modal.Header
          dismissible
          title={title ?? t("reviews.review_course")}
        />
        <Modal.Body className="grid gap-8">
          <Controller
            render={({ field: { value, onChange } }) => (
              <StarsRating
                value={value}
                onChange={onChange}
                className="justify-center"
              />
            )}
            name="rating"
            control={control}
          />

          <Controller
            render={({ field }) => (
              <Form.Textarea
                id="content"
                isRequired
                label={t(review ? "reviews.review_content" : "reviews.review_input_label")}
                placeholder={t("reviews.review_input_placeholder")}
                rows={5}
                {...field}
              />
            )}
            name="content"
            control={control}
          />
        </Modal.Body>
        <Modal.Footer className="flex justify-between">
          <Button
            type="submit"
            color="primary"
            variant="solid"
            onPress={() => handleSubmit(onSubmit)()}
            isDisabled={!isDirty || isSubmitting || !isValid}
            children={t(review ? "common.save_modifications" : "reviews.add_review")}
          />
          <Button
            color="gray"
            variant="solid"
            onPress={() => {
              dispatch(setOpenRatingModal(false));
              dispatch(setEditingReview(null));
            }}
            children={t("common.cancel")}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RateProductModal;
