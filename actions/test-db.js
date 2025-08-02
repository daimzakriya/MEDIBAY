"use server";

import { db } from "@/lib/prisma";

export async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...");
    
    // Test basic connection
    await db.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful");
    
    // Test user count
    const userCount = await db.user.count();
    console.log("✅ User count:", userCount);
    
    // Test appointment count
    const appointmentCount = await db.appointment.count();
    console.log("✅ Appointment count:", appointmentCount);
    
    return { 
      success: true, 
      userCount, 
      appointmentCount,
      message: "Database connection successful" 
    };
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return { 
      success: false, 
      error: error.message,
      message: "Database connection failed" 
    };
  }
} 