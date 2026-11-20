
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Auth from "./Auth.jsx";
import "./styles.css";
import "@xyflow/react/dist/style.css";
import { supabase } from "./supabase.js";

console.log("Supabase configured:", !!supabase);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth>
      <App />
    </Auth>
  </React.StrictMode>
);
