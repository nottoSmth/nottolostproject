"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function MapComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={8}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
      >
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          <img
            src="/map.svg"
            alt="School Map"
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
