// app/services/OnlineSync.js
"use client"; // This ensures the component is treated as a client component

import { useEffect } from "react";
import { syncSales } from "./offlineSync";

const OnlineSync = () => {
  useEffect(() => {
    const handleOnline = () => {
      syncSales();
    };

    window.addEventListener("online", handleOnline);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null; // This component does not render anything
};

export default OnlineSync;
