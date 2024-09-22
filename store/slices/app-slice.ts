import { createSlice } from "@reduxjs/toolkit";
import { CookieValueTypes } from "cookies-next";
import { HYDRATE } from "next-redux-wrapper";

export type AppSliceStateType = {
  academyCurrency: string;
  defaultCurrency: string;
  countries: Array<any>;
  openCompleteProfileModal: boolean;
  completedProfilePercentage: number;
  openCartModal: boolean;
  tenantHost: string;
  accessToken: string | null;
  apiError: {
    status: number;
    message: string;
  } | null;
  conversionPixelHeaders: Record<string, CookieValueTypes>;
  customCode: string | null;
  currencies: {
    ar: Record<string, string>;
    en: Record<string, string>;
  };
  appLocale: string;
};

const initialState: AppSliceStateType = {
  academyCurrency: "",
  defaultCurrency: "",
  countries: [],
  openCompleteProfileModal: false,
  completedProfilePercentage: 60,
  apiError: null,
  openCartModal: false,
  tenantHost: "",
  accessToken: null,
  conversionPixelHeaders: {},
  customCode: null,
  currencies: {
    ar: {
      USD: "دولار أمريكي ($)",
      TRY: "ليرة تركية (₺)",
      SAR: "ريال سعودي (ر.س)",
      KWD: "دينار كويتي (د.ك)",
      GBP: "جنيه بريطاني (£)",
      EUR: "يورو (€)",
      AED: "درهم إماراتي (د.إ)"
    },
    en: {
      USD: "US Dollar ($)",
      TRY: "Turkish Lira (₺)",
      SAR: "Saudi Riyal (SAR)",
      KWD: "Kuwaiti Dinar (KWD)",
      GBP: "British Pound (£)",
      EUR: "Euro (€)",
      AED: "UAE Dirham (AED)"
    }
  },
  appLocale: "ar"
};

export const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAcademyCurrency(state, action) {
      state.academyCurrency = action.payload;
    },
    setDefaultCurrency(state, action) {
      state.defaultCurrency = action.payload;
    },
    setOpenCompleteProfileModal(state, action) {
      state.openCompleteProfileModal = action.payload;
    },
    setCompletedProfilePercentage(state, action) {
      state.completedProfilePercentage = action.payload;
    },
    setApiError(state, action) {
      state.apiError = action.payload;
    },
    setOpenCart(state, action) {
      state.openCartModal = action.payload;
    },
    setTenantHost(state, action) {
      state.tenantHost = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setConversionPixelHeaders(state, action) {
      state.conversionPixelHeaders = action.payload;
    },
    setCustomCode(state, action) {
      state.customCode = action.payload;
    },
    setAppLocale(state, action) {
      state.appLocale = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      return {
        ...state,
        ...action.payload[AppSlice.name]
      };
    });
  }
});
export const {
  setAcademyCurrency,
  setDefaultCurrency,
  setCompletedProfilePercentage,
  setOpenCompleteProfileModal,
  setTenantHost,
  setAppLocale,
  setAccessToken,
  setOpenCart,
  setConversionPixelHeaders,
  setCustomCode,
  setApiError
} = AppSlice.actions;
export default AppSlice.reducer;
