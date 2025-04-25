const HeaderComponent = {
    getPaths: function () {
        const path = window.location.pathname;

        const isInAuth = path.includes('/html/Auth/');
        const isInLayout = path.includes('/html/layout/');
        const isAtRoot = path.includes('/html/') && !isInAuth && !isInLayout;

        let basePath = '';
        let indexPath = '';
        let myMoviesPath = '';
        let loginPath = '';
        let AddMoviePath = '';

        if (isInAuth) {
            basePath = '../..';
            indexPath = '../index.html';
            myMoviesPath = '../layout/MyMovies.html';
            AddMoviePath = '../layout/AddMovie.html';
            loginPath = './Login.html';
        } else if (isInLayout) {
            basePath = '../..';
            indexPath = '../index.html';
            myMoviesPath = './MyMovies.html';
            AddMoviePath = './AddMovie.html';
            loginPath = '../Auth/Login.html';
        } else if (isAtRoot) {
            basePath = '.';
            indexPath = './index.html';
            myMoviesPath = './layout/MyMovies.html';
            AddMoviePath = './layout/AddMovie.html';
            loginPath = './Auth/Login.html';
        } else {
            // fallback for any other location
            basePath = '/html';
            indexPath = '/html/index.html';
            myMoviesPath = '/html/layout/MyMovies.html';
            AddMoviePath = '/html/layout/AddMovie.html';
            loginPath = '/html/Auth/Login.html';
        }

        return {
            basePath,
            indexPath,
            myMoviesPath,
            loginPath,
            AddMoviePath
        };
    },

    render: function (containerId = "header-container") {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const paths = this.getPaths();

        const navButtonsContainer = document.createElement('div');
        const navButtonsRightContainer = document.createElement('div');
        navButtonsContainer.className = 'nav-buttons';
        navButtonsRightContainer.className = 'nav-buttons-right';

        const homeButton = document.createElement('button');
        homeButton.className = `nav-button ${currentPage === 'index.html' ? 'active' : ''}`;
        homeButton.textContent = 'Home';
        homeButton.onclick = function () { location.href = paths.indexPath; };
        navButtonsContainer.appendChild(homeButton);

        const token = localStorage.getItem('jwtToken');

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Math.floor(Date.now() / 1000);
                if (payload.exp && payload.exp < currentTime) {
                    console.warn('Token has expired');
                    localStorage.removeItem('jwtToken');
                    showLoginButton(currentPage, paths, navButtonsRightContainer);
                    return;
                }

                const myMoviesButton = document.createElement('button');
                myMoviesButton.className = `nav-button ${currentPage === 'MyMovies.html' ? 'active' : ''}`;
                myMoviesButton.textContent = 'My Movies';
                myMoviesButton.onclick = function () { location.href = paths.myMoviesPath; };
                navButtonsContainer.appendChild(myMoviesButton);

                const AddMovie = document.createElement('button');
                AddMovie.className = `nav-button ${currentPage === 'AddMovie.html' ? 'active' : ''}`;
                AddMovie.textContent = 'Add Movies';
                AddMovie.onclick = function () { location.href = paths.AddMoviePath; };
                navButtonsContainer.appendChild(AddMovie);

                const userName = payload.name || 'User';
                const userInfo = document.createElement('span');
                userInfo.className = 'user-info';
                userInfo.textContent = `Logged in as: ${userName}`;
                navButtonsRightContainer.appendChild(userInfo);

                const logoutButton = document.createElement('button');
                logoutButton.className = 'nav-button-right';
                logoutButton.textContent = 'LogOut';
                logoutButton.onclick = function () {
                    localStorage.removeItem('jwtToken');
                    location.href = paths.indexPath;                };
                navButtonsRightContainer.appendChild(logoutButton);
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('jwtToken');
                showLoginButton(currentPage, paths, navButtonsRightContainer);
            }
        } else {
            showLoginButton(currentPage, paths, navButtonsRightContainer);
        }

        const container = document.getElementById(containerId) || document.querySelector('header');
        if (container) {
            container.innerHTML = '';
            container.appendChild(navButtonsContainer);
            container.appendChild(navButtonsRightContainer);
        } else {
            console.error('Header container not found.');
        }
    }
};

function showLoginButton(currentPage, paths, navButtonsRightContainer) {
    const loginButton = document.createElement('button');
    loginButton.className = `nav-button-right ${currentPage === 'Login.html' ? 'active' : ''}`;
    loginButton.textContent = 'Login';
    loginButton.onclick = function () {
        location.href = paths.loginPath;
    };
    navButtonsRightContainer.appendChild(loginButton);
}

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('header-container') || document.querySelector('header');
    if (container) {
        HeaderComponent.render();
    }
});
