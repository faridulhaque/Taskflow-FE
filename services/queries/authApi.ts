import { apiSlice } from "../apiSlice";
import {
  ForgotPasswordType,
  GOnboardingPayload,
  RecoverPasswordType,
  signInPayload,
  signUpPayload,
} from "../types";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    register: builder.mutation({
      query: (data: signUpPayload) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data: signInPayload) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data: ForgotPasswordType) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    recoverPassword: builder.mutation({
      query: (data: RecoverPasswordType) => ({
        url: "/auth/recover-password",
        method: "POST",
        body: data,
      }),
    }),

    googleOnboarding: builder.mutation({
      query: (data: GOnboardingPayload) => ({
        url: "/auth/g-onboarding",
        method: "POST",
        body: data,
      }),
    }),
  }),
  // overrideExisting: true,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useRecoverPasswordMutation,
  useGoogleOnboardingMutation,
} = authApi;
