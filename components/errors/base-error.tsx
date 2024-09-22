"use client";

import { useEffect } from "react";

import * as Sentry from "@sentry/nextjs";

import { ErrorType } from "@/server-actions/config/error-handler";

import Forbidden from "./forbidden";
import MaintenanceMode from "./maintenance-mode";
import ServerError from "./server-error";
import SubscriptionExpired from "./subscription-expired";

export default function BaseError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  if (error.message === ErrorType.FORBIDDEN) {
    return <Forbidden />;
  }

  if (error.message === ErrorType.SUBSCRIPTION_EXPIRED) {
    return <SubscriptionExpired />;
  }

  if (error.message === ErrorType.INTERNAL_SERVER_ERROR || error.message === ErrorType.TOO_MANY_ATTEMPTS) {
    return <ServerError />;
  }

  if (error.message === ErrorType.SERVICE_UNAVAILABLE) {
    return <MaintenanceMode />;
  }

  return <ServerError />;
}
