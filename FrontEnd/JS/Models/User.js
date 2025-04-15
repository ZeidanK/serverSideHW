/**
 * User class that represents logged-in user data
 */
class User {
    constructor(id, name, email, active) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = active;
    }
}

/**
 * User authentication and session management
 */
const UserManager = {
    /**
     * Current logged in user
     */
    currentUser: null,
    
    /**
     * Constants for storage keys
     */
    STORAGE_KEYS: {
        TOKEN: 'auth_token',
        USER: 'user_data',
        EXPIRY: 'token_expiry'
    },

    /**
     * Initialize user from stored session
     */
    initialize: function() {
        // Try to restore session from localStorage
        const userJson = localStorage.getItem(this.STORAGE_KEYS.USER);
        const token = localStorage.getItem(this.STORAGE_KEYS.TOKEN);
        const expiry = localStorage.getItem(this.STORAGE_KEYS.EXPIRY);
        
        // Check if token is still valid
        if (userJson && token && expiry && Date.now() < parseInt(expiry)) {
            try {
                const userData = JSON.parse(userJson);
                this.currentUser = new User(
                    userData.id,
                    userData.name,
                    userData.email,
                    userData.active
                );
            } catch (e) {
                console.error("Failed to restore user session", e);
                this.clearSession();
            }
        } else if (userJson || token || expiry) {
            // If any are present but not all valid, clear for consistency
            this.clearSession();
        }
    },

    /**
     * Check if user is logged in by checking local storage
     * @returns {Promise<boolean>} Promise resolving to login status
     */
    isLoggedIn: async function() {
        // First check if we already have a user object
        if (this.currentUser) {
            return true;
        }
        
        try {
            // Try to restore session first
            this.initialize();
            
            // If still no current user, we're not logged in
            return !!this.currentUser;
        } catch (error) {
            console.error("Session check failed:", error);
            return false;
        }
    },

    /**
     * Clear the current session
     */
    clearSession: function() {
        localStorage.removeItem(this.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(this.STORAGE_KEYS.USER);
        localStorage.removeItem(this.STORAGE_KEYS.EXPIRY);
        this.currentUser = null;
    },

    /**
     * Get the current authentication token
     */
    getToken: function() {
        return localStorage.getItem(this.STORAGE_KEYS.TOKEN);
    },

    /**
     * Log in a user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<User>} Promise resolving to logged in user
     */
    login: async function(email, password) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "https://localhost:7026/api/auth/login",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ email, password }),
                success: (response) => {
                    // Expecting response to have { token, user, expiresIn } structure
                    if (response && response.token && response.user) {
                        // Save the auth token
                        localStorage.setItem(this.STORAGE_KEYS.TOKEN, response.token);
                        
                        // Calculate and store expiry time
                        const expiryTime = Date.now() + (response.expiresIn || 86400) * 1000; // Default 24h
                        localStorage.setItem(this.STORAGE_KEYS.EXPIRY, expiryTime);
                        
                        // Save user info
                        localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(response.user));
                        
                        // Set current user
                        this.currentUser = new User(
                            response.user.id,
                            response.user.name,
                            response.user.email,
                            response.user.active
                        );
                        
                        resolve(this.currentUser);
                    } else {
                        reject("Login response missing token or user data");
                    }
                },
                error: (xhr) => {
                    reject(xhr.responseJSON || xhr.statusText);
                }
            });
        });
    },

    /**
     * Log out the current user
     * @returns {Promise<boolean>} Promise resolving to success status
     */
    logout: async function() {
        // Clear local storage first
        this.clearSession();
        
        // Optionally notify server (if you want to invalidate the token server-side)
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "https://localhost:7026/api/auth/logout",
                type: "POST",
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                },
                success: () => {
                    resolve(true);
                },
                error: (xhr) => {
                    // Even if server logout fails, we've already cleared client-side
                    console.warn("Server logout failed, but client session was cleared");
                    resolve(true);
                }
            });
        });
    },

    /**
     * Update the UI based on login status
     */
    updateUI: async function() {
        try {
            const isUserLoggedIn = await this.isLoggedIn();
            
            // Elements that should be visible only when logged in
            $('.logged-in-only').toggle(isUserLoggedIn);
            
            // Elements that should be visible only when logged out
            $('.logged-out-only').toggle(!isUserLoggedIn);
            
            // Update user name display if applicable
            if (isUserLoggedIn && this.currentUser) {
                $('.user-name-display').text(this.currentUser.name);
            }
        } catch (error) {
            console.error("Failed to update UI:", error);
        }
    }
};

// Initialize when document is ready
$(document).ready(function() {
    // Initialize user session
    UserManager.initialize();
    
    // Update UI based on session status
    UserManager.updateUI();
});