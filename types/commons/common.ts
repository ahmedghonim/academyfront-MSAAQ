import { Course, Member, Product, ProductModelType } from "@/types";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type AnyObject = { [key: string]: any };

export type Authorize = {
  via: "email" | "phone";
  email?: string;
  phone_code?: string;
  phone?: string;
  prefer_otp?: boolean;
  login_only?: boolean;
};

export type AuthorizeResponse = {
  via: "email" | "phone";
  next_action: "otp" | "password";
};

export type Auth = {
  token: string | undefined;
  member: Member;
};

export type PickArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export type MemberLoginData = {
  type: "email" | "phone";
  email?: string;
  phone_code?: string;
  phone?: string;
  otp_code?: string;
  password?: string;
};

export const getProductType = (product: Product | Course): ProductModelType => {
  if (
    product.hasOwnProperty("instructors") ||
    product.hasOwnProperty("certification") ||
    product.hasOwnProperty("enrollment") ||
    product.hasOwnProperty("chapters") ||
    product.hasOwnProperty("contents_count") ||
    product.hasOwnProperty("outcomes") ||
    product.hasOwnProperty("enrollments_count")
  ) {
    return ProductModelType.COURSE;
  }

  return ProductModelType.PRODUCT;
};
