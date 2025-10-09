"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/../amplify_outputs.json";
import { useState } from "react";

// Configure Amplify immediately on module load (client-side only)
if (typeof window !== 'undefined') {
  Amplify.configure(outputs, { ssr: true });
}

export default function AmplifyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
