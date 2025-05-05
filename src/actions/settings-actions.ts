"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  heroSettingsSchema,
  type HeroSettingsFormData,
} from "@/lib/schemas/settings-schema";

// Hero section setting keys
const HERO_TITLE_KEY = "hero_title";
const HERO_DESCRIPTION_KEY = "hero_description";
const HERO_IMAGE_KEY = "hero_image";

// Default values
const DEFAULT_HERO_TITLE = "Welcome to SaletaFood";
const DEFAULT_HERO_DESCRIPTION = "Supplier food and beverage for Hotel";
const DEFAULT_HERO_IMAGE =
  "https://cdn.pixabay.com/photo/2017/04/04/01/08/fruits-2200001_1280.jpg";

/**
 * Get hero section settings
 */
export async function getHeroSettings() {
  try {
    // Get all hero settings
    const settings = await prisma.websiteSetting.findMany({
      where: {
        key: {
          in: [HERO_TITLE_KEY, HERO_DESCRIPTION_KEY, HERO_IMAGE_KEY],
        },
      },
    });

    // Create a map of settings
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    // Return hero settings with defaults for missing values
    return {
      title: settingsMap[HERO_TITLE_KEY] || DEFAULT_HERO_TITLE,
      description:
        settingsMap[HERO_DESCRIPTION_KEY] || DEFAULT_HERO_DESCRIPTION,
      imageUrl: settingsMap[HERO_IMAGE_KEY] || DEFAULT_HERO_IMAGE,
    };
  } catch (error) {
    console.error("Failed to fetch hero settings:", error);
    return {
      title: DEFAULT_HERO_TITLE,
      description: DEFAULT_HERO_DESCRIPTION,
      imageUrl: DEFAULT_HERO_IMAGE,
    };
  }
}

/**
 * Update hero section settings
 */
export async function updateHeroSettings(formData: HeroSettingsFormData) {
  // Validate input data
  const validationResult = heroSettingsSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const { title, description, imageUrl } = validationResult.data;

    // Update or create title setting
    await prisma.websiteSetting.upsert({
      where: { key: HERO_TITLE_KEY },
      update: { value: title },
      create: { key: HERO_TITLE_KEY, value: title },
    });

    // Update or create description setting
    await prisma.websiteSetting.upsert({
      where: { key: HERO_DESCRIPTION_KEY },
      update: { value: description },
      create: { key: HERO_DESCRIPTION_KEY, value: description },
    });

    // Update or create image setting
    await prisma.websiteSetting.upsert({
      where: { key: HERO_IMAGE_KEY },
      update: { value: imageUrl },
      create: { key: HERO_IMAGE_KEY, value: imageUrl },
    });

    // Revalidate paths that use hero section
    revalidatePath("/");
    revalidatePath("/admin/dashboard/settings");

    return { success: true };
  } catch (error) {
    console.error("Failed to update hero settings:", error);
    return { success: false, error: "Failed to update hero settings" };
  }
}
