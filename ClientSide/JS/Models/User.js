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
// const port = "";
// const address = "https://proj.ruppin.ac.il/cgroup4/test2/tar1";

const port = "7026";
const address = "https://localhost:"

/**
 * User authentication and session management
 */
const UserManager = {
    ajaxCall: function(method, api, data, successCB, errorCB) {
        const jwtToken = localStorage.getItem('jwtToken');

        $.ajax({
            type: method,
            url: `${address}${port}${api}`,
            data: data,
            cache: false,
            contentType: "application/json",
            dataType: "json",
            headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
            success: successCB,
            error: errorCB
        });
    },

    currentUser: null,

    logIn: function(user) {
        UserManager.ajaxCall(
            'POST',
            '/api/Users/LoginJWT',
            JSON.stringify(user),
            function(response) {
                if (response.Token || response.token) {
                    const token = response.Token || response.token;
                    localStorage.setItem('jwtToken', token);
                    window.location.href = '../index.html';
                } else {
                    alert("Invalid token received");
                }
            },
            function(error) {
                console.error('Login failed:', error);
                alert(error.responseJSON?.message || 'Login failed. Please try again.');
            }
        );
    },

    logOut: function() {
        this.currentUser = null;
        localStorage.removeItem('jwtToken');
    },

    getLoggedInUser: function() {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) return null;

        try {
            const payload = JSON.parse(atob(jwtToken.split('.')[1]));
            return new User(payload.id, payload.name, payload.sub, true);
        } catch (error) {
            console.error("Failed to parse token", error);
            return null;
        }
    },

    isLoggedIn: function() {
        const user = this.getLoggedInUser();
        if (!user) return false;

        const token = localStorage.getItem("jwtToken");
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp && payload.exp > currentTime;
        } catch {
            return false;
        }
    },

    register: function(user) {
        UserManager.ajaxCall(
            'POST',
            '/api/Users/Register',
            JSON.stringify(user),
            function(response) {
                alert("Registration successful! Redirecting to login...");
                localStorage.setItem("user.email", user.email);
                setTimeout(() => window.location.href = 'Login.html', 1500);
            },
            function(error) {
                console.error('Registration failed:', error);
                alert(error.responseJSON?.message || 'Registration failed. Please try again.');
            }
        );
    }
};

window.UserManager = UserManager;