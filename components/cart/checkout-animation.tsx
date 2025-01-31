"use client";

import { ReactNode, useEffect, useRef } from "react";

import { useMountTransition } from "@/hooks";

import { cn } from "@msaaqcom/abjad/dist/theme";

const CheckoutAnimation = ({ show, children }: { show: boolean; children?: ReactNode }) => {
  const isTransitioning = useMountTransition(show, 300);
  const bodyRef = useRef(document.body);

  useEffect(() => {
    const updatePageScroll = () => {
      if (show) {
        bodyRef.current.style.overflow = "hidden";
      } else {
        bodyRef.current.style.overflow = "";
      }
    };

    updatePageScroll();
  }, [show]);

  const handleKeyDown = (event: KeyboardEvent) => {
    const isTabPressed = event.key === "Tab" || event.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    event.preventDefault();
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isTransitioning && !show) {
    return null;
  }

  return (
    <div
      tabIndex={0}
      aria-hidden={show ? "false" : "true"}
      className={cn("checkout-animation", show && "open", isTransitioning && "in")}
    >
      <div
        className="child"
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          margin: "auto",
          position: "absolute",
          inset: 0,
          zIndex: 9999
        }}
      >
        <div
          style={{
            backgroundImage: "url('/images/msaaq-logo.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "fit-content",
            display: "flex"
          }}
        >
          <svg
            className="spinner"
            width="90"
            height="90"
            viewBox="0 0 66 66"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="path"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              cx="33"
              cy="33"
              r="30"
            />
          </svg>
        </div>
        {children}
      </div>
      <div className="backdrop" />
    </div>
  );
};

export default CheckoutAnimation;
