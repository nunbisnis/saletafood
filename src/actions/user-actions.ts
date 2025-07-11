"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { type UserFormData } from "@/lib/zod";

export async function getUsers(limit?: number) {
  try {
    const users = await prisma.user.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { users };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { error: "Failed to fetch users" };
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return { user };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return { error: "Failed to fetch user" };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return { user };
  } catch (error) {
    console.error("Failed to fetch user by email:", error);
    return { error: "Failed to fetch user by email" };
  }
}

export async function createUser(formData: UserFormData) {
  try {
    const user = await prisma.user.create({
      data: {
        email: formData.email,
        name: formData.name,
        role: formData.role || "USER",
      },
    });

    revalidatePath("/admin/dashboard/users");

    return { user };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { error: "Failed to create user" };
  }
}

export async function updateUser(id: string, formData: UserFormData) {
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: formData.name,
        role: formData.role,
      },
    });

    revalidatePath("/admin/dashboard/users");

    return { user };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { error: "Failed to update user" };
  }
}
