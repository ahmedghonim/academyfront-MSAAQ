import { createStore } from "zustand/vanilla";

import { APIFetchResponse, FetchErrorType } from "@/server-actions/config/base-query";
import { Comment } from "@/types";

export type CommentsState = {
  comments: Array<Comment> | null;
};

export type CommentsActions = {
  createComment: ({
    content,
    slug,
    chapterId,
    contentId
  }: {
    content: string;
    slug?: string;
    chapterId?: string;
    contentId?: string;
  }) => Promise<APIFetchResponse<Comment> | FetchErrorType>;

  createCommentReplay: ({
    content,
    slug,
    chapterId,
    contentId,
    comment_id
  }: {
    content: string;
    comment_id: string | number;
    slug?: string;
    chapterId?: string;
    contentId?: string;
  }) => Promise<APIFetchResponse<Comment> | FetchErrorType>;
  updateComment: ({
    content,
    comment_id,
    slug,
    chapterId,
    contentId
  }: {
    content: string;
    comment_id: string | number;
    slug?: string;
    chapterId?: string;
    contentId?: string;
  }) => Promise<APIFetchResponse<Comment> | FetchErrorType>;
  deleteComment: ({
    id,
    slug,
    chapterId,
    contentId
  }: {
    id: string | number;
    slug?: string;
    chapterId?: string;
    contentId?: string;
  }) => Promise<APIFetchResponse<Comment> | FetchErrorType>;
  setComments: (comment: Array<Comment>) => void;
  getComments: () => Array<Comment>;
};

export type CommentsStore = CommentsState & CommentsActions;

export const defaultInitState: CommentsStore = {
  comments: [],
  createComment: () => {
    throw new Error("createCommentMutation not set");
  },
  createCommentReplay: () => {
    throw new Error("createCommentReplayMutation not set");
  },
  updateComment: () => {
    throw new Error("updateCommentMutation not set");
  },
  deleteComment: () => {
    throw new Error("deleteCommentMutation not set");
  },
  setComments: () => {
    throw new Error("setCommentsMutation not set");
  },
  getComments: () => {
    throw new Error("getCommentsMutation not set");
  }
};

export const createCommentsStore = (
  initState: Omit<CommentsStore, "setComments" | "getComments"> = defaultInitState
) => {
  return createStore<CommentsStore>()((set, get) => ({
    ...initState,
    setComments: (comments) => {
      set({
        comments
      });
    },
    getComments: () => get().comments || []
  }));
};
