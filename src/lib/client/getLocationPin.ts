type BuildingPin = {
	id: string;
	lat: number;
	lng: number;
};

export async function getBuildingPins(): Promise<BuildingPin[]> {
	return [
		{
			id: "80",
			lat: 13.740626,
			lng: 100.53252,
		},
		{
			id: "60",
			lat: 13.741834,
			lng: 100.532429,
		},
		{
			id: "dm_rung",
			lat: 13.741725,
			lng: 100.535053,
		},
		{
			id: "dm_bua",
			lat: 13.740554,
			lng: 100.53068,
		}
	];
}