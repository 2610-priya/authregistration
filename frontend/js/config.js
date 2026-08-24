// Frontend API Configuration Settings
const CONFIG = {
    // Replace this URL with your actual deployed Render API backend URL.
    // Ensure it uses HTTPS and has NO trailing slash.
    PRODUCTION_API_URL: "https://authregistration-2.onrender.com",
    
    getApiBaseUrl() {
        const hostname = window.location.hostname;
        const port = "8080"; // Default Spring Boot port
        
        // Resolve local addresses (localhost, loopback, file scheme, local IPs, and .local domains)
        const isLocal = hostname === "localhost" || 
                        hostname === "127.0.0.1" || 
                        hostname === "" || 
                        hostname.startsWith("192.168.") || 
                        hostname.startsWith("10.") || 
                        hostname.startsWith("172.") || 
                        hostname.endsWith(".local");
                        
        if (isLocal) {
            const host = hostname || "localhost";
            return `http://${host}:${port}`;
        }
        return this.PRODUCTION_API_URL;
    }
};
