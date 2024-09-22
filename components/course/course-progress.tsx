"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { setPercentageCompleted } from "@/store/slices/courses-slice";
import { Course } from "@/types";

import { Progress } from "@msaaqcom/abjad";

const CourseProgress = ({ course }: { course: Course }) => {
  const { percentageCompleted } = useAppSelector((state) => state.courses);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPercentageCompleted(course));
  }, [course]);

  return (
    <Progress.Bar
      color="success"
      value={percentageCompleted}
    />
  );
};

export default CourseProgress;
