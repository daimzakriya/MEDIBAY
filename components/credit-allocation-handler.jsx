"use client";

import { useEffect } from "react";
import { checkAndAllocateCredits } from "@/actions/credits";

export default function CreditAllocationHandler({ user }) {
  useEffect(() => {
    // Only run credit allocation once when component mounts
    const allocateCredits = async () => {
      try {
        await checkAndAllocateCredits(user);
      } catch (error) {
        console.error("Failed to allocate credits:", error);
      }
    };

    if (user && user.role === "PATIENT") {
      allocateCredits();
    }
  }, [user]);

  // This component doesn't render anything visible
  return null;
} 