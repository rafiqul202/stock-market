import Header from "@/components/ui/Header";
import React from "react";
import { connectToDatabase } from "../../../database/mongoose";
import { auth } from "@/lib/betterAuth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const layout = async ({ children }) => {
  await connectToDatabase();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");
  const user = {
    id: session?.user?.id,
    name: session?.user?.name,
    email: session?.user?.email,
  };
  return (
    <main className="min-h-screen text-gray-400">
      {/* Header */}
      <Header user={user} />
      <div className="container py-10">{children}</div>
    </main>
  );
};

export default layout;
