"use client";

import React, { useMemo } from "react";

import { AnyObject, App, AppSlug } from "@/types";

import ApplePayWallet from "./apple-pay-wallet";

const KEYS: AnyObject = {
  APPLE_PAY: "applepay",
  GOOGLE_PAY: "googlepay"
};

interface IProps {
  app: App<AppSlug.Msaaqpay>;
}

const _keys = Object.keys(KEYS).map((key) => KEYS[key]);

function WalletsComponent({ app }: IProps) {
  const enabledWallets = useMemo(() => app.gateways.filter((gateway) => _keys.includes(gateway)), [app, _keys]);

  const isWalletEnabled = (key: string) => {
    return app.gateways.some((gateway) => gateway === key);
  };

  return enabledWallets.length > 0 ? (
    <div className={`grid gap-4 grid-cols-${1}`}>
      {isWalletEnabled(KEYS.APPLE_PAY) && <ApplePayWallet app={app} />}
      {/*{isWalletEnabled(KEYS.GOOGLE_PAY) && <GooglePayWallet app={app} />}*/}
    </div>
  ) : null;
}

export default WalletsComponent;
