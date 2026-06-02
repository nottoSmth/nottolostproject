"use client";

import { useEffect, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserQRCodeReader | null>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const startCamera = async () => {
      readerRef.current = new BrowserQRCodeReader();

      try {
        controlsRef.current =
          await readerRef.current.decodeFromVideoDevice(
            undefined,
            videoRef.current!,
            (result, err) => {
              if (result) {
                // ✅ stop scanning
                controlsRef.current?.stop();
                onScan(result.getText());
              }
            }
          );
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();

    return () => {
      controlsRef.current?.stop();
    };
  }, [onScan]);
  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center overflow-hidden">
      {/* Square camera container */}
      <div className="relative w-[80vw] max-w-sm aspect-square overflow-hidden rounded-2xl">

        {/* REAL camera */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />

        {/* Overlay (perfectly aligned now) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          <div className="w-1/1 h-1/1 border-2 border-pink-500 rounded-2xl relative">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-xl"></div>
          </div>
        </div>
      </div>

      {/* Dark outside area (optional but nice) */}

      {/* Close button */}
      <button
        onClick={() => {
          controlsRef.current?.stop();
          onClose();
        }}
        className="absolute bottom-10 z-20 px-8 py-3 bg-white/20 backdrop-blur-md text-white font-bold rounded-full border border-white/40 active:bg-white/30"
      >
        ยกเลิกการสแกน
      </button>
    </div>
  );
}