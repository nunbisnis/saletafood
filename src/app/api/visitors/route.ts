import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Get the first visitor record or create it if it doesn't exist
    const visitorRecord = await prisma.visitor.findFirst();

    if (visitorRecord) {
      // Update the existing record
      const updatedVisitor = await prisma.visitor.update({
        where: { id: visitorRecord.id },
        data: { count: visitorRecord.count + 1 },
      });
      
      return NextResponse.json({ count: updatedVisitor.count }, { status: 200 });
    } else {
      // Create a new record with count = 1
      const newVisitor = await prisma.visitor.create({
        data: { count: 1 },
      });
      
      return NextResponse.json({ count: newVisitor.count }, { status: 201 });
    }
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
    const visitorRecord = await prisma.visitor.findFirst();
    
    if (visitorRecord) {
      return NextResponse.json({ count: visitorRecord.count }, { status: 200 });
    } else {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor count" },
      { status: 500 }
    );
  }
}
