import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Get all appointments for the authenticated patient
 */
export async function getPatientAppointments() {
  console.log("🔍 Starting getPatientAppointments...");
  
  const { userId } = await auth();
  console.log("🔍 Auth userId:", userId);

  if (!userId) {
    console.log("❌ No userId found - unauthorized");
    throw new Error("Unauthorized");
  }

  try {
    console.log("🔍 Looking for user with clerkUserId:", userId);
    
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
      select: {
        id: true,
      },
    });

    console.log("🔍 Found user:", user);

    if (!user) {
      console.log("❌ Patient not found in database");
      throw new Error("Patient not found");
    }

    console.log("🔍 Fetching appointments for patientId:", user.id);
    
    const appointments = await db.appointment.findMany({
      where: {
        patientId: user.id,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    console.log("🔍 Found appointments:", appointments.length);
    return { appointments };
  } catch (error) {
    console.error("Failed to get patient appointments:", error);
    return { error: `Failed to fetch appointments: ${error.message}` };
  }
}
