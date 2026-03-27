import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { detectCountry, DEFAULT_COUNTRY } from "../utils/detectCountry";

export default function CountryRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    async function redirectUser() {
      let country = DEFAULT_COUNTRY;
      let region = "ts";
      let city = "hyd";

      try {
        const res = await fetch("/api/detect-location");
        const data = await res.json();

        if (data.country) {
          country = data.country.toLowerCase();
          region = data.region?.toLowerCase() || region;
          city = data.city?.toLowerCase().replace(/\s+/g, "-") || city;
        } else {
          country = detectCountry();
        }
      } catch (err) {
        country = detectCountry();
      }

      localStorage.setItem("user_country", country);
      localStorage.setItem("user_region", region);
      localStorage.setItem("user_city", city);

      navigate(`/${country}/${region}/${city}`, { replace: true });
    }

    redirectUser();
  }, [navigate]);

  return null;
}
