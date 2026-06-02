"use client"

import { useState } from "react";
import MapComponent from "@/lib/client/components/map";
import QRScanner from "@/lib/client/components/qrscaner";

export default function Page() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-pink-50 font-sans">
      <header className="bg-white shadow-sm px-6 py-4 z-20 shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          แผนที่เตรียมอุดมฯ
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          ระบบนำทาง Open House
        </p>
      </header>

      {/* Fill remaining space, no overflow */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <MapComponent />

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-slate-100 z-10">
          <span className="text-sm font-semibold text-pink-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            รอรับพิกัด...
          </span>
        </div>
      </div>

      {/* Always bottom, no scroll */}
      <footer className="shrink-0 bg-white px-6 py-6 rounded-t-3xl shadow-xl">
        <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] text-lg">
          สแกน QR
        </button>
      </footer>
    </div>
  );
}