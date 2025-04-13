/**
 * HeaderComponent - Manages the site header across multiple pages
 */
const HeaderComponent = {
    /**
     * Renders the header into the specified container
     */
    render: function(containerId = "header-container") {
        // Find current page for highlighting the active tab
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Create header elements dynamically
        const navButtonsContainer = document.createElement('div');
        const navButtonsRightContainer = document.createElement('div');
        navButtonsContainer.className = 'nav-buttons';
        navButtonsRightContainer.className = 'nav-buttons-right';

        const homeButton = document.createElement('button');
        homeButton.className = `nav-button ${currentPage === 'index.html' ? 'active' : ''}`;
        homeButton.textContent = 'Home';
        homeButton.onclick = function() { location.href = 'index.html'; };
        navButtonsContainer.appendChild(homeButton);

        const myMoviesButton = document.createElement('button');
        myMoviesButton.className = `nav-button ${currentPage === 'MyMovies.html' ? 'active' : ''}`;
        myMoviesButton.textContent = 'My Movies';
        myMoviesButton.onclick = function() { location.href = 'MyMovies.html'; };
        navButtonsContainer.appendChild(myMoviesButton);

        const loginButton = document.createElement('button');
        loginButton.className = `nav-button-right ${currentPage === 'Login.html' ? 'active' : ''}`;
        loginButton.textContent = 'Login';
        loginButton.onclick = function() { location.href = '../../html/Auth/Login.html'; };
        navButtonsRightContainer.appendChild(loginButton);

        // Append the nav buttons container to the header
        const container = document.getElementById(containerId) || document.querySelector('header');
        if (container) {
            // Clear any existing content
            container.innerHTML = '';
            container.appendChild(navButtonsContainer);
            container.appendChild(navButtonsRightContainer);
        } else {
            console.error('Header container not found. Add a <header> element or a div with id="' + containerId + '"');
        }
    },
    

};

// Initialize header when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('header-container') || document.querySelector('header');
    if (container) {
        HeaderComponent.render();
    } else {
        console.error('Header container not found. HeaderComponent.render() was not executed.');
    }
});