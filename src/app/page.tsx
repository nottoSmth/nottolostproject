"use client"

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MapComponent from "@/lib/client/components/map";
import QRScanner from "@/lib/client/components/qrscaner";
import { parseQRLocation } from "@/lib/client/scanqr";
import { getGPS } from "@/lib/client/getGpsLocation";

interface LocationPoint {
  x: number;
  y: number;
}

function MainContent() {
  const searchParams = useSearchParams();
  const [isScanning, setIsScanning] = useState(false);
  const [currentPos, setCurrentPos] = useState<LocationPoint | null>(null)

  const gps = getGPS();

  const processLocation = (data: string) => {
    const result = parseQRLocation(data);
    if (result.success && result.point) {
      alert(`Current location : ${result.point.name}\n X: ${result.point.x}, Y: ${result.point.y}`)
      setCurrentPos(result.point)
    }
    else {
      alert(`Qr not found`)
    }
  }

  useEffect(() => {
    const qrParam = searchParams.get("qr");
    if (qrParam) processLocation(qrParam);
  }, [searchParams])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-pink-50 font-sans">
      {isScanning && (
        <QRScanner onScan={(data) => { setIsScanning(false); processLocation(data); }} onClose={() => setIsScanning(false)} />
      )}
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
        <MapComponent/>

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-slate-100 z-10">
          <span className="text-sm font-semibold text-pink-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            {currentPos ? `X: ${currentPos.x}, Y: ${currentPos.y}` : "รอรับพิกัด"}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-md border border-slate-100 z-10 text-[10px] text-slate-500 font-mono">
          Lat: {gps.latitude?.toFixed(6)} <br/>
          Lng: {gps.longitude?.toFixed(6)}
        </div>
      </div>

      {/* Always bottom, no scroll */}
      <footer className="shrink-0 bg-white px-6 py-6 rounded-t-3xl shadow-xl">
        <button
          onClick={() => setIsScanning(true)}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] text-lg">
          สแกน QR
        </button>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-pink-500 font-bold">กำลังโหลด...</div>}>
      <MainContent />
    </Suspense>
  );
}