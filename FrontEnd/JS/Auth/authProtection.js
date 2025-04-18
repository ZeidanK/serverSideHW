// Immediate auth check to prevent any content display
(function() {
    // Check local storage for JWT token
    const jwtToken = localStorage.getItem('jwtToken');
    
    // Helper function to validate JWT token (basic structure check)
    function isValidJwt(token) {
        if (!token) return false;
        const parts = token.split('.');
        return parts.length === 3; // JWT should have three parts: header, payload, signature
    }

    // If no valid JWT token, redirect immediately
    if (!jwtToken || !isValidJwt(jwtToken)) {
        // Redirect to login page
        window.location.replace('../Auth/Login.html');
        return; // Stop further execution
    }
    // If valid, proceed with the rest of the script
    //return true;
    // Optionally, you can decode the JWT and check expiration here
    const payload = JSON.parse(atob(jwtToken.split('.')[1]));
    const exp = payload.exp;
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (exp < currentTime) {
        // Token is expired, redirect to login
        window.location.replace('../Auth/Login.html');
        return; // Stop further execution
    }
    // Token is valid and not expired, proceed with the rest of the script
    return ture;
    

})();
