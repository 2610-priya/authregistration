// Frontend API Configuration Settings
const CONFIG = {
    // Replace this URL with your actual deployed Render API backend URL.
    // Ensure it uses HTTPS and has NO trailing slash.
    PRODUCTION_API_URL: "https://authregistration-backend.onrender.com",
    
    // Dynamically resolves the correct API base url depending on host environment
    getApiBaseUrl() {
        const hostname = window.location.hostname;
        if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "") {
            return "http://localhost:8080";
        }
        return this.PRODUCTION_API_URL;
    }
};
