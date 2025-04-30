"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, IconName } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { renderIcon } from "@/lib/icon-utils";

// Type for the icon selector props
interface IconSelectorProps {
  selectedIcon: string | null;
  onSelectIcon: (iconName: string, iconType?: string) => void;
}

// Icon type definition
type IconInfo = {
  name: string;
  type: "lucide" | "fa-solid" | "fa-regular" | "fa-brands";
  component: React.ElementType;
  icon?: IconProp;
};

export function IconSelector({
  selectedIcon,
  onSelectIcon,
}: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIcons, setFilteredIcons] = useState<IconInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lucide");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get all available Lucide icons - memoized to prevent recreation on each render
  const lucideIcons = useMemo(() => {
    return Object.keys(LucideIcons)
      .filter((key) => key !== "createLucideIcon" && key !== "default")
      .map((name) => ({
        name,
        type: "lucide" as const,
        component: LucideIcons[
          name as keyof typeof LucideIcons
        ] as React.ElementType,
      }));
  }, []);

  // Get all available Font Awesome Solid icons
  const faSolidIcons = useMemo(() => {
    return Object.keys(fas)
      .filter(
        (key) => key !== "fas" && key !== "prefix" && !key.startsWith("__")
      )
      .map((name) => ({
        name: `fa-solid:${name}`,
        type: "fa-solid" as const,
        component: FontAwesomeIcon,
        icon: ["fas", name as IconName] as IconProp,
      }));
  }, []);

  // Get all available Font Awesome Regular icons
  const faRegularIcons = useMemo(() => {
    return Object.keys(far)
      .filter(
        (key) => key !== "far" && key !== "prefix" && !key.startsWith("__")
      )
      .map((name) => ({
        name: `fa-regular:${name}`,
        type: "fa-regular" as const,
        component: FontAwesomeIcon,
        icon: ["far", name as IconName] as IconProp,
      }));
  }, []);

  // Get all available Font Awesome Brand icons
  const faBrandsIcons = useMemo(() => {
    return Object.keys(fab)
      .filter(
        (key) => key !== "fab" && key !== "prefix" && !key.startsWith("__")
      )
      .map((name) => ({
        name: `fa-brands:${name}`,
        type: "fa-brands" as const,
        component: FontAwesomeIcon,
        icon: ["fab", name as IconName] as IconProp,
      }));
  }, []);

  // All icons combined
  const allIcons = useMemo(() => {
    return {
      lucide: lucideIcons,
      "fa-solid": faSolidIcons,
      "fa-regular": faRegularIcons,
      "fa-brands": faBrandsIcons,
    };
  }, [lucideIcons, faSolidIcons, faRegularIcons, faBrandsIcons]);

  // Filter icons based on search term or show default icons
  useEffect(() => {
    const currentIcons = allIcons[activeTab as keyof typeof allIcons] || [];

    if (!searchTerm) {
      // If no search term, show first 30 icons by default
      setFilteredIcons(currentIcons.slice(0, 30));
      return;
    }

    // Filter icons based on search term
    const filtered = currentIcons.filter((icon) => {
      const searchName = icon.name.replace(`${icon.type}:`, "");
      return searchName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredIcons(filtered.slice(0, 100)); // Limit to 100 results for performance
  }, [searchTerm, activeTab, allIcons]);

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Render the selected icon or a placeholder
  const renderSelectedIcon = () => {
    if (!selectedIcon) return <Search className="h-5 w-5" />;

    const iconElement = renderIcon(selectedIcon, "h-5 w-5");
    return iconElement || <Search className="h-5 w-5" />;
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm("");
  };

  // Get display name for the selected icon
  const getDisplayName = (iconName: string | null) => {
    if (!iconName) return "Pilih Icon";

    if (iconName.includes(":")) {
      // Extract just the name part after the colon
      return iconName.split(":")[1];
    }

    return iconName;
  };

  return (
    <div className="space-y-2">
      <Label>Icon Kategori</Label>
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full justify-between"
              type="button"
            >
              <div className="flex items-center gap-2">
                {renderSelectedIcon()}
                <span>{getDisplayName(selectedIcon)}</span>
              </div>
              <Search className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-4 border-b">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Cari icon..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Tabs
                defaultValue="lucide"
                value={activeTab}
                onValueChange={handleTabChange}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="lucide" className="flex-1">
                    Lucide
                  </TabsTrigger>
                  <TabsTrigger value="fa-solid" className="flex-1">
                    FA Solid
                  </TabsTrigger>
                  <TabsTrigger value="fa-regular" className="flex-1">
                    FA Regular
                  </TabsTrigger>
                  <TabsTrigger value="fa-brands" className="flex-1">
                    FA Brands
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="p-2 max-h-[300px] overflow-y-auto">
              {filteredIcons.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Tidak ada icon yang ditemukan
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  {filteredIcons.map((icon) => {
                    const isSelected = selectedIcon === icon.name;

                    // Render different icon types
                    let iconElement;
                    if (icon.type === "lucide") {
                      iconElement = <icon.component className="h-5 w-5" />;
                    } else if (icon.icon) {
                      // For Font Awesome icons
                      iconElement = (
                        <FontAwesomeIcon icon={icon.icon} className="h-5 w-5" />
                      );
                    } else {
                      // Fallback
                      iconElement = <Search className="h-5 w-5" />;
                    }

                    // Get display name without the prefix
                    const displayName = icon.name.includes(":")
                      ? icon.name.split(":")[1]
                      : icon.name;

                    return (
                      <Button
                        key={icon.name}
                        variant="ghost"
                        size="sm"
                        className={`p-2 h-auto flex flex-col items-center gap-1 ${
                          isSelected ? "bg-primary/10" : ""
                        }`}
                        onClick={() => {
                          onSelectIcon(icon.name);
                          setIsOpen(false);
                        }}
                        title={icon.name}
                      >
                        {iconElement}
                        <span className="text-xs truncate w-full text-center">
                          {displayName}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        {selectedIcon && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => onSelectIcon("")}
            className="h-10 w-10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Cari dan pilih icon dari Lucide atau Font Awesome yang sesuai untuk
        kategori ini
      </p>
    </div>
  );
}
