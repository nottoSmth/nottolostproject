
import { collection, getDocs } from "firebase/firestore";
import { singletonFirestorePublic } from "@/lib/client/singleton/client.firebasePublic";

const CACHE_KEY = "building-pin-cache";
const CACHE_TIME_KEY = "building-pin-cache-time";

type BuildingPin = {
  id: string;
  lat: number;
  lng: number;
};

export async function getBuildingPins(): Promise<BuildingPin[]> {
  const now = Date.now();

  // 1. Check cache
  const cached = localStorage.getItem(CACHE_KEY);
  const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
  
  if (cached && cachedTime) {
      const age = now - Number(cachedTime);
      
      if (age < 1000*60*60) { // 1hr
        return JSON.parse(cached);
    }
  }
  
  // 2. Fetch from Firestore
  const db = singletonFirestorePublic;
  const snapshot = await getDocs(collection(db, "building-pin"));
  
  const result: BuildingPin[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    
    return {
      id: doc.id,
      lat: data.gps.latitude,
      lng: data.gps.longitude,
    };
  });

  // 3. Save cache
  localStorage.setItem(CACHE_KEY, JSON.stringify(result));
  localStorage.setItem(CACHE_TIME_KEY, now.toString());

  return result;
}