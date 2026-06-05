"use client"

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MapComponent from "@/lib/client/components/map";
import QRScanner from "@/lib/client/components/qrscaner";
import { getGPS } from "@/lib/client/getGpsLocation";
import { getBuildingPins } from "@/lib/client/getLocationPin";

interface LocationPoint {
  x: number;
  y: number;
  name: string
}

// For calibration
const MAP_CALIBRATION = {
  P1: { lat: 13.741725, lng: 100.535053, x: 234.57, y: 102.57 }, //rung
  P2: { lat: 13.740554, lng: 100.53068, x: -238.00, y: -27.71 } //ku bua
};

const convertGPSToMapXY = (lat: number, lng: number, name: string): LocationPoint => {
  const { P1, P2 } = MAP_CALIBRATION;
  const mapX = P1.x + (lng - P1.lng) * ((P2.x - P1.x) / (P2.lng - P1.lng));
  const mapY = P1.y + (lat - P1.lat) * ((P2.y - P1.y) / (P2.lat - P1.lat));
  return { x: mapX, y: mapY, name };
};

function MainContent() {
  const searchParams = useSearchParams();
  const gps = getGPS();

  const [isScanning, setIsScanning] = useState(false);
  const [currentPos, setCurrentPos] = useState<LocationPoint | null>(null)

  const [allPins, setAllPins] = useState<LocationPoint[]>([])

  useEffect(() => {
    async function fetchAndMapPins() {
      try {
        const pinsFromFireBase = await getBuildingPins();
        const autoMappedPins = pinsFromFireBase.map((pin) => 
          convertGPSToMapXY(pin.lat, pin.lng, pin.id)
        );
        setAllPins(autoMappedPins);
      }
      catch (error){
        console.error("Failed to load pins: ", error)
      }
    }
    fetchAndMapPins();
  }, []);

  const processLocation = (rawData: string) => {
    try {
      let jsonString = rawData;
      if (rawData.startsWith("http")) {
        const url = new URL(rawData);
        jsonString = url.searchParams.get("qr") || rawData;
      }
      const data = JSON.parse(jsonString);
      
      if (data.location) {
        const foundPin = allPins.find(pin => pin.name === data.location);
        if (foundPin) {
          setCurrentPos(foundPin);
          return;
        }
      }
      alert("Pins not found");
    } catch (e) {
      alert("QR not found");
    }
  }

  useEffect(() => {
    if (allPins.length > 0) {
      const qrParam = searchParams.get("qr");
      if (qrParam) processLocation(qrParam);
    }
  }, [searchParams, allPins]);

  useEffect(() => {
    if (gps.latitude && gps.longitude && gps.accuracy) {
      if (gps.accuracy <= 10) {
        setCurrentPos(convertGPSToMapXY(gps.latitude, gps.longitude, "📍 ตำแหน่งของคุณ"));
      }
    }
  }, [gps.latitude, gps.longitude, gps.accuracy]);

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
          ระบบนำทาง
        </p>
      </header>

      {/* Fill remaining space, no overflow */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <MapComponent currentPos={currentPos} allLocations={allPins}/>

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-slate-100 z-10">
          <span className="text-sm font-semibold text-pink-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            {currentPos ? `${currentPos.name}` : "รอรับพิกัด"}
          </span>
        </div>

        {/* Debug */}
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