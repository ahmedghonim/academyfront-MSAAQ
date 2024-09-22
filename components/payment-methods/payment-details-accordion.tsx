"use client";

import React, { FC, ReactNode } from "react";

import { PaymentLogos } from "@/ui/images";

import { Typography } from "@msaaqcom/abjad";

interface AccordionProps {
  children: ReactNode;
  payment_logo?: string[];
  name: string;
  title: string;
  id: string;
}

const PaymentDetailsAccordion: FC<AccordionProps> = ({ children, name, id, payment_logo, title }: AccordionProps) => {
  return (
    <div className="flex flex-col rounded-lg border border-gray-300">
      <input
        type="radio"
        name={name}
        id={id}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className="group !mt-0 cursor-pointer p-4"
      >
        <div className="flex justify-between gap-4">
          <div className="flex w-full">
            <div className="flex flex-grow flex-row justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-5 w-5 rounded-full border-2 border-gray-600 peer-checked:group-[]:border-[6px] peer-checked:group-[]:border-primary" />
                <Typography.Text size="xs">{title}</Typography.Text>
              </div>
              <PaymentLogos
                methods={payment_logo}
                bordered
              />
            </div>
          </div>
        </div>
      </label>
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-150 ease-linear peer-checked:grid-rows-[1fr]">
        {children}
      </div>
    </div>
  );
};

export default PaymentDetailsAccordion;
