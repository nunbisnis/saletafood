import React from "react";
import * as LucideIcons from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IconProp,
  IconName,
  IconPrefix,
} from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import * as HiIcons from "react-icons/hi";
import * as HiIcons2 from "react-icons/hi2";
import * as RiIcons from "react-icons/ri";
import { cn } from "./utils";

// Parse the icon name to determine its type and name
export function parseIconName(iconName: string | null) {
  if (!iconName) return { name: null, type: null };

  if (iconName.includes(":")) {
    const [type, name] = iconName.split(":");
    return { name, type };
  }

  return { name: iconName, type: "lucide" };
}

// Get Font Awesome icon from name and type
function getFontAwesomeIcon(name: string, type: string): IconProp | null {
  if (!name) return null;

  let prefix: IconPrefix;
  let iconSet: Record<string, any>;

  switch (type) {
    case "fa-solid":
      prefix = "fas";
      iconSet = fas;
      break;
    case "fa-regular":
      prefix = "far";
      iconSet = far;
      break;
    case "fa-brands":
      prefix = "fab";
      iconSet = fab;
      break;
    default:
      return null;
  }

  // Check if the icon exists in the set
  const iconName = name as IconName;
  if (iconSet && iconSet[iconName]) {
    return [prefix, iconName] as IconProp;
  }

  return null;
}

// Render an icon based on its name and type
export function renderIcon(
  iconName: string | null,
  className: string = "h-5 w-5"
) {
  if (!iconName) return null;

  const { name, type } = parseIconName(iconName);

  if (!name) return null;

  // Handle Lucide icons
  if (type === "lucide" && LucideIcons[name as keyof typeof LucideIcons]) {
    const IconComponent = LucideIcons[
      name as keyof typeof LucideIcons
    ] as React.ElementType;
    return <IconComponent className={className} />;
  }

  // Handle Font Awesome icons
  if (type?.startsWith("fa-")) {
    const faIcon = getFontAwesomeIcon(name, type);
    if (faIcon) {
      return <FontAwesomeIcon icon={faIcon} className={className} />;
    }
  }

  // Handle Heroicons (v1)
  if (type === "heroicons" && HiIcons[name as keyof typeof HiIcons]) {
    const IconComponent = HiIcons[
      name as keyof typeof HiIcons
    ] as React.ElementType;
    return <IconComponent className={className} />;
  }

  // Handle Heroicons v2
  if (type === "heroicons2" && HiIcons2[name as keyof typeof HiIcons2]) {
    const IconComponent = HiIcons2[
      name as keyof typeof HiIcons2
    ] as React.ElementType;
    return <IconComponent className={className} />;
  }

  // Handle Remix Icons
  if (type === "remix" && RiIcons[name as keyof typeof RiIcons]) {
    const IconComponent = RiIcons[
      name as keyof typeof RiIcons
    ] as React.ElementType;
    return <IconComponent className={className} />;
  }

  // If we get here, the icon wasn't found
  return null;
}

// Render a category icon with gradient styling
export function renderCategoryIcon(
  category: { iconName: string | null; color: string; icon?: any },
  className: string = "h-6 w-6"
) {
  // Try to render using iconName first
  if (category.iconName) {
    const { name, type } = parseIconName(category.iconName);

    if (name) {
      // Handle Lucide icons
      if (type === "lucide" && LucideIcons[name as keyof typeof LucideIcons]) {
        const IconComponent = LucideIcons[
          name as keyof typeof LucideIcons
        ] as React.ElementType;
        return (
          <IconComponent
            className={cn(
              className,
              "text-gradient bg-gradient-to-r",
              category.color
            )}
          />
        );
      }

      // Handle Font Awesome icons
      if (type?.startsWith("fa-")) {
        const faIcon = getFontAwesomeIcon(name, type);
        if (faIcon) {
          return (
            <FontAwesomeIcon
              icon={faIcon}
              className={cn(
                className,
                "text-gradient bg-gradient-to-r",
                category.color
              )}
            />
          );
        }
      }

      // Handle Heroicons (v1)
      if (type === "heroicons" && HiIcons[name as keyof typeof HiIcons]) {
        const IconComponent = HiIcons[
          name as keyof typeof HiIcons
        ] as React.ElementType;
        return (
          <IconComponent
            className={cn(
              className,
              "text-gradient bg-gradient-to-r",
              category.color
            )}
          />
        );
      }

      // Handle Heroicons v2
      if (type === "heroicons2" && HiIcons2[name as keyof typeof HiIcons2]) {
        const IconComponent = HiIcons2[
          name as keyof typeof HiIcons2
        ] as React.ElementType;
        return (
          <IconComponent
            className={cn(
              className,
              "text-gradient bg-gradient-to-r",
              category.color
            )}
          />
        );
      }

      // Handle Remix Icons
      if (type === "remix" && RiIcons[name as keyof typeof RiIcons]) {
        const IconComponent = RiIcons[
          name as keyof typeof RiIcons
        ] as React.ElementType;
        return (
          <IconComponent
            className={cn(
              className,
              "text-gradient bg-gradient-to-r",
              category.color
            )}
          />
        );
      }
    }
  }

  // Fallback to icon function if available (for backward compatibility)
  if (typeof category.icon === "function") {
    return (
      <category.icon
        className={cn(
          className,
          "text-gradient bg-gradient-to-r",
          category.color
        )}
      />
    );
  }

  // Default fallback to ChevronRight if no valid icon is found
  const ChevronRight = LucideIcons.ChevronRight;
  return (
    <ChevronRight
      className={cn(
        className,
        "text-gradient bg-gradient-to-r",
        category.color
      )}
    />
  );
}
