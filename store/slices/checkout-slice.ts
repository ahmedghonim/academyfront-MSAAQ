import { createSlice } from "@reduxjs/toolkit";

export type CheckoutSliceStateType = {
  checkoutProcessing: boolean;
  email: string | null;
  errors: {
    email: {
      message: string | null;
    };
  };
};

const initialState: CheckoutSliceStateType = {
  checkoutProcessing: false,
  email: null,
  errors: {
    email: {
      message: null
    }
  }
};

export const CheckoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutErrors(state, action) {
      state.errors = action.payload;
    },
    setCheckoutMemberEmail(state, action) {
      state.email = action.payload;
    },
    setCheckoutProcessing(state, action) {
      state.checkoutProcessing = action.payload;
    }
  }
});
export const { setCheckoutProcessing, setCheckoutMemberEmail, setCheckoutErrors } = CheckoutSlice.actions;
export default CheckoutSlice.reducer;
