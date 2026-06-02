export const locationDB: Record<string, { x: number; y: number; name: string }> = {
  "building-80": { x: 50.0, y: 15.5, name: "ตึก 80 ปี" },
  "building-60": { x: -10.0, y: 25.0, name: "ตึง 60 ปี" },
};

export const parseQRLocation = (rawData: string) => {
  try {
    let jsonString = rawData;

    if (rawData.startsWith("http")) {
      const url = new URL(rawData);
      jsonString = url.searchParams.get("qr") || rawData;
    }

    const data = JSON.parse(jsonString);

    if (data.location && locationDB[data.location]) {
      const point = locationDB[data.location];
      return { success: true, point: point };
    }
    return { success: false, point: null };

  } catch (e) {
    return { success: false, point: null };
  }
};