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
        let EditProfilePath = '';
        let CartPath = '';

        if (isInAuth) {
            basePath = '../..';
            indexPath = '../index.html';
            myMoviesPath = '../layout/MyMovies.html';
            AddMoviePath = '../layout/AddMovie.html';
            loginPath = './Login.html';
            EditProfilePath = '../layout/EditProfile.html';
            CartPath = '../layout/Cart.html';

        } else if (isInLayout) {
            basePath = '../..';
            indexPath = '../index.html';
            myMoviesPath = './MyMovies.html';
            AddMoviePath = './AddMovie.html';
            loginPath = '../Auth/Login.html';
            EditProfilePath = './EditProfile.html';
            CartPath = './Cart.html';
        } else if (isAtRoot) {
            basePath = '.';
            indexPath = './index.html';
            myMoviesPath = './layout/MyMovies.html';
            AddMoviePath = './layout/AddMovie.html';
            loginPath = './Auth/Login.html';
            EditProfilePath = './layout/EditProfile.html';
            CartPath = './layout/Cart.html';
        } else {
            // fallback for any other location
            basePath = '/html';
            indexPath = '/html/index.html';
            myMoviesPath = '/html/layout/MyMovies.html';
            AddMoviePath = '/html/layout/AddMovie.html';
            loginPath = '/html/Auth/Login.html';
            EditProfilePath = '/html/layout/EditProfile.html';
            CartPath = '/html/layout/Cart.html';
        }

        return {
            basePath,
            indexPath,
            myMoviesPath,
            loginPath,
            AddMoviePath,
            EditProfilePath,
            CartPath
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
        const CartCount = localStorage.getItem('CartCount') || '0';

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



                // Create the user dropdown container
                const userDropdown = document.createElement('div');
                userDropdown.className = 'user-dropdown';
                userDropdown.style.position = 'relative';

                // Create the button that displays the user info (icon, name, arrow)
                const userButton = document.createElement('button');
                userButton.className = 'user-button';

                // Profile image placeholder
                const userImg = document.createElement('img');
                userImg.src = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.murrayglass.com%2Fwp-content%2Fuploads%2F2020%2F10%2Favatar-768x768.jpeg&f=1&nofb=1&ipt=6fef04d8660ef949515aeabc4cc0ec4664a6c4cd0b7843501af6adb28e9dd1e8'; // a 30x30 placeholder image
                userImg.alt = 'Profile';
                userImg.className = 'user-profile-img';

                // Username span
                const userNameSpan = document.createElement('span');
                userNameSpan.className = 'user-name';
                const userName = payload.name || 'User';
                userNameSpan.textContent = userName;

                // Down arrow icon
                const arrow = document.createElement('span');
                arrow.className = 'dropdown-arrow';
                arrow.textContent = ' ▼';

                userButton.appendChild(userImg);
                userButton.appendChild(userNameSpan);
                userButton.appendChild(arrow);

                // Create dropdown menu
                const dropdownMenu = document.createElement('div');
                dropdownMenu.className = 'dropdown-menu';
                dropdownMenu.style.position = 'absolute';
                dropdownMenu.style.top = '100%';
                dropdownMenu.style.right = '0';
                dropdownMenu.style.background = '#bad7f4';
                //dropdownMenu.style.border = '1px solid #ccc';
                dropdownMenu.style.padding = '0px';
                dropdownMenu.style.display = 'none';
                dropdownMenu.style.zIndex = 10;
                dropdownMenu.style.minWidth = '120px';
                dropdownMenu.style.borderRadius = '8px'; // Added rounded corners

                // Edit Profile option
                const editProfileOption = document.createElement('a');
                editProfileOption.href = paths.EditProfilePath;
                editProfileOption.textContent = 'Edit Profile';
                editProfileOption.style.display = 'block';
                editProfileOption.style.padding = '5px 0';
                dropdownMenu.appendChild(editProfileOption);

                // Logout option
                const logoutOption = document.createElement('a');
                logoutOption.href = '#';
                logoutOption.textContent = 'Logout';
                logoutOption.style.display = 'block';
                logoutOption.style.padding = '5px 0';
                logoutOption.onclick = function (e) {
                    e.preventDefault();
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('CartCount');
                    location.href = paths.indexPath;
                };
                dropdownMenu.appendChild(logoutOption);

                // Toggle dropdown on button click
                userButton.addEventListener('click', function (e) {
                    e.stopPropagation(); // Prevent closing when clicking the button
                    dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
                });

                // Hide dropdown when clicking outside
                document.addEventListener('click', function () {
                    dropdownMenu.style.display = 'none';
                });

                const cartContainer = document.createElement('div');
                cartContainer.className = 'cart-icon-container';
                cartContainer.style.position = 'relative';
                cartContainer.style.cursor = 'pointer';

                const cartIcon = document.createElement('img');
                cartIcon.src = 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png'; // A placeholder cart icon
                cartIcon.alt = 'Cart';
                cartIcon.className = 'cart-icon';
                cartIcon.style.width = '34px';
                cartIcon.style.height = '34px';

                const cartCount = document.createElement('span');
                cartCount.className = 'cart-count';
                cartCount.style.position = 'absolute';
                cartCount.style.top = '0';
                cartCount.style.right = '0';
                cartCount.style.background = 'red';
                cartCount.style.color = 'white';
                cartCount.style.borderRadius = '50%';
                cartCount.style.padding = '2px 6px';
                cartCount.style.fontSize = '10px';
                cartCount.style.fontWeight = 'bold';
                cartCount.style.display = 'none'; // Hidden by default

                // Get the cart count from local storage
                const cartItems = JSON.parse(localStorage.getItem('CartCount')) || [];
                if (cartItems > 0) {
                    cartCount.textContent = cartItems;
                    cartCount.style.display = 'block';
                }

                cartContainer.onclick = function () {
                    location.href = paths.CartPath;
                };

                cartContainer.appendChild(cartIcon);
                cartContainer.appendChild(cartCount);
                navButtonsRightContainer.appendChild(cartContainer);

                userDropdown.appendChild(userButton);
                userDropdown.appendChild(dropdownMenu);
                navButtonsRightContainer.appendChild(userDropdown);
                // const userName = payload.name || 'User';
                // const userInfo = document.createElement('span');
                // userInfo.className = 'user-info';
                // userInfo.textContent = `Logged in as: ${userName}`;
                // navButtonsRightContainer.appendChild(userInfo);

                // const EditProfile = document.createElement('button');
                // EditProfile.className = `nav-button-right ${currentPage === 'EditProfile.html' ? 'active' : ''}`;
                // EditProfile.textContent = 'Profile';
                // EditProfile.onclick = function () { location.href = paths.EditProfilePath; };
                // navButtonsRightContainer.appendChild(EditProfile);

                


                

                // const logoutButton = document.createElement('button');
                // logoutButton.className = 'nav-button-right';
                // logoutButton.textContent = 'LogOut';
                // logoutButton.onclick = function () {
                //     localStorage.removeItem('jwtToken');
                //     location.href = paths.indexPath;                };
                // navButtonsRightContainer.appendChild(logoutButton);
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
