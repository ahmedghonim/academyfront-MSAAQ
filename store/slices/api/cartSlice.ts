import { apiSlice } from "@/store/slices/api/apiSlice";
import { APIActionResponse, APISingleResourceResponse, AnyObject, Cart, PAYMENT_GATEWAY } from "@/types";

export const extendedApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchCart: builder.query<Cart, void>({
      query: () => ({
        url: "/cart",
        method: "GET"
      }),
      transformResponse: (response: APISingleResourceResponse<Cart>) => ({
        ...response.data,
        is_free_due_to_coupon: response.data.is_free && response.data.subtotal > 0
      }),
      providesTags: ["cart.index"]
    }),
    fetchCartByUUID: builder.query<
      {
        cart: Cart;
        payload: {
          action: string;
          member: {
            email: string;
            username: string;
            created_at: string;
            name: string;
            login_via: "otp" | "password" | "new_password";
          };
        };
      },
      string
    >({
      query: (uuid) => ({
        url: `/cart/${uuid}`,
        method: "GET"
      }),
      transformResponse: (
        response: APISingleResourceResponse<{
          cart: Cart;
          payload: {
            action: string;
            member: {
              email: string;
              username: string;
              created_at: string;
              name: string;
              login_via: "otp" | "password" | "new_password";
            };
          };
        }>
      ) => ({
        ...response.data,
        is_free_due_to_coupon: response.data.cart.is_free && response.data.cart.subtotal > 0
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(apiSlice.util?.invalidateTags(["cart.index", "account"]));
        } catch (e) {}
      }
    }),
    addToCart: builder.mutation<
      Cart,
      {
        product_type: "course" | "product";
        product_id: number | string;
        quantity: number;
      }
    >({
      query: (data) => ({
        url: "/cart",
        method: "POST",
        data
      }),
      transformResponse: (response: APISingleResourceResponse<Cart>) => ({
        ...response.data,
        is_free_due_to_coupon: response.data.is_free && response.data.subtotal > 0
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        try {
          const { data: cart } = await queryFulfilled;

          dispatch(
            updateCartQueryData("fetchCart", undefined, (draft) => {
              Object.assign(draft, cart);
            })
          );
        } catch {}
      }
    }),
    removeFromCart: builder.mutation<
      Cart,
      {
        product_type: "course" | "product";
        product_id: number | string;
      }
    >({
      query: (data) => ({
        url: "/cart",
        method: "DELETE",
        data
      }),
      transformResponse: (response: APISingleResourceResponse<Cart>) => ({
        ...response.data,
        is_free_due_to_coupon: response.data.is_free && response.data.subtotal > 0
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        try {
          const { data: cart } = await queryFulfilled;

          dispatch(
            updateCartQueryData("fetchCart", undefined, (draft) => {
              Object.assign(draft, cart);
            })
          );
        } catch {}
      }
    }),
    redeemCoupon: builder.mutation<Cart, string>({
      query: (coupon) => ({
        url: "/cart/redeem-coupon",
        method: "POST",
        data: {
          coupon
        }
      }),
      transformResponse: (response: APISingleResourceResponse<Cart>) => ({
        ...response.data,
        is_free_due_to_coupon: response.data.is_free && response.data.subtotal > 0
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        try {
          const { data: cart } = await queryFulfilled;

          dispatch(
            updateCartQueryData("fetchCart", undefined, (draft) => {
              Object.assign(draft, {
                ...cart,
                is_free_due_to_coupon: cart.is_free && cart.subtotal > 0
              });
            })
          );
        } catch (e: any) {
          const cart = e?.error?.data;

          if (cart) {
            dispatch(
              updateCartQueryData("fetchCart", undefined, (draft) => {
                Object.assign(draft, {
                  ...cart,
                  is_free_due_to_coupon: cart.is_free && cart.subtotal > 0
                });
              })
            );
          } else {
            invalidateCartTags(["cart.index"]);
          }
        }
      }
    }),
    expressCheckout: builder.mutation<
      Cart,
      {
        product_type: "course" | "product";
        product_id: number | string;
        meta?: AnyObject;
      }
    >({
      query: (data) => ({
        url: "/cart/express",
        method: "POST",
        data
      }),
      transformResponse: (response: APISingleResourceResponse<Cart>) => ({
        ...response.data,
        is_free_due_to_coupon: response.data.is_free && response.data.subtotal > 0
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        try {
          const { data: cart } = await queryFulfilled;

          dispatch(
            updateCartQueryData("fetchCart", undefined, (draft) => {
              Object.assign(draft, {
                ...cart,
                is_free_due_to_coupon: cart.is_free && cart.subtotal > 0
              });
            })
          );
        } catch {}
      }
    }),
    checkout: builder.mutation<
      APIActionResponse<{
        cart: {
          uuid: Pick<Cart, "uuid">;
        };
      }>,
      AnyObject
    >({
      query: (data) => ({
        headers: {
          "Content-Type": "multipart/form-data"
        },
        url: "/cart/checkout",
        method: "POST",
        data
      })
    }),
    paypalCheckout: builder.mutation<
      APIActionResponse<{
        cart: {
          uuid: Pick<Cart, "uuid">;
        };
        paypal_order_id: string;
      }>,
      {
        email?: string | null;
        phone?: string | null;
        phone_code?: string | null;
      }
    >({
      query: (data) => ({
        url: "/cart/checkout",
        method: "POST",
        data: {
          payment_gateway: PAYMENT_GATEWAY.PAYPAL,
          ...data
        }
      })
    }),
    paypalCapture: builder.mutation<
      any,
      {
        paypal_order_id: string;
        cart_id: string;
      }
    >({
      query: (data) => ({
        url: "/payments/paypal/callback",
        method: "POST",
        data
      })
    }),
    tamaraCheckout: builder.mutation<
      APIActionResponse<{
        cart: {
          uuid: Pick<Cart, "uuid">;
        };
        paypal_order_id: string;
      }>,
      {
        name?: string;
        email?: string;
        phone: string;
        phone_code: string;
        address: {
          country: string;
          city: string;
          line: string;
        };
      }
    >({
      query: (data) => ({
        url: "/cart/checkout",
        method: "POST",
        data: {
          payment_gateway: PAYMENT_GATEWAY.TAMARA,
          payment_type: "PAY_BY_INSTALMENTS",
          instalments: 3,
          ...data
        }
      })
    }),
    applePayValidation: builder.mutation<any, AnyObject>({
      query: (data) => ({
        url: "/pay/apple-pay/validation",
        method: "POST",
        data
      })
    }),
    applePayAuthorize: builder.mutation<any, AnyObject>({
      query: ({ uuid, ...data }) => ({
        url: `/pay/apple-pay/${uuid}/authorize`,
        method: "POST",
        data
      })
    }),
    googlePayAuthorize: builder.mutation<any, AnyObject>({
      query: ({ uuid, ...data }) => ({
        url: `/pay/google-pay/${uuid}/authorize`,
        method: "POST",
        data
      })
    })
  })
});

export const {
  useCheckoutMutation,
  useGooglePayAuthorizeMutation,
  util: { updateQueryData: updateCartQueryData, invalidateTags: invalidateCartTags }
} = extendedApiSlice;
