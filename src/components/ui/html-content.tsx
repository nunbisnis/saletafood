"use client";

import React from "react";

interface HtmlContentProps {
  html: string;
  className?: string;
}

export function HtmlContent({ html, className = "" }: HtmlContentProps) {
  return (
    <div
      className={`prose ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
