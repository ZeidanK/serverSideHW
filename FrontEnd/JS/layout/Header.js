/**
 * HeaderComponent - Manages the site header across multiple pages
 */
const HeaderComponent = {
    /**
     * Calculate relative paths based on current location
     */
    getPaths: function() {
        // Get current path
        const path = window.location.pathname;
        let basePath = '';
        let indexPath = '';
        let myMoviesPath = '';
        let loginPath = '';
        let AddMoviePath = '';
        
        // Check current location to determine correct paths
        if (path.includes('/html/Auth/')) {
            // We're in the Auth folder
            basePath = '../../';
            indexPath = '../index.html';
            myMoviesPath = '../layout/MyMovies.html';
            AddMoviePath = '../layout/AddMovie.html';
            loginPath = 'Login.html';
        } else if (path.includes('/html/layout/')) {
            // We're in the layout folder
            basePath = '../';
            indexPath = '../index.html';
            myMoviesPath = 'MyMovies.html';
            AddMoviePath = 'AddMovie.html';
            loginPath = '../Auth/Login.html';
        } else if (path.includes('/html/')) {
            // We're in the html folder (index.html)
            basePath = '';
            indexPath = 'index.html';
            myMoviesPath = 'layout/MyMovies.html';
            AddMoviePath = 'layout/AddMovie.html';
            loginPath = 'Auth/Login.html';
        } else {
            // Default/fallback paths
            basePath = 'html/';
            indexPath = 'html/index.html';
            myMoviesPath = 'html/layout/MyMovies.html';
            AddMoviePath = 'html/layout/AddMovie.html';
            loginPath = 'html/Auth/Login.html';
        }
        
        return {
            basePath,
            indexPath,
            myMoviesPath,
            loginPath,
            AddMoviePath
        };
    },
    
    /**
     * Renders the header into the specified container
     */
    render: function(containerId = "header-container") {
        // Find current page for highlighting the active tab
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Get paths based on current location
        const paths = this.getPaths();
        
        // Create header elements dynamically
        const navButtonsContainer = document.createElement('div');
        const navButtonsRightContainer = document.createElement('div');
        navButtonsContainer.className = 'nav-buttons';
        navButtonsRightContainer.className = 'nav-buttons-right';

        const homeButton = document.createElement('button');
        homeButton.className = `nav-button ${currentPage === 'index.html' ? 'active' : ''}`;
        homeButton.textContent = 'Home';
        homeButton.onclick = function() { location.href = paths.indexPath; };
        navButtonsContainer.appendChild(homeButton);

        const myMoviesButton = document.createElement('button');
        myMoviesButton.className = `nav-button ${currentPage === 'MyMovies.html' ? 'active' : ''}`;
        myMoviesButton.textContent = 'My Movies';
        myMoviesButton.onclick = function() { location.href = paths.myMoviesPath; };
        navButtonsContainer.appendChild(myMoviesButton);

        const AddMovie = document.createElement('button');
        AddMovie.className = `nav-button ${currentPage === 'AddMovie.html' ? 'active' : ''}`;
        AddMovie.textContent = 'Add Movies';
        AddMovie.onclick = function() { location.href = paths.AddMoviePath; };
        navButtonsContainer.appendChild(AddMovie);

        const userEmail = localStorage.getItem('user.email');
        
        if (userEmail) {
            // Create a logout button and display user email
            const userInfo = document.createElement('span');
            userInfo.className = 'user-info';
            userInfo.textContent = `Logged in as: ${userEmail}`;
            navButtonsRightContainer.appendChild(userInfo);

            const logoutButton = document.createElement('button');
            logoutButton.className = 'nav-button-right';
            logoutButton.textContent = 'Log Out';
            logoutButton.onclick = function() {
            localStorage.removeItem('user.email');
            location.reload(); // Reload the page to update the header
            };
            navButtonsRightContainer.appendChild(logoutButton);
        } else {
            // Create a login button
            const loginButton = document.createElement('button');
            loginButton.className = `nav-button-right ${currentPage === 'Login.html' ? 'active' : ''}`;
            loginButton.textContent = 'Login';
            loginButton.onclick = function() { location.href = paths.loginPath; };
            navButtonsRightContainer.appendChild(loginButton);
        }

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
    
    /**
     * Add a custom navigation button
     */
    addNavButton: function(text, relativePath, isActive = false) {
        const paths = this.getPaths();
        const navButtons = document.querySelector('.nav-buttons');
        if (navButtons) {
            const button = document.createElement('button');
            button.className = `nav-button ${isActive ? 'active' : ''}`;
            button.textContent = text;
            button.onclick = function() { location.href = paths.basePath + relativePath; };
            navButtons.appendChild(button);
        }
    }
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