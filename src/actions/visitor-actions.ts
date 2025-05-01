"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getVisitorCount() {
  try {
    // Count total visits
    const totalVisits = await prisma.visitor.count();

    return { count: totalVisits };
  } catch (error) {
    console.error("Failed to fetch visitor count:", error);
    return { error: "Failed to fetch visitor count" };
  }
}

export async function incrementVisitorCount(ipAddress: string = "0.0.0.0") {
  try {
    const now = new Date();

    // Calculate the date 2 hours ago
    const twoHoursAgo = new Date(now);
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    // Check if this IP has been recorded in the last 2 hours
    const recentVisit = await prisma.visitor.findFirst({
      where: {
        ipAddress: ipAddress,
        visitedAt: { gte: twoHoursAgo },
      },
      orderBy: { visitedAt: "desc" },
    });

    if (!recentVisit) {
      // No recent visit from this IP in the last 2 hours, create a new record
      await prisma.visitor.create({
        data: {
          ipAddress: ipAddress,
          visitedAt: now,
        },
      });
    }

    // Count total visits
    const totalVisits = await prisma.visitor.count();

    revalidatePath("/");
    return { count: totalVisits };
  } catch (error) {
    console.error("Failed to increment visitor count:", error);
    return { error: "Failed to increment visitor count" };
  }
}
