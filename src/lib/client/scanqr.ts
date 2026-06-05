import { getBuildingPins } from "./getPinLocation";

export const parseQRLocation = async (rawData: string) => {
  let data = rawData;

  if (rawData.startsWith("http")) {
    const url = new URL(rawData);
    const qrParam = url.searchParams.get("qr");

    if (!qrParam) {
      return { success: false };
    }

    data = qrParam;
  }
  const parsed = JSON.parse(data);
  const id = parsed.location;

  const pins = await getBuildingPins();
  const found = pins.find(p => p.id === id);

  if (!found) {
    return { success: false };
  }

  return {
    success: true,
    point: {
      name: `Building ${found.id}`,
      x: found.lat,
      y: found.lng
    }
  };
};