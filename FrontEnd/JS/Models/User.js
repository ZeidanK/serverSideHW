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

const port = "7026";
const address ="https://localhost:";

/**
 * User authentication and session management
 */
const UserManager = {
    ajaxCall: function(method, api, data, successCB, errorCB) {
        $.ajax({
            type: method,
            url: `${address}${port}${api}`,
            data: data,
            cache: false,
            contentType: "application/json",
            dataType: "json",
            success: successCB,
            error: errorCB
        });
    },
    /**
     * Current logged in user
     */
    currentUser: null,
    
   logIn(user) {
    UserManager.ajaxCall(
        'POST', 
        '/api/Users', 
        JSON.stringify(user),
        function(response) {
            // Success callback
            UserManager.showMessage('Registration successful! Redirecting to login...', 'success');
            
            // Store user email in localStorage as per your UserManager implementation
            localStorage.setItem('user.email', user.email);
            
            // Redirect to login page after a short delay
            setTimeout(function() {
                window.location.href = 'Login.html';
            }, 2000);
        },
        function(error) {
            // Error callback
            console.error('Registration failed:', error);
            showMessage(error.responseJSON?.message || 'Registration failed. Please try again.', 'error');
            submitBtn.prop('disabled', false).text(originalBtnText);
        }
    );

   },

   showMessage(message, type) {
    const messageElement = $('#register-message');
    messageElement.removeClass('error success').addClass(type).text(message);
    
    // Scroll to message if not visible
    if (!isElementInViewport(messageElement[0])) {
        messageElement[0].scrollIntoView({ behavior: 'smooth' });
    }
},
   logOut(){
        this.currentUser = null;
        localStorage.removeItem('user.email');
   },
   getLoggedInUser(){
        return localStorage.getItem('user.email');
   },

   register(user){
    UserManager.ajaxCall('POST', '/api/auth/register',user,function(response) {
        this.currentUser = user;
        localStorage.setItem('user.email', user.email);
    },function(error) {
        console.error('Registration failed:', error);
    });
   },
   

    

    

   
};

// Initialize when document is ready
$(document).ready(function() {
    // Initialize user session
    UserManager.initialize();
    
    // Update UI based on session status
    UserManager.updateUI();
});