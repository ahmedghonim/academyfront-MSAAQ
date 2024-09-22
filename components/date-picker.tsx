"use client";

import { useEffect, useState } from "react";

import { arSA } from "date-fns/locale";
import { DayPicker } from "react-day-picker";

import dayjs from "@/lib/dayjs";

type Props = {
  onChange: (date: Date | undefined) => void;
  onNavigate?: (date: Date) => void;
  numberOfMonths?: number;
  value: Date | undefined;
  className?: string;
  activeDays: string[];
};

const DatePicker = ({ onChange, value, className, numberOfMonths = 2, onNavigate, activeDays }: Props) => {
  const [selectedRange, setSelectedRange] = useState<Date>();

  useEffect(() => {
    setSelectedRange(value);
  }, [value]);

  const onRangeSelected = (range: Date | undefined) => {
    setSelectedRange(range);
    onChange(range);
  };

  const isDisabled = (date: Date) => {
    if (dayjs(date).isBefore(dayjs(), "day")) return true;

    return !activeDays?.includes(dayjs(date).format("YYYY-MM-DD"));
  };

  return (
    <div className="range-date-picker">
      <DayPicker
        className={className}
        mode="single"
        selected={selectedRange}
        disabled={isDisabled}
        onSelect={onRangeSelected}
        locale={arSA}
        dir="rtl"
        numberOfMonths={numberOfMonths}
        pagedNavigation
        month={selectedRange}
        fixedWeeks
        onMonthChange={(v) => {
          onNavigate?.(v);
        }}
      />
    </div>
  );
};

export default DatePicker;
