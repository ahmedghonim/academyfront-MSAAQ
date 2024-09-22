"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";

import { useStore } from "zustand";

import { type CommentsStore, createCommentsStore } from "@/components/store/comments-store";

export type CommentsStoreApi = ReturnType<typeof createCommentsStore>;

export const CommentsStoreContext = createContext<CommentsStoreApi | undefined>(undefined);

export interface CommentsStoreProviderProps extends Omit<CommentsStore, "setComments" | "getComments"> {
  children: ReactNode;
}

export const CommentsStoreProvider = ({ children, ...store }: CommentsStoreProviderProps) => {
  const storeRef = useRef<CommentsStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createCommentsStore(store);
  }

  return <CommentsStoreContext.Provider value={storeRef.current}>{children}</CommentsStoreContext.Provider>;
};

export const useCommentsStore = <T,>(selector: (store: CommentsStore) => T): T => {
  const commentsStoreContext = useContext(CommentsStoreContext);

  if (!commentsStoreContext) {
    throw new Error(`useCommentsStore must be used within CommentsStoreProvider`);
  }

  return useStore(commentsStoreContext, selector);
};
