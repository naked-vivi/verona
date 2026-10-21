import { GEOCODING_URL } from "./config";

type Position = {
  latitude: number;
  longitude: number;
};

export async function getAddress({ latitude, longitude }: Position) {
  const res = await fetch(
    `${GEOCODING_URL}?latitude=${latitude}&longitude=${longitude}`
  );
  if (!res.ok) throw Error("Failed getting address");

  const data = await res.json();
  return data;
}
