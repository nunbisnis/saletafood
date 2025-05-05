"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  heroSettingsSchema,
  ctaSettingsSchema,
  type HeroSettingsFormData,
  type CTASettingsFormData,
} from "@/lib/schemas/settings-schema";

// Hero section setting keys
const HERO_TITLE_KEY = "hero_title";
const HERO_DESCRIPTION_KEY = "hero_description";
const HERO_IMAGE_KEY = "hero_image";

// CTA section setting keys
const CTA_TITLE_KEY = "cta_title";
const CTA_DESCRIPTION_KEY = "cta_description";
const CTA_BUTTON_TEXT_KEY = "cta_button_text";
const CTA_BUTTON_URL_KEY = "cta_button_url";

// Default values for Hero section
const DEFAULT_HERO_TITLE = "Welcome to SaletaFood";
const DEFAULT_HERO_DESCRIPTION = "Supplier food and beverage for Hotel";
const DEFAULT_HERO_IMAGE =
  "https://cdn.pixabay.com/photo/2017/04/04/01/08/fruits-2200001_1280.jpg";

// Default values for CTA section
const DEFAULT_CTA_TITLE = "Siap Memesan?";
const DEFAULT_CTA_DESCRIPTION = "Supplier food and beverage for Hotel";
const DEFAULT_CTA_BUTTON_TEXT = "Pesan Sekarang";
const DEFAULT_CTA_BUTTON_URL =
  "https://wa.me/6285747375614?text=Halo%20SaletaFood%2C%20saya%20tertarik%20dengan%20produk%20Anda.%20Boleh%20minta%20informasi%20lebih%20lanjut%3F";

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

/**
 * Get CTA section settings
 */
export async function getCTASettings() {
  try {
    // Get all CTA settings
    const settings = await prisma.websiteSetting.findMany({
      where: {
        key: {
          in: [
            CTA_TITLE_KEY,
            CTA_DESCRIPTION_KEY,
            CTA_BUTTON_TEXT_KEY,
            CTA_BUTTON_URL_KEY,
          ],
        },
      },
    });

    // Create a map of settings
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    // Return CTA settings with defaults for missing values
    return {
      title: settingsMap[CTA_TITLE_KEY] || DEFAULT_CTA_TITLE,
      description: settingsMap[CTA_DESCRIPTION_KEY] || DEFAULT_CTA_DESCRIPTION,
      buttonText: settingsMap[CTA_BUTTON_TEXT_KEY] || DEFAULT_CTA_BUTTON_TEXT,
      buttonUrl: settingsMap[CTA_BUTTON_URL_KEY] || DEFAULT_CTA_BUTTON_URL,
    };
  } catch (error) {
    console.error("Failed to fetch CTA settings:", error);
    return {
      title: DEFAULT_CTA_TITLE,
      description: DEFAULT_CTA_DESCRIPTION,
      buttonText: DEFAULT_CTA_BUTTON_TEXT,
      buttonUrl: DEFAULT_CTA_BUTTON_URL,
    };
  }
}

/**
 * Update CTA section settings
 */
export async function updateCTASettings(formData: CTASettingsFormData) {
  // Validate input data
  const validationResult = ctaSettingsSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const { title, description, buttonText, buttonUrl } = validationResult.data;

    // Update or create title setting
    await prisma.websiteSetting.upsert({
      where: { key: CTA_TITLE_KEY },
      update: { value: title },
      create: { key: CTA_TITLE_KEY, value: title },
    });

    // Update or create description setting
    await prisma.websiteSetting.upsert({
      where: { key: CTA_DESCRIPTION_KEY },
      update: { value: description },
      create: { key: CTA_DESCRIPTION_KEY, value: description },
    });

    // Update or create button text setting
    await prisma.websiteSetting.upsert({
      where: { key: CTA_BUTTON_TEXT_KEY },
      update: { value: buttonText },
      create: { key: CTA_BUTTON_TEXT_KEY, value: buttonText },
    });

    // Update or create button URL setting
    await prisma.websiteSetting.upsert({
      where: { key: CTA_BUTTON_URL_KEY },
      update: { value: buttonUrl },
      create: { key: CTA_BUTTON_URL_KEY, value: buttonUrl },
    });

    // Revalidate paths that use CTA section
    revalidatePath("/");
    revalidatePath("/admin/dashboard/settings");

    return { success: true };
  } catch (error) {
    console.error("Failed to update CTA settings:", error);
    return { success: false, error: "Failed to update CTA settings" };
  }
}
