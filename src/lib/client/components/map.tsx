"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface LocationPoint {
  x: number;
  y: number;
  name: string;
}

interface MapComponentProps {
  currentPos: LocationPoint | null;
  allLocations?: LocationPoint[];
  routePoints?: LocationPoint[];
  heading: number | null;
}

export default function MapComponent({ currentPos, allLocations = [], routePoints = [], heading }: MapComponentProps) {
  console.log("=== Debug All Locations ===", allLocations);
  const mapWidth = 1351;
  const mapHeight = 877;
  const pixelsPerMeter = 1.75;

  const originX = mapWidth / 2;
  const originY = mapHeight / 2;

  const getPixelX = (mathX: number) => originX + (mathX * pixelsPerMeter);
  const getPixelY = (mathY: number) => originY - (mathY * pixelsPerMeter);

  const polylinePoints = routePoints.map((p) => `${getPixelX(p.x)},${getPixelY(p.y)}`).join(" ");

  // For debug only
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const clickPixelX = e.nativeEvent.offsetX;
    const clickPixelY = e.nativeEvent.offsetY;

    const mathX = (clickPixelX - originX) / pixelsPerMeter;
    const mathY = (originY - clickPixelY) / pixelsPerMeter;

    alert(
      `📍 พิกัดสำหรับนำไปใส่ใน locationDB:\nx: ${mathX.toFixed(2)}, y: ${mathY.toFixed(2)}\n\n` +
      `🔍 พิกัด Pixel ดิบ (สำหรับทำ Calibration GPS):\nPixel X: ${clickPixelX}, Pixel Y: ${clickPixelY}`
    );
  };

  return (
    <TransformWrapper
      initialScale={1}
      centerOnInit={true}
      minScale={0.5}
      maxScale={8}
      wheel={{ step: 0.1 }}
    >
      <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
        <div
          className="relative cursor-crosshair"
          style={{ width: `${mapWidth}px`, height: `${mapHeight}px` }}
          onClick={handleImageClick}
        >
          <img
            src="/map.webp"
            alt="School Map"
            // className="w-full h-full object-contain pointer-events-none select-none will-change-transform"
            className="w-full h-full object-cover pointer-events-auto select-none cursor-crosshair"
            // for debug only
            draggable={false}
          />

          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {routePoints.length > 1 && (
              <>
                {/* เส้นขอบสีขาว (Outline) ให้เส้นดูมีมิติ */}
                <polyline
                  points={polylinePoints}
                  fill="none"
                  stroke="white"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-70"
                />
                {/* เส้นสีชมพูหลัก (Main Path) */}
                <polyline
                  points={polylinePoints}
                  fill="none"
                  stroke="#ec4899" // สี pink-500
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-lg"
                  strokeDasharray="15, 10" // ทำให้เป็นเส้นประ (ถ้าอยากได้เส้นทึบให้ลบบรรทัดนี้ออก)
                />
              </>
            )}
          </svg>

          {allLocations.map((loc, idx) => (
            <div
              key={idx}
              className="absolute w-4 h-4 bg-slate-400 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-sm z-20"
              style={{
                left: `${getPixelX(loc.x)}px`,
                top: `${getPixelY(loc.y)}px`,
              }}
            >
              <span className="absolute top-5 left-1/2 transform -translate-x-1/2 text-[10px] text-slate-700 font-bold whitespace-nowrap bg-white/90 px-1.5 py-0.5 rounded backdrop-blur-sm">
                {loc.name}
              </span>
            </div>
          ))}
          {currentPos && (
            <div
              className="absolute w-8 h-8 z-30 transition-all duration-1000 ease-linear"
              style={{
                left: `${getPixelX(currentPos.x)}px`,
                top: `${getPixelY(currentPos.y)}px`,
                transform: "translate(-50%, -50%)"
              }}
            >
              {heading !== null && (
                <div
                  className="absolute top-1/2 left-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[50px] border-b-blue-400/40"
                  style={{
                    transform: `translate(-50%, -100%) rotate(${heading}deg)`,
                    transformOrigin: "bottom center",
                  }}
                />
              )}
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 shadow-md z-30" />
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-400 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping opacity-70 z-20" />
              {/* <span className="text-sm">{currentPos.name}</span>
              <span className="text-[10px] text-pink-200 mt-0.5 tracking-wider font-mono">
                X:{currentPos.x.toFixed(1)} Y:{currentPos.y.toFixed(1)}
              </span>
              <div className="w-3 h-3 bg-pink-600 rotate-45 -mb-3 mt-1"></div> */}
            </div>
          )}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}