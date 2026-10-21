const { VITE_API_URL, VITE_GEOCODING_URL } = import.meta.env;

// * Fail loudly when the .env file (or the hosting provider's variables) is missing
if (!VITE_API_URL || !VITE_GEOCODING_URL) {
  throw new Error("Missing VITE_API_URL or VITE_GEOCODING_URL. Copy .env.example to .env and fill it in.");
}

export const API_URL = VITE_API_URL;
export const GEOCODING_URL = VITE_GEOCODING_URL;
