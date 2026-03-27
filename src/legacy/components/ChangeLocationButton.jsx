import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Globe,ChevronRight} from "lucide-react"; // optional: lightweight icon library


const ChangeLocationButton = () => {
  const navigate = useNavigate();
  const { city } = useParams();

  const displayCountry = city ? city.replace(/-/g, " ") :  "Your City";

  const handleClick = () => {
    navigate("/choose-country-region");
  };

  return (
    <a
      href="/choose-country-region"
     className="flex items-center gap-3 ml-4 text-3xl text-white-700 hover:text-blue-600 cursor-pointer transition"

    >
      <Globe className="h-6 w-6" />
      <span className="text-xl font-medium">{displayCountry}</span>
       <ChevronRight className="h-5 w-5 text-gray-500" />
    </a>
  );
};

export default ChangeLocationButton;
