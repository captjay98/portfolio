import axios from "axios";

interface GeoIPResponse {
  ip: string;
  country_code: string;
  country_name: string;
}

export const getGeoIPData = async (ipAddress: string): Promise<{
  ip: string;
  code: string;
  name: string;
} | null> => {
  try {
    const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
    const data = response.data as GeoIPResponse;

    return {
      ip: data.ip,
      code: data.country_code,
      name: data.country_name,
    };
  } catch (error) {
    console.error("Error fetching GeoIP data:", error);
    return null;
  }
};
