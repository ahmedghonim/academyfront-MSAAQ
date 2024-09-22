"use client";

import { createContext, useContext, useState } from "react";

import { create } from "zustand";

type NavigationItem = {
  chapter_id: number;
  content_id: number;
  is_first?: boolean;
  is_last?: boolean;
  prevable?: boolean;
  nextable?: boolean;
};

type ContentNavigation = {
  prev: NavigationItem;
  next: NavigationItem;
};
const createStore = (content: ContentNavigation) =>
  create<{
    content: ContentNavigation;
    setContent: (content: ContentNavigation) => void;
  }>((set) => ({
    content,
    setContent(content: ContentNavigation) {
      set({ content });
    }
  }));

const ContentContext = createContext<ReturnType<typeof createStore> | null>(null);

export const useContent = () => {
  if (!ContentContext) throw new Error("useContent must be used within a ContentProvider");

  return useContext(ContentContext)!;
};

const ContentProvider = ({ content, children }: { content: ContentNavigation; children: React.ReactNode }) => {
  const [store] = useState(() => createStore(content));

  return <ContentContext.Provider value={store}>{children}</ContentContext.Provider>;
};

export default ContentProvider;
