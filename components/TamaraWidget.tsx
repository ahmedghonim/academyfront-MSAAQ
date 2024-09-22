import { useEffect, useMemo, useState } from "react";

import { useTenant } from "@/components/store/TenantProvider";
import { useSession } from "@/providers/session-provider";
import { App, AppSlug } from "@/types";
import { canUseTamara } from "@/utils";
import AppStorage from "@/utils/AppStorage";

export enum TamaraWidgetType {
  CUSTOM_TEMPLATE = 0,
  BADGE_ONLY = 1,
  SPILT_AMOUNT_PRODUCT_PAGE = 2,
  SPILT_AMOUNT_CART_PAGE = 3
}

interface TamaraWidgetProps {
  price: number;
  type: TamaraWidgetType;
  className?: string;
}

const TAMARA_WIDGET_URL = "https://cdn.tamara.co/widget-v2/tamara-widget.js";
const TAMARA_WIDGET_REGEX = /https:\/\/cdn.tamara.co\/widget-v2\/tamara-widget.js/;
let tamaraPromise: Promise<any | null> | null = null;

declare global {
  interface Window {
    TamaraWidgetV2?: any;
    tamaraWidgetConfig?: any;
  }
}

const findScript = (): HTMLScriptElement | null => {
  const scripts = document.querySelectorAll<HTMLScriptElement>(`script[src^="${TAMARA_WIDGET_URL}"]`);

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];

    if (!TAMARA_WIDGET_REGEX.test(script.src)) {
      continue;
    }

    return script;
  }

  return null;
};
const injectScript = (): HTMLScriptElement => {
  const script = document.createElement("script");

  script.src = TAMARA_WIDGET_URL;

  const headOrBody = document.head || document.body;

  if (!headOrBody) {
    throw new Error("Expected document.body not to be null. tamara.js requires a <body> element.");
  }

  headOrBody.appendChild(script);

  return script;
};

export const loadScript = (): Promise<boolean> => {
  if (tamaraPromise !== null) {
    return tamaraPromise;
  }

  tamaraPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      resolve(null);

      return;
    }

    if (window.TamaraWidgetV2) {
      // eslint-disable-next-line no-console
      console.warn("TamaraWidget already loaded on the page.");
    }

    if (window.TamaraWidgetV2) {
      resolve(true);

      return;
    }

    try {
      let script = findScript();

      if (script) {
        // eslint-disable-next-line no-console
        console.warn("TamaraWidget already loaded on the page.");
      } else if (!script) {
        script = injectScript();
      }

      script.addEventListener("load", () => {
        if (window.TamaraWidgetV2) {
          resolve(true);
        } else {
          reject(new Error("TamaraWidgetV2 not available"));
        }
      });

      script.addEventListener("error", () => {
        reject(new Error("Failed to load TamaraWidgetV2"));
      });
    } catch (error) {
      reject(error);

      return;
    }
  });

  return tamaraPromise;
};

const TamaraWidget = (config: TamaraWidgetProps) => {
  const [isTamaraLoaded, setIsTamaraLoaded] = useState(false);
  const tenant = useTenant()((s) => s.tenant);
  const { member } = useSession();

  const app = useMemo(() => tenant?.apps?.find((app) => app.slug === AppSlug.Tamara) as App<AppSlug.Tamara>, [tenant]);

  const useTamara = useMemo(() => canUseTamara(), []);

  useEffect(() => {
    if (!app || !useTamara) {
      return;
    }

    window.tamaraWidgetConfig = {
      country: member?.country_code || AppStorage.getItem("current_country") || "SA",
      publicKey: app.public_key,
      lang: tenant?.locale
    };

    loadScript().then((enabled) => {
      setIsTamaraLoaded((config.price >= 100 && enabled) ?? false);
    });
  }, []);

  return isTamaraLoaded ? (
    <div className={config.className}>
      {/*// @ts-ignore*/}
      <tamara-widget
        type="tamara-summary"
        amount={config.price}
        inline-type={config.type}
      />
    </div>
  ) : null;
};

export default TamaraWidget;
