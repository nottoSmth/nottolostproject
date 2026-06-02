"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function MapComponent() {
  return (
    <TransformWrapper
      initialScale={1}
      centerOnInit={true}
      wheel={{ step: 0.1 }}
    >
      <TransformComponent >
        <img
          src="/map.webp"
          alt="School Map"
          className="w-full h-full object-contain pointer-events-none select-none will-change-transform"
        />
      </TransformComponent>
    </TransformWrapper>
  );
}