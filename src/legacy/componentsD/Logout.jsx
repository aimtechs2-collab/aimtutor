import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../utils/api";
import { clearUser } from "../store/slices/authSlice";
import { LogOut } from "lucide-react";


function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      // Optional backend logout call
      await api.post("/api/v1/auth/logout").catch(() => {});

      // Clear Redux + localStorage
      dispatch(clearUser());
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      navigate("/");

    } catch (err) {
      console.error("[Logout] Error:", err);
      // Still clear local state even if backend fails
      dispatch(clearUser());
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={logoutHandler}
        className="flex items-center justify-center cursor-pointer 
          px-4 py-2 md:px-6 md:py-2 
          bg-gradient-to-r from-blue-600 to-purple-600 text-white 
          rounded-full font-medium transition-all duration-200 
          hover:shadow-lg hover:scale-105 hover:from-blue-700 
          hover:to-purple-700
          text-sm md:text-base"
      >
        {/* Option 1: Text only */}
        Logout
        
         {/* Option 2: Icon only on mobile, text + icon on desktop */}
         {/* <span className="hidden md:inline">Logout</span>
        <LogOut className="w-4 h-4 md:ml-2" /> 
         */}
        {/* Option 3: Icon only on mobile, text on desktop */}
        {/* <>
          <span className="hidden md:inline">Logout</span>
          <LogOut className="w-4 h-4 md:hidden" />
        </> */}
      </button>
    </div>
  );
}

export default Logout;