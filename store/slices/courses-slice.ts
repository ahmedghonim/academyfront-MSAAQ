import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

import { Chapter, Content, Course, Product, Review } from "@/types";

export type CourseSliceStateType = {
  courseIsCompleted?: boolean;
  openRatingModal?: boolean;
  editingReview: Review | null;
  courseToReview: Course | null;
  productToReview: Product | null;
  percentageCompleted: number;
  toggleContentSideBar: boolean;
  error: any;
  status: "idle" | "loading" | "succeeded" | "failed";
  content: {
    prev: {
      chapter_id: number;
      content_id: number;
      is_first: boolean;
      prevable: boolean;
    };
    next: {
      chapter_id: number;
      content_id: number;
      is_last: boolean;
      nextable: boolean;
    };
  };
};

const initialState: CourseSliceStateType = {
  courseIsCompleted: false,
  openRatingModal: false,
  percentageCompleted: 0,
  toggleContentSideBar: false,
  error: null,
  courseToReview: null,
  productToReview: null,
  editingReview: null,
  status: "idle",
  content: {
    prev: {
      chapter_id: 0,
      content_id: 0,
      is_first: false,
      prevable: false
    },
    next: {
      chapter_id: 0,
      content_id: 0,
      is_last: false,
      nextable: false
    }
  }
};

export const CoursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourseIsCompleted(state, actions) {
      state.courseIsCompleted = actions.payload;
    },
    setOpenRatingModal(state, actions) {
      state.openRatingModal = actions.payload;
    },
    setEditingReview(state, actions) {
      state.editingReview = actions.payload;
    },
    setCourseToReview(state, actions) {
      state.courseToReview = actions.payload;
    },
    setProductToReview(state, actions) {
      state.productToReview = actions.payload;
    },
    setPercentageCompleted(state, actions) {
      const contentCompletedList: any[] = actions.payload?.chapters?.reduce(
        (contents: any | any, chapter: Chapter | any) => {
          if (chapter && chapter.contents) {
            const getContentCompleted = chapter?.contents?.filter((content: Content) => content.completed);

            return contents.concat(getContentCompleted);
          }

          return contents;
        },
        []
      );

      state.percentageCompleted = Math.floor((contentCompletedList?.length / actions.payload?.contents_count) * 100);
    },
    setContent(state, actions) {
      state.content = actions.payload;
    },
    setToggleContentSidebar(state, actions) {
      state.toggleContentSideBar = actions.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      return {
        ...state,
        ...action.payload[CoursesSlice.name]
      };
    });
  }
});
export const {
  setCourseIsCompleted,
  setOpenRatingModal,
  setEditingReview,
  setCourseToReview,
  setProductToReview,
  setPercentageCompleted,
  setToggleContentSidebar: setToggleCourseSidebar,
  setContent
} = CoursesSlice.actions;
export default CoursesSlice.reducer;
