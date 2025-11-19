"use server";

import { auth } from "../betterAuth/auth";
import { inngest } from "../inngest/client";

export async function signUpWithEmail({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}) {
  try {
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });

    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }
    return { success: true, data: response };
  } catch (error) {
    console.log("signup with email failed", error);
    return { success: false, error: "Sign up failed" };
  }
}
