"use server";

import { headers } from "next/headers";
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

export async function signOut() {
  try {
    await auth.api.signOut({headers:await headers()})
  } catch (error) {
    console.log(error);
    return{success:false,error:"Sign out failed"}
  }
}

export async function signInWithEmail({ email, password }) {
  try {
    const response = await auth.api.signInEmail({ body: { email, password } });
    return { success: true, data: response };
  } catch (error) {
    console.log(error);
    return {success:false,error:"Sign in with email and password was failed !"}
  }
}