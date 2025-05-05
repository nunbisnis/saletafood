"use client";

import { useEffect, useRef } from "react";

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
}

export function GoogleMap({
  latitude,
  longitude,
  zoom = 15,
  height = "400px",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-md" style={{ height }}>
      <iframe
        ref={mapRef}
        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.2752998788513!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjUnMTQuNyJTIDEwOcKwMTQnNTIuNCJF!5e0!3m2!1sid!2sid!4v1625123456789!5m2!1sid!2sid`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps"
      />
    </div>
  );
}
