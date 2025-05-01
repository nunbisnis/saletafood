"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getVisitorCount() {
  try {
    const visitorRecord = await prisma.visitor.findFirst();
    
    if (visitorRecord) {
      return { count: visitorRecord.count };
    } else {
      return { count: 0 };
    }
  } catch (error) {
    console.error("Failed to fetch visitor count:", error);
    return { error: "Failed to fetch visitor count" };
  }
}

export async function incrementVisitorCount() {
  try {
    const visitorRecord = await prisma.visitor.findFirst();

    if (visitorRecord) {
      // Update the existing record
      const updatedVisitor = await prisma.visitor.update({
        where: { id: visitorRecord.id },
        data: { count: visitorRecord.count + 1 },
      });
      
      revalidatePath("/");
      return { count: updatedVisitor.count };
    } else {
      // Create a new record with count = 1
      const newVisitor = await prisma.visitor.create({
        data: { count: 1 },
      });
      
      revalidatePath("/");
      return { count: newVisitor.count };
    }
  } catch (error) {
    console.error("Failed to increment visitor count:", error);
    return { error: "Failed to increment visitor count" };
  }
}
