import Header from "@/components/ui/Header";
import React from "react";
import { connectToDatabase } from "../../../database/mongoose";

const layout = async ({ children }) => {
  await connectToDatabase();
  return (
    <main className="min-h-screen text-gray-400">
      {/* Header */}
      <Header />
      <div className="container py-10">{children}</div>
    </main>
  );
};

export default layout;
