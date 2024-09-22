"use client";

import { Fragment } from "react";

import { PageBlock } from "@/types";
import { calculateDarkerColor, shouldColorBeBlack } from "@/utils";

import { Button } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

import BaseSection, { justifyAlignment } from "./base-section";

const ExpressCheckoutButton = (props: any) => {
  return null;
};
const AddToCartButton = (props: any) => {
  return null;
};
type ColorVariant =
  | "primary"
  | "secondary"
  | "warning"
  | "success"
  | "danger"
  | "info"
  | "gray"
  | "gradient"
  | undefined;

export default function ImageOrVideo({ block }: { block: PageBlock<"image" | "video"> }) {
  return (
    <BaseSection
      block={block}
      renderExtraContent={
        block.fields_values.buttons &&
        block.fields_values.buttons.length > 0 && (
          <div className={cn("col-span-12 mt-4 flex flex-wrap gap-2", justifyAlignment(block))}>
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
                <Fragment key={index}>
                  {customButtonStyles && <style>{customButtonStyles}</style>}

                  {button.type === "add-to-cart" ? (
                    <AddToCartButton
                      key={index}
                      product_id={button?.product?.split("-")[1] as string | number}
                      product_type={button?.product?.split("-")[0].toLowerCase() as "course" | "product"}
                      label={button.label}
                      color={!button.color?.includes("rgb") ? (button.color as ColorVariant) : undefined}
                      className={button.color?.includes("rgb") ? `custom-button-${index}` : ""}
                    />
                  ) : button.type === "checkout" ? (
                    <ExpressCheckoutButton
                      key={index}
                      product_id={button?.product?.split("-")[1] as string | number}
                      product_type={button?.product?.split("-")[0].toLowerCase() as "course" | "product"}
                      label={button.label}
                      color={!button.color?.includes("rgb") ? (button.color as ColorVariant) : undefined}
                      className={button.color?.includes("rgb") ? `custom-button-${index}` : ""}
                    />
                  ) : (
                    <Button
                      key={index}
                      color={!button.color?.includes("rgb") ? (button.color as ColorVariant) : undefined}
                      children={button.label}
                      href={button.type === "login-modal" ? "/login" : button.url ?? "#"}
                      target={button.target ?? "_self"}
                      className={button.color?.includes("rgb") ? `custom-button-${index}` : ""}
                    />
                  )}
                </Fragment>
              );
            })}
          </div>
        )
      }
    ></BaseSection>
  );
}
