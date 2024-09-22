import React from "react";

import Image from "next/image";

import { useTenant } from "@/components/store/TenantProvider";

import { BuildingLibraryIcon } from "@heroicons/react/24/solid";

import { Icon } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

const PATH = "https://cdn.msaaq.com/assets/images/payments";
const METHODS: Record<string, string> = {
  MASTER: `${PATH}/master.svg`,
  VISA: `${PATH}/visa.svg`,
  MADA: `${PATH}/mada.svg`,
  "STC Pay": `${PATH}/stcpay.svg`,
  KNET: `${PATH}/knet.svg`,
  "Apple Pay": `${PATH}/applepay.svg`,
  "Google Pay": `${PATH}/googlepay.svg`,
  Tamara: `${PATH}/tamara-bordered.svg`,
  PayPal: `${PATH}/paypal.svg`,
  bankTransfer: "bankTransfer"
} as const;

type PaymentMethod = keyof typeof METHODS;
type PaymentMethodProps = {
  bordered?: boolean;
  methods?: PaymentMethod[];
  className?: string;
};
const PAYMENT_GATEWAYS: Record<string, string[]> = {
  tamara: ["Tamara"],
  tap: ["MADA", "Apple Pay", "VISA", "MASTER"],
  paylink: ["MADA", "Apple Pay", "VISA", "MASTER"],
  myfatoorah: ["MADA", "KNET", "STC Pay", "Apple Pay", "Google Pay", "VISA", "MASTER"],
  paddle: ["Apple Pay", "VISA", "MASTER", "PayPal"],
  stripe: ["Apple Pay", "VISA", "MASTER"],
  paypal: ["PayPal"],
  msaaqpay: ["MADA", "VISA", "MASTER", "Apple Pay"],
  bankTransfer: ["bankTransfer"]
};

const Logo = ({ logo, bordered }: { logo: string; bordered?: boolean }) => {
  return (
    <div className={cn("flex h-6 w-9 items-center justify-center rounded", bordered && "border border-gray-300")}>
      {logo !== "bankTransfer" ? (
        <Image
          src={METHODS[logo]}
          alt={logo}
          width={30}
          height={10}
          style={{
            maxWidth: "30px",
            height: "auto"
          }}
        />
      ) : (
        <Icon color="gray">
          <BuildingLibraryIcon />
        </Icon>
      )}
    </div>
  );
};

const PaymentLogos = ({ bordered, methods, className }: PaymentMethodProps) => {
  const tenant = useTenant()((state) => state.tenant);

  if (methods?.length) {
    return (
      <div className={cn("flex flex-wrap items-center gap-1 md:!gap-3", className)}>
        {methods.map((logo) => (
          <Logo
            key={logo}
            logo={logo}
            bordered={bordered}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1 md:!gap-3", className)}>
      {tenant &&
        (() => {
          const displayedLogos = new Set();

          return tenant.apps.flatMap((paymentGateway) => {
            if (!PAYMENT_GATEWAYS[paymentGateway.slug]) {
              return [];
            }

            return PAYMENT_GATEWAYS[paymentGateway.slug].flatMap((logo) => {
              if (displayedLogos.has(logo)) {
                return [];
              }
              displayedLogos.add(logo);

              return (
                <Logo
                  key={logo}
                  logo={logo}
                  bordered={bordered}
                />
              );
            });
          });
        })()}
    </div>
  );
};

export { PaymentLogos };
