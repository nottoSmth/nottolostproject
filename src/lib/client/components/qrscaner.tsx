"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("qr-video-container");

    scannerRef.current.start(
      { facingMode: "environment" },
      { fps: 10 },
      (decodedText) => {
        if (scannerRef.current) {
          scannerRef.current.stop().then(() => onScan(decodedText));
        }
      },
      () => {}
    ).catch((err) => {
      console.error(err);
    });

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="relative w-full h-full max-w-md overflow-hidden flex items-center justify-center">
        <div id="qr-video-container" className="w-full h-full object-cover"></div>
        
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          <div className="w-64 h-64 border-2 border-pink-500 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl -mt-0.5 -ml-0.5"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl -mt-0.5 -mr-0.5"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl -mb-0.5 -ml-0.5"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl -mb-0.5 -mr-0.5"></div>
          </div>
        </div>
      </div>

      <button 
        onClick={onClose}
        className="absolute bottom-10 z-20 px-8 py-3 bg-white/20 backdrop-blur-md text-white font-bold rounded-full border border-white/40 active:bg-white/30"
      >
        ยกเลิกการสแกน
      </button>
    </div>
  );
}