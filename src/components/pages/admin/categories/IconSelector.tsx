"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import * as HiIcons from "react-icons/hi";
import * as HiIcons2 from "react-icons/hi2";
import * as RiIcons from "react-icons/ri";
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

// Icon library types
type IconLibrary = "lucide" | "heroicons" | "heroicons2" | "remix";

// Icon type definition
type IconInfo = {
  name: string;
  type: IconLibrary;
  component: React.ElementType;
};

export function IconSelector({
  selectedIcon,
  onSelectIcon,
}: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIcons, setFilteredIcons] = useState<IconInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<IconLibrary>("lucide");
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

  // Get Heroicons (v1)
  const heroIcons = useMemo(() => {
    return Object.keys(HiIcons)
      .filter(
        (key) =>
          key.startsWith("Hi") &&
          typeof HiIcons[key as keyof typeof HiIcons] === "function"
      )
      .map((name) => ({
        name: `heroicons:${name}`,
        type: "heroicons" as const,
        component: HiIcons[name as keyof typeof HiIcons] as React.ElementType,
      }));
  }, []);

  // Get Heroicons v2
  const heroIcons2 = useMemo(() => {
    return Object.keys(HiIcons2)
      .filter(
        (key) =>
          key.startsWith("Hi") &&
          typeof HiIcons2[key as keyof typeof HiIcons2] === "function"
      )
      .map((name) => ({
        name: `heroicons2:${name}`,
        type: "heroicons2" as const,
        component: HiIcons2[name as keyof typeof HiIcons2] as React.ElementType,
      }));
  }, []);

  // Get Remix Icons
  const remixIcons = useMemo(() => {
    return Object.keys(RiIcons)
      .filter(
        (key) =>
          key.startsWith("Ri") &&
          typeof RiIcons[key as keyof typeof RiIcons] === "function"
      )
      .map((name) => ({
        name: `remix:${name}`,
        type: "remix" as const,
        component: RiIcons[name as keyof typeof RiIcons] as React.ElementType,
      }));
  }, []);

  // All icons combined
  const allIcons = useMemo(() => {
    return {
      lucide: lucideIcons,
      heroicons: heroIcons,
      heroicons2: heroIcons2,
      remix: remixIcons,
    };
  }, [lucideIcons, heroIcons, heroIcons2, remixIcons]);

  // Filter icons based on search term or show default icons
  useEffect(() => {
    const currentIcons = allIcons[activeTab] || [];

    if (!searchTerm) {
      // If no search term, show first 30 icons by default
      setFilteredIcons(currentIcons.slice(0, 30));
      return;
    }

    // Filter icons based on search term
    const filtered = currentIcons.filter((icon) => {
      const searchName = icon.name.includes(":")
        ? icon.name.split(":")[1]
        : icon.name;
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
    setActiveTab(value as IconLibrary);
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
          <PopoverContent className="w-96 p-0" align="start">
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
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="lucide">Lucide</TabsTrigger>
                  <TabsTrigger value="heroicons">Heroicons</TabsTrigger>
                  <TabsTrigger value="heroicons2">Heroicons v2</TabsTrigger>
                  <TabsTrigger value="remix">Remix</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="p-2 max-h-[300px] overflow-y-auto">
              {filteredIcons.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Tidak ada icon yang ditemukan
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-1">
                  {filteredIcons.map((icon) => {
                    const isSelected = selectedIcon === icon.name;

                    // Render icon based on type
                    const iconElement = <icon.component className="h-4 w-4" />;

                    // Get display name without the prefix
                    const displayName = icon.name.includes(":")
                      ? icon.name.split(":")[1]
                      : icon.name;

                    return (
                      <Button
                        key={icon.name}
                        variant="ghost"
                        size="sm"
                        className={`p-1.5 h-auto flex flex-col items-center justify-center gap-1 ${
                          isSelected ? "bg-primary/10" : ""
                        }`}
                        onClick={() => {
                          onSelectIcon(icon.name);
                          setIsOpen(false);
                        }}
                        title={icon.name}
                      >
                        <div className="flex items-center justify-center h-6">
                          {iconElement}
                        </div>
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
        Cari dan pilih icon dari berbagai library yang sesuai untuk kategori ini
      </p>
    </div>
  );
}
