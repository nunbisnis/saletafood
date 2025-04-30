"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Type for the icon selector props
interface IconSelectorProps {
  selectedIcon: string | null;
  onSelectIcon: (iconName: string) => void;
}

export function IconSelector({
  selectedIcon,
  onSelectIcon,
}: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIcons, setFilteredIcons] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get all available Lucide icons - memoized to prevent recreation on each render
  const allIcons = useMemo(() => {
    return Object.keys(LucideIcons).filter(
      (key) => key !== "createLucideIcon" && key !== "default"
    );
  }, []);

  // Filter icons based on search term or show default icons
  useEffect(() => {
    if (!searchTerm) {
      // If no search term, show first 30 icons by default
      setFilteredIcons(allIcons.slice(0, 30));
      return;
    }

    // Filter icons based on search term
    const filtered = allIcons.filter((iconName) =>
      iconName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIcons(filtered.slice(0, 100)); // Limit to 100 results for performance
  }, [searchTerm, allIcons]);

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
    if (selectedIcon && LucideIcons[selectedIcon as keyof typeof LucideIcons]) {
      const IconComponent = LucideIcons[
        selectedIcon as keyof typeof LucideIcons
      ] as React.ElementType;
      return <IconComponent className="h-5 w-5" />;
    }
    return <Search className="h-5 w-5" />;
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
                <span>{selectedIcon || "Pilih Icon"}</span>
              </div>
              <Search className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Cari icon..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="p-2 max-h-[300px] overflow-y-auto">
              {filteredIcons.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Tidak ada icon yang ditemukan
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  {filteredIcons.map((iconName) => {
                    const IconComponent = LucideIcons[
                      iconName as keyof typeof LucideIcons
                    ] as React.ElementType;
                    return (
                      <Button
                        key={iconName}
                        variant="ghost"
                        size="sm"
                        className={`p-2 h-auto flex flex-col items-center gap-1 ${
                          selectedIcon === iconName ? "bg-primary/10" : ""
                        }`}
                        onClick={() => {
                          onSelectIcon(iconName);
                          setIsOpen(false);
                        }}
                        title={iconName}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="text-xs truncate w-full text-center">
                          {iconName}
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
        Cari dan pilih icon yang sesuai untuk kategori ini
      </p>
    </div>
  );
}
