import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@appwrite.io/pink-icons";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
    // <BrowserRouter basename="/cwh_management_v2">
    <StrictMode>
        <App />
    </StrictMode>
    // </BrowserRouter>
);
