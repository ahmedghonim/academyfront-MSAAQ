"use client";

import { useCallback } from "react";

import { BlockButtonField, PageBlock } from "@/types";
import { calculateDarkerColor, shouldColorBeBlack } from "@/utils";

import { Button } from "@msaaqcom/abjad";
import { ButtonVariantProps, cn } from "@msaaqcom/abjad/dist/theme";

import BaseSection, { justifyAlignment } from "./base-section";

const ExpressCheckoutButton = (props: any) => {
  return null;
};
const AddToCartButton = (props: any) => {
  return null;
};

export default function Cta({ block }: { block: PageBlock<"cta">; children?: React.ReactNode }) {
  const btns = useCallback(
    (
      btn: BlockButtonField
    ): {
      variant?: ButtonVariantProps["variant"];
      color?: ButtonVariantProps["color"];
    } => {
      if (btn.color === "link") {
        return {
          color: "primary",
          variant: "link"
        };
      }

      const colorMapping = {
        light: "gray",
        dark: "secondary"
      } as const;

      return {
        //@ts-expect-error
        color: !btn.color || btn.color?.includes("rgb") ? undefined : colorMapping[btn.color] || btn.color,
        variant: "solid"
      };
    },
    []
  );

  return (
    <BaseSection block={block}>
      <div className={cn("col-span-12 flex flex-wrap gap-3", justifyAlignment(block))}>
        {block.fields_values.buttons.map((button, index) => {
          let customButtonStyles = "";

          if (button.color?.includes("rgb")) {
            customButtonStyles = `
              .custom-button-${index} {
                background-color: ${button.color};
                border-color: ${button.color};
                color: ${shouldColorBeBlack(button.color) ? "black" : "white"};
              }
              .custom-button-${index}:hover {
                background-color: ${calculateDarkerColor(button.color, 20)};
              }
               .custom-button-${index}:active {
                background-color: ${calculateDarkerColor(button.color, 20)};
              }
              .custom-button-${index}:focus-visible {
                outline-color: ${button.color};
              }
            `;
          }

          return (
            <div key={index}>
              {customButtonStyles && <style>{customButtonStyles}</style>}

              {button.type === "add-to-cart" ? (
                <AddToCartButton
                  key={index}
                  product_id={button?.product?.split("-")[1] as string | number}
                  product_type={button?.product?.split("-")[0].toLowerCase() as "course" | "product"}
                  label={button.label}
                  {...btns(button)}
                  className={button.color?.includes("rgb") ? `custom-button-${index}` : ""}
                />
              ) : button.type === "checkout" ? (
                <ExpressCheckoutButton
                  key={index}
                  product_id={button?.product?.split("-")[1] as string | number}
                  product_type={button?.product?.split("-")[0].toLowerCase() as "course" | "product"}
                  label={button.label}
                  {...btns(button)}
                  className={button.color?.includes("rgb") ? `custom-button-${index}` : ""}
                />
              ) : (
                <Button
                  key={index}
                  {...btns(button)}
                  children={button.label}
                  href={button.type === "login-modal" ? "/login" : button.url ?? "#"}
                  target={button.target ?? "_self"}
                  className={button.color?.includes("rgb") ? `custom-button-${index}` : ""}
                />
              )}
            </div>
          );
        })}
      </div>
    </BaseSection>
  );
}
