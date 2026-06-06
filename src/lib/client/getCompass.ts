"use client";

import { useState, useEffect } from "react";

export function getCompass() {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOrientation = (event: any) => {
    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
	  // for ios
      setHeading(event.webkitCompassHeading);
    } else if (event.alpha !== null) {
	  //for android
      setHeading(360 - event.alpha);
    }
  };

  const requestPermission = async () => {
    if (typeof window === "undefined") return;

    const DeviceEvent = window.DeviceOrientationEvent as any;
    
    if (typeof DeviceEvent?.requestPermission === "function") {
      try {
        const permissionState = await DeviceEvent.requestPermission();
        if (permissionState === "granted") {
          window.addEventListener("deviceorientation", handleOrientation, true);
        } else {
          setError("Premission denied");
        }
      } catch (e) {
        setError("Can't request permission");
      }
    } else {
      // Bypass Type Narrowing
      if ("ondeviceorientationabsolute" in (window as any)) {
        (window as any).addEventListener("deviceorientationabsolute", handleOrientation, true);
      } else {
        window.addEventListener("deviceorientation", handleOrientation, true);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        (window as any).removeEventListener("deviceorientationabsolute", handleOrientation);
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, []);

  return { heading, error, requestPermission };
}