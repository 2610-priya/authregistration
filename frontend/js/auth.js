// Core Auth and Form Utilities

// --- TOKEN & STORAGE MANAGEMENT ---
const AuthStorage = {
    setSession(token, email, fullName) {
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_name", fullName);
    },
    getToken() {
        return localStorage.getItem("jwt_token");
    },
    getUserEmail() {
        return localStorage.getItem("user_email");
    },
    getUserName() {
        return localStorage.getItem("user_name");
    },
    clearSession() {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_name");
    },
    isAuthenticated() {
        return !!this.getToken();
    }
};

// --- ROUTE PROTECTION ---
function protectRoute(type) {
    const authenticated = AuthStorage.isAuthenticated();
    if (type === 'private' && !authenticated) {
        window.location.href = "login.html";
    } else if (type === 'guest' && authenticated) {
        window.location.href = "profile.html";
    }
}

// --- PASSWORD VISIBILITY TOGGLE ---
function setupPasswordToggles() {
    const toggles = document.querySelectorAll(".password-toggle");
    toggles.forEach(toggle => {
        toggle.addEventListener("click", (e) => {
            e.preventDefault();
            const container = toggle.closest(".input-container");
            const input = container.querySelector("input");
            const icon = toggle.querySelector("span");
            
            if (input.type === "password") {
                input.type = "text";
                icon.textContent = "👁️"; // Closed eye placeholder or text toggle
                toggle.setAttribute("aria-label", "Hide password");
            } else {
                input.type = "password";
                icon.textContent = "👁️‍🗨️";
                toggle.setAttribute("aria-label", "Show password");
            }
        });
    });
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'success') {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon = document.createElement("div");
    icon.className = "toast-icon";
    icon.textContent = type === 'success' ? "✔️" : "❌";

    const msg = document.createElement("div");
    msg.className = "toast-message";
    msg.textContent = message;

    const closeBtn = document.createElement("button");
    closeBtn.className = "toast-close";
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", () => {
        toast.style.animation = "fadeOut 0.3s forwards";
        setTimeout(() => toast.remove(), 300);
    });

    toast.appendChild(icon);
    toast.appendChild(msg);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    // Auto-remove toast after 4.5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = "fadeOut 0.3s forwards";
            setTimeout(() => toast.remove(), 300);
        }
    }, 4500);
}

// --- API CONNECTIONS (SAFE FETCH HELPER) ---
async function safeFetch(url, options) {
    try {
        return await fetch(url, options);
    } catch (error) {
        console.error("Network Fetch Error details:", error);
        throw new Error(`API Connection Failed: Unable to connect to the backend server at ${url}. Please ensure the server is running and CORS is allowed.`);
    }
}

// --- API ACTIONS (FETCH WRAPPERS) ---
const AuthAPI = {
    async register(fullName, email, password) {
        const url = `${CONFIG.getApiBaseUrl()}/api/auth/register`;
        const response = await safeFetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fullName, email, password })
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Registration failed!");
        }
        return data;
    },

    async login(email, password) {
        const url = `${CONFIG.getApiBaseUrl()}/api/auth/login`;
        const response = await safeFetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Login failed!");
        }
        return data; // contains token, email, fullName
    },

    async getProfile() {
        const token = AuthStorage.getToken();
        if (!token) throw new Error("No authorization token found");

        const url = `${CONFIG.getApiBaseUrl()}/api/user/profile`;
        const response = await safeFetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            AuthStorage.clearSession(); // Clean up expired/invalid sessions
            throw new Error("Failed to load user profile");
        }
        return await response.json();
    },

    async logout() {
        const token = AuthStorage.getToken();
        // Discard local tokens immediately
        AuthStorage.clearSession();

        const url = `${CONFIG.getApiBaseUrl()}/api/auth/logout`;
        try {
            await safeFetch(url, {
                method: "POST",
                headers: {
                    "Authorization": token ? `Bearer ${token}` : ""
                }
            });
        } catch (e) {
            // Ignore fetch errors during logout (offline/CORS changes)
        }
        window.location.href = "index.html";
    }
};

// --- FORM REALTIME VALIDATION RULES ---
const FormValidator = {
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    showError(inputElement, message) {
        inputElement.classList.add("invalid");
        inputElement.classList.remove("valid");
        
        const group = inputElement.closest(".form-group");
        const feedback = group.querySelector(".error-feedback");
        if (feedback) {
            feedback.textContent = message;
            feedback.style.display = "flex";
        }
    },

    clearError(inputElement) {
        inputElement.classList.remove("invalid");
        inputElement.classList.add("valid");
        
        const group = inputElement.closest(".form-group");
        const feedback = group.querySelector(".error-feedback");
        if (feedback) {
            feedback.textContent = "";
            feedback.style.display = "none";
        }
    },

    validateName(input) {
        const val = input.value.trim();
        if (!val) {
            this.showError(input, "Full name is required");
            return false;
        }
        this.clearError(input);
        return true;
    },

    validateEmail(input) {
        const val = input.value.trim();
        if (!val) {
            this.showError(input, "Email address is required");
            return false;
        }
        if (!this.isValidEmail(val)) {
            this.showError(input, "Please enter a valid email format");
            return false;
        }
        this.clearError(input);
        return true;
    },

    validatePassword(input) {
        const val = input.value;
        if (!val) {
            this.showError(input, "Password is required");
            return false;
        }
        if (val.length < 8) {
            this.showError(input, "Password must be at least 8 characters long");
            return false;
        }
        this.clearError(input);
        return true;
    },

    validateConfirmPassword(passwordInput, confirmInput) {
        const pVal = passwordInput.value;
        const cVal = confirmInput.value;
        if (!cVal) {
            this.showError(confirmInput, "Please confirm your password");
            return false;
        }
        if (pVal !== cVal) {
            this.showError(confirmInput, "Passwords do not match");
            return false;
        }
        this.clearError(confirmInput);
        return true;
    }
};
