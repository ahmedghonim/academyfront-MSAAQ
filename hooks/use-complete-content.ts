"use client";

import { useParams } from "next/navigation";

import { useSession } from "@/providers/session-provider";
import { updateContent } from "@/server-actions/actions/content-actions";
import { APIFetchResponse, FetchErrorType, FetchReturnValue } from "@/server-actions/config/base-query";
import { setCourseIsCompleted } from "@/store/slices/courses-slice";
import { Content } from "@/types";

import { useAppDispatch } from "./redux";
import useResponseToastHandler from "./use-response-toast-handler";

const useCompleteContent = () => {
  const dispatch = useAppDispatch();
  const { member } = useSession();
  const query = useParams<{
    slug: string;
    chapterId: string;
    contentId: string;
  }>();
  const { displayErrors, displaySuccess } = useResponseToastHandler({});

  const complete = async (completed: boolean) => {
    if (member) {
      const contentStatus = (await updateContent({
        slug: query?.slug as string,
        chapterId: query?.chapterId as string,
        contentId: query?.contentId as string,
        data: {
          completed: completed
        }
      })) as APIFetchResponse<Content> | FetchErrorType;

      if (contentStatus.error || displayErrors(contentStatus)) {
        return false;
      }

      // if (contentStatus?.data?.code) {
      if (contentStatus) {
        dispatch(setCourseIsCompleted(true));
      } else {
        displaySuccess(contentStatus);
      }

      return true;
    }
  };

  return [complete] as const;
};

export default useCompleteContent;
