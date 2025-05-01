import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Helper function to get client IP address
function getClientIp(request: NextRequest): string {
  // Try to get IP from headers first (for proxied requests)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim();
  }

  // Try to get from socket remote address
  const socketAddr = request.headers.get("x-real-ip");
  if (socketAddr) {
    return socketAddr;
  }

  // Fallback to a placeholder if we can't determine the IP
  return "0.0.0.0";
}

export async function POST(request: NextRequest) {
  try {
    const ipAddress = getClientIp(request);
    const now = new Date();

    console.log(
      `Visitor API: Processing visit from IP ${ipAddress} at ${now.toISOString()}`
    );

    // Calculate the date 2 hours ago
    const twoHoursAgo = new Date(now);
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    console.log(
      `Visitor API: Checking for visits after ${twoHoursAgo.toISOString()}`
    );

    // Check if this IP has been recorded in the last 2 hours
    const recentVisit = await prisma.visitor.findFirst({
      where: {
        ipAddress: ipAddress,
        visitedAt: { gte: twoHoursAgo },
      },
      orderBy: { visitedAt: "desc" },
    });

    if (recentVisit) {
      console.log(
        `Visitor API: Found recent visit from IP ${ipAddress} at ${recentVisit.visitedAt.toISOString()}`
      );
    } else {
      console.log(
        `Visitor API: No recent visit found for IP ${ipAddress}, creating new record`
      );

      // No recent visit from this IP in the last 2 hours, create a new record
      const newVisit = await prisma.visitor.create({
        data: {
          ipAddress: ipAddress,
          visitedAt: now,
        },
      });

      console.log(
        `Visitor API: Created new visit record with ID ${newVisit.id}`
      );
    }

    // Count total visits
    const totalVisits = await prisma.visitor.count();
    console.log(`Visitor API: Total visit count is now ${totalVisits}`);

    return NextResponse.json({ count: totalVisits }, { status: 200 });
  } catch (error) {
    console.error("Error updating visitor count:", error);
    return NextResponse.json(
      { error: "Failed to update visitor count" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("Visitor API: GET request received, counting total visits");

    // Count total visits
    const totalVisits = await prisma.visitor.count();

    console.log(`Visitor API: Total visit count is ${totalVisits}`);

    // Get the most recent 5 visits for debugging
    const recentVisits = await prisma.visitor.findMany({
      take: 5,
      orderBy: { visitedAt: "desc" },
    });

    console.log(
      "Visitor API: Recent visits:",
      recentVisits.map((v) => ({
        ip: v.ipAddress,
        visitedAt: v.visitedAt.toISOString(),
      }))
    );

    return NextResponse.json({ count: totalVisits }, { status: 200 });
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor count" },
      { status: 500 }
    );
  }
}
