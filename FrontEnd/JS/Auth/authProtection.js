// Immediate auth check to prevent any content display
(function() {
    // Check session storage first for ultra-fast check
    const authStatus = sessionStorage.getItem('authStatus');
    const authExpiry = sessionStorage.getItem('authExpiry');
    
    // If definitely not authenticated OR no auth status exists, redirect immediately
    if (authStatus === 'unauthenticated' && Date.now() < Number(authExpiry) || 
        !authStatus || !authExpiry) {
        
        // Store status before redirecting (prevents endless redirects if there's an issue)
        sessionStorage.setItem('authStatus', 'redirecting');
        
        // Redirect to login page
        window.location.replace('../Auth/Login.html');
        
        // Prevent rest of page from loading
        document.write('<h3>Redirecting to login...</h3>');
        throw new Error('Authentication required');
    }
    
    // Only get here if we have a cached authenticated status that hasn't expired
    if (authStatus === 'authenticated' && Date.now() < Number(authExpiry)) {
        // We can skip the loading screen for authenticated users with valid cache
        document.write(`
            <style>
                #auth-gate {
                    opacity: 0;
                    transition: opacity 0.3s;
                }
            </style>
        `);
    }
    
    // Show loading screen until proper check completes
    document.write(`
        <style>
            body { 
                margin: 0; 
                padding: 0; 
                font-family: sans-serif;
                overflow: hidden;
            }
            #auth-gate {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .auth-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(0,0,0,0.1);
                border-left-color: #007bff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .auth-message {
                margin-top: 20px;
                font-size: 16px;
                text-align: center;
            }
        </style>
        <div id="auth-gate">
            <div>
                <div class="auth-spinner"></div>
                <div class="auth-message">Verifying authentication...</div>
            </div>
        </div>
    `);
})();