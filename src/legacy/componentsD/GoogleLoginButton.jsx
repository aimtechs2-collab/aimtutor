import React, { useEffect } from "react";
import api from '../utils/api'
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/auth";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("gSignInDiv"),
      {
        theme: "white",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "center",
      }
    );
  }, []);

  const handleGoogleResponse = (response) => {
    const id_token = response.credential;
    // console.log("Google ID Token:", id_token);
    // console.log("Sending ID token to backend...", id_token);
    api.post("/api/v1/auth/google", { token: id_token })
      .then((response) => {
        // console.log("Your App's JWT from google auth:", response.data.access_token);
        // localStorage.setItem("token", response.data.jwt);
        saveToken(response.data.access_token)
        navigate("/student/profile")
      })
      .catch((error) => {
        console.error("Error during Google login:", error);
      });

  };

  return <div id="gSignInDiv"
    className="m-8"></div>;
};

export default GoogleLoginButton;

