"use client"

import { useState } from "react";
import MapComponent from "@/lib/client/components/map";
import QRScanner from "@/lib/client/components/qrscaner";

export default function Page() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState();
  return (
    <div className="flex flex-col h-screen bg-pink-50 font-sans overflow-hidden">
      <header className="bg-white shadow-sm px-6 py-4 z-20">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          แผนที่เตรียมอุดมฯ
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          ระบบนำทาง Open House
        </p>
      </header>

      <main className="flex-1 relative bg-pink-100/50 flex items-center justify-center">
        <MapComponent/>
        
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-slate-100 z-10">
          <span className="text-sm font-semibold text-pink-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            รอรับพิกัด...
          </span>
        </div>
      </main>

      <footer className="bg-white px-6 py-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
         <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] text-lg">
           สแกน QR
         </button>
      </footer>
    </div>
  );
}