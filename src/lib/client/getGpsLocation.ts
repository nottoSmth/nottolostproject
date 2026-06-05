import { useState, useEffect } from "react";
import { NAV_CONFIG } from "@/config/navigation.config";

interface GPSData {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  isHighAccuracy: boolean;
  error: string | null;
}

export const getGPS = () => {
  const [gpsData, setGpsData] = useState<GPSData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    isHighAccuracy: false,
    error: null,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGpsData((prev) => ({ ...prev, error: "Geolocation not supported" }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const isHighAccuracy = accuracy <= NAV_CONFIG.GPS_ACCURACY_THRESHOLD_METERS;

        setGpsData({
          latitude,
          longitude,
          accuracy,
          isHighAccuracy,
          error: null,
        });
      },
      (error) => {
        setGpsData((prev) => ({ ...prev, error: error.message }));
      },
      {
        enableHighAccuracy: NAV_CONFIG.ENABLE_HIGH_ACCURACY_MODE,
        maximumAge: NAV_CONFIG.MAX_CACHE_AGE_MS,
        timeout: NAV_CONFIG.TIMEOUT_MS,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return gpsData;
};