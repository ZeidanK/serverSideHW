// import notify from ../layout/notiry.min.js


// Define a Movie class
class Movie {
    constructor(id, title, description, image, year, releaseDate, language, budget, grossWorldwide, genres, isAdult, runtimeMinutes, averageRating, numVotes, priceToRent, rentalCount, rentEndDate, rentStartDate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.image = image;
        this.year = year;
        this.releaseDate = releaseDate;
        this.language = language;
        this.budget = budget;
        this.grossWorldwide = grossWorldwide;
        this.genres = genres;
        this.isAdult = isAdult;
        this.runtimeMinutes = runtimeMinutes;
        this.averageRating = averageRating;
        this.numVotes = numVotes;
        this.priceToRent = priceToRent;
        this.rentalCount = rentalCount;
        this.rentEndDate = rentEndDate;
        this.rentStartDate = rentStartDate;
    }
}

const MOVIE_GENRES = [
    "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Musical",
    "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"
];
window.MOVIE_GENRES = MOVIE_GENRES;

// const port = "";
// const address = "https://proj.ruppin.ac.il/cgroup4/test2/tar1";

const port = "7026";
const address = "https://localhost:"

const MovieUtils = {
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

    formatGenres: function(genres) {
        if (!genres) return '<span class="genre-empty">Not specified</span>';
        const genreArray = Array.isArray(genres) ? genres : genres.split(',');
        const commonGenres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller", "Documentary"];

        return genreArray.map(g => {
            const genre = g.trim();
            const dataAttr = commonGenres.includes(genre) ? `data-genre=\"${genre}\"` : '';
            return `<span class='genre-bubble' ${dataAttr}>${genre}</span>`;
        }).join('');
    },

    truncateDescription: function(description, length = 150) {
        return description ? description.substring(0, length) + '...' : 'No description available.';
    },

    formatDate: function(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    },

    formatNumber: function(num) {
        return Number(num || 0).toLocaleString();
    },

    createCardContent: function(movieInstance,cart=0) {
        const content = $('<div>').addClass('movie-content');
        content.append($('<div>').addClass('movie-title').text(movieInstance.title));
        content.append($('<div>').addClass('movie-info').html('<strong>Year:</strong> ' + (movieInstance.year || 'N/A')));
        content.append($('<div>').addClass('movie-info').html('<strong>Description:</strong> ' + this.truncateDescription(movieInstance.description)));
        content.append($('<div>').addClass('movie-rating').html('<strong>Rating:</strong> ' + movieInstance.averageRating));
        if(cart){
            content.append($('<div>').addClass('movie-info').html('<strong>Rental Count:</strong> ' + this.formatNumber(movieInstance.rentalCount)));
            if(cart==2){
                console.log(movieInstance);
                content.append($('<div>').addClass('movie-info').html('<strong>Rental Start Date:</strong> ' + this.formatDate(movieInstance.rentStartDate)));
                content.append($('<div>').addClass('movie-info').html('<strong>Rental End Date:</strong> ' + this.formatDate(movieInstance.rentEndDate)));
                console.log(movieInstance.rentStartDate);
                console.log(movieInstance.rentEndDate);
            }
           // content.append($('<div>').addClass('movie-info').html('<strong>Rental Start Date:</strong> ' + this.formatDate(movieInstance.rentStartDate)));
           // content.append($('<div>').addClass('movie-info').html('<strong>Rental End Date:</strong> ' + this.formatDate(movieInstance.rentEndDate)));
            content.append($('<div>').addClass('movie-info').html('<strong>Price To Rent:</strong> $' + this.formatNumber(movieInstance.priceToRent)));
        }
        const genresContainer = $('<div>').addClass('movie-info genres-container');
        genresContainer.append($('<strong>').text('Genres: '));
        genresContainer.append($(this.formatGenres(movieInstance.genres)));
        content.append(genresContainer);
        const footer = $('<div>').addClass('movie-footer mt-2').html(
            '<strong>Budget:</strong> $' + this.formatNumber(movieInstance.budget) +
            ' | <strong>Box Office:</strong> $' + this.formatNumber(movieInstance.grossWorldwide) +
            ' | <strong>Votes:</strong> ' + this.formatNumber(movieInstance.numVotes)
            
        );
        if (cart==1) {
            footer.append(this.createDeleteButton(movieInstance));

        }
        content.append(footer);
        return content;
    },

    createAddButton: function(movieInstance, index) {
        const addBtn = $('<button>').addClass('add-movie-btn').text('Add To Cart').css({
            backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 15px',
            marginTop: '10px', cursor: 'pointer', borderRadius: '4px'
        });

        addBtn.on('click', function() {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) return window.location.href = "Auth/Login.html";
            const payload = JSON.parse(atob(jwtToken.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < currentTime) {
                localStorage.removeItem('jwtToken');
                return window.location.href = "Auth/Login.html";
            }
            console.log(movieInstance);
            const genresValue = Array.isArray(movieInstance.genres) ? movieInstance.genres.join(', ') : (movieInstance.genres || "string");
            const movieToAdd = {
                id: movieInstance.id,
                url: "string",
                primaryTitle: movieInstance.title,
                description: movieInstance.description || "string",
                primaryImage: movieInstance.image || "string",
                year: movieInstance.year || 0,
                releaseDate: movieInstance.releaseDate || new Date().toISOString(),
                language: movieInstance.language || "string",
                budget: movieInstance.budget || 0,
                grossWorldwide: movieInstance.grossWorldwide || 0,
                genres: genresValue,
                isAdult: movieInstance.isAdult || false,
                runtimeMinutes: movieInstance.runtimeMinutes || 0,
                averageRating: movieInstance.averageRating || 0,
                numVotes: movieInstance.numVotes || 0,
                priceToRent: movieInstance.priceToRent || 0,
                rentalCount: movieInstance.rentalCount || 0,
            };

            MovieUtils.ajaxCall("POST", "/api/movies", JSON.stringify(movieToAdd),
                data => MovieUtils.showSuccessMessage(data, addBtn),
                xhr => MovieUtils.showErrorMessage(xhr)
            );
        });

        return addBtn;
        },
        createRentButton: function(movieInstance) {
        // Create the Rent Movie button
        const rentBtn = $('<button>')
          .addClass('rent-movie-btn')
          .text('Rent Movie')
          .css({
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              marginTop: '10px',
              cursor: 'pointer',
              borderRadius: '4px'
          });
          
        rentBtn.on('click', function() {
            // Check if a modal is already present, else create one
            let rentFormModal = $('#rentFormModal');
            if (!rentFormModal.length) {
            rentFormModal = $(`
                <div id="rentFormModal" class="modal-overlay" style="position: fixed; top: 0; left:0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;">
                <div class="modal-content" style="background: white; padding: 20px; border-radius: 5px; width: 300px; text-align: center;">
                    <h3>Rent Movie: ${movieInstance.title}</h3>
                    <label for="startDate">Start Date:</label>
                    <input id="startDate" type="date" style="width: 90%; padding: 5px; margin: 10px 0;"/>
                    <label for="endDate">End Date:</label>
                    <input id="endDate" type="date" style="width: 90%; padding: 5px; margin: 10px 0;"/>
                    <p>Total Price: $<span id="rentPrice">0</span></p>
                    <button id="confirmRent" style="margin-right:10px;">Rent Now</button>
                    <button id="cancelRent">Cancel</button>
                </div>
                </div>
            `);
            $('body').append(rentFormModal);
            }
            
            const dailyRate = movieInstance.priceToRent || 5;
            const startDateInput = rentFormModal.find('#startDate');
            const endDateInput = rentFormModal.find('#endDate');
            const rentPriceSpan = rentFormModal.find('#rentPrice');
            
            function calculatePrice() {
            const startDate = new Date(startDateInput.val());
            const endDate = new Date(endDateInput.val());
            if (startDate && endDate && endDate > startDate) {
                const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                const totalPrice = dailyRate * days;
                rentPriceSpan.text(totalPrice.toFixed(2));
            } else {
                rentPriceSpan.text('0');
            }
            }
            
            startDateInput.off('change').on('change', calculatePrice);
            endDateInput.off('change').on('change', calculatePrice);
            
            rentFormModal.find('#cancelRent').off('click').on('click', function() {
            rentFormModal.remove();
            });
            
            rentFormModal.find('#confirmRent').off('click').on('click', function() {
            const startDate = startDateInput.val();
            const endDate = endDateInput.val();
            if (!startDate || !endDate || new Date(endDate) <= new Date(startDate) || new Date(startDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                $.notify("Please select valid start and end dates.", "warning");
                return;
            }
            const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
            const payload = {
                movieId: movieInstance.id,
                rentalDays: days,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                totalPrice: dailyRate * days
            };
            console.log(payload);
            MovieUtils.ajaxCall("POST", "/api/movies/rentMovie", JSON.stringify(payload),
                function(resp) {
                $.notify("Movie rented successfully!", "success");
                rentFormModal.remove();
                },
                function(err) {
                $.notify(err.responseJSON?.message || "Failed to rent movie", "error");
                }
            );
            });
            
            rentFormModal.show();
        });
        
        return rentBtn;
        },

        createDeleteButton: function(movieInstance) {
        const deleteBtn = $('<button>').addClass('delete-movie-btn').text('remove from cart').css({
            backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px',
            marginTop: '10px', cursor: 'pointer', borderRadius: '4px'
        });

        deleteBtn.on('click', function() {
            if (confirm("Are you sure you want to removie this movie?")) {
            MovieUtils.ajaxCall("DELETE", `/api/movies/${movieInstance.id}`, null,
                () => {
                $.notify("Success! Movie removed from the cart.", "success");
                localStorage.setItem('CartCount', parseInt(localStorage.getItem('CartCount')) - 1);
                MovieUtils.initCartPage();
                },
                MovieUtils.showErrorMessage
            );
            } else {
            $.notify("Movie deletion canceled.", "info");
            }
        });

        return deleteBtn;
    },

    createTransferButton: function(movieInstance) {
        // Create the transfer button
        const transferBtn = $('<button>')
          .addClass('transfer-movie-btn')
          .text('Transfer Rental')
          .css({
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              marginTop: '10px',
              cursor: 'pointer',
              borderRadius: '4px'
          });
    
        transferBtn.on('click', function() {
            // Create a modal for the transfer form
            let transferModal = $('#transferModal');
            if (!transferModal.length) {
                transferModal = $(`
                    <div id="transferModal" class="modal-overlay" style="position: fixed; top: 0; left:0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;">
                        <div class="modal-content" style="background: white; padding: 20px; border-radius: 5px; width: 300px; text-align: center;">
                            <h3>Transfer Rental: ${movieInstance.title}</h3>
                            <label for="transferEmail">Recipient Email:</label>
                            <input id="transferEmail" type="email" placeholder="user@example.com" style="width: 90%; padding: 5px; margin: 10px 0;"/>
                            <div>
                                <button id="confirmTransfer" style="margin-right:10px;">Transfer Now</button>
                                <button id="cancelTransfer">Cancel</button>
                            </div>
                        </div>
                    </div>
                `);
                $('body').append(transferModal);
            }
    
            // Remove any previous event handlers on the modal buttons
            transferModal.find('#cancelTransfer').off('click').on('click', function() {
                transferModal.remove();
            });
            
            transferModal.find('#confirmTransfer').off('click').on('click', function() {
                const recipientEmail = transferModal.find('#transferEmail').val().trim();
                if (!recipientEmail) {
                    $.notify("Please enter a recipient email.", "warning");
                    return;
                }
                // Build payload for the transfer API
                const payload = {
                    movieId: movieInstance.id,
                    recipientEmail: recipientEmail
                };
                // Adjust the endpoint as needed
                MovieUtils.ajaxCall("POST", "/api/movies/transfer", JSON.stringify(payload),
                    function(resp) {
                        $.notify("Rental transferred successfully!", "success");
                        transferModal.remove();
                    },
                    function(err) {
                        $.notify(err.responseJSON?.message || "Transfer failed.", "error");
                    }
                );
            });
            transferModal.show();
        });
    
        return transferBtn;
    },

    showSuccessMessage: function(data, buttonElement) {
        if (data === false) {
            $.notify("The movie is already in the cart.", "warning");
        } else {
            $.notify("Success! Movie added to the cart.", "success");
            localStorage.setItem('CartCount', parseInt(localStorage.getItem('CartCount')) + 1);
        }
    },

    showErrorMessage: function(xhr) {
        const container = $('#movies-container');
        container.html('<div style="grid-column: 1/-1; padding: 10px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;">Error: ' + (xhr.responseJSON?.message || 'An error occurred.') + '</div>');
    },

    createMovieCardCart: function(movie, index) {
        console.log(movie);
        const movieInstance = new Movie(
            movie.id, movie.primaryTitle, movie.description, movie.primaryImage,
            movie.year || movie.startYear, movie.releaseDate, movie.language,
            movie.budget, movie.grossWorldwide, movie.genres,
            movie.isAdult, movie.runtimeMinutes, movie.averageRating, movie.numVotes,
            movie.priceToRent, movie.rentalCount, movie.rentEndDate, movie.rentStartDate
        );

        const card = $('<div>').addClass('movie-card');
        if (movieInstance.image) {
            const img = $('<img>').addClass('movie-img').attr('src', movieInstance.image).attr('alt', movieInstance.title);
            card.append(img);
        }

        const content = this.createCardContent(movieInstance,true);
        content.append(this.createRentButton(movieInstance));
        card.append(content);
        return card;
    },
    
    createMovieCard: function(movie, index, isMyMovies = false) {
        const movieInstance = new Movie(
            movie.id, movie.primaryTitle, movie.description, movie.primaryImage,
            movie.year || movie.startYear, movie.releaseDate, movie.language,
            movie.budget, movie.grossWorldwide, movie.genres,
            movie.isAdult, movie.runtimeMinutes, movie.averageRating, movie.numVotes,
            movie.priceToRent, movie.rentalCount, movie.endRentDate, movie.startRentDate
        );
        console.log('movieInstance');
        console.log(movieInstance);
        console.log(movie);

        const card = $('<div>').addClass('movie-card');
        if (movieInstance.image) {
            const img = $('<img>').addClass('movie-img').attr('src', movieInstance.image).attr('alt', movieInstance.title);
            card.append(img);
        }

        const content = this.createCardContent(movieInstance,isMyMovies?2:0);
        isMyMovies ? content.append(this.createTransferButton(movieInstance)) : content.append(this.createAddButton(movieInstance, index));
        card.append(content);
        return card;
    },

    displayMoviesCart: function(movies, container) {
        console.log(movies);
        container.empty();
        let CartCount =0;
        if (movies && movies.length > 0) {
            $.each(movies, function(index, movie) {
                CartCount++;
                const card = MovieUtils.createMovieCardCart(movie, index);
                container.append(card);
                let moviesbtn=document.getElementById("loadMoviesBtn");
                moviesbtn.style.display='none';
            });
        } else {
            container.html('<div style="grid-column: 1/-1; padding: 10px; background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba;">No movie data available.</div>');
        }
        localStorage.setItem('CartCount', CartCount);
    },

    displayMovies: function(movies, container, isMyMovies = false) {
        console.log(movies);
        container.empty();
        let CartCount =0;
        if (movies && movies.length > 0) {
            $.each(movies, function(index, movie) {
                CartCount++;
                const card = MovieUtils.createMovieCard(movie, index, isMyMovies);
                container.append(card);
                let moviesbtn=document.getElementById("loadMoviesBtn");
                moviesbtn.style.display='none';
            });
        } else {
            container.html('<div style="grid-column: 1/-1; padding: 10px; background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba;">No movie data available.</div>');
        }
        localStorage.setItem('CartCount', CartCount);
    },

    loadServerMovies: function() {
        const container = $('#movies-container');
        container.html('<div style="grid-column: 1/-1; text-align: center; padding: 20px;">Loading movies...</div>');

        MovieUtils.ajaxCall("GET", "/api/movies", null,
            data => MovieUtils.displayMovies(data, container, false),
            MovieUtils.showErrorMessage
        );
    },

    loadServerRentedMovies: function() {
        const container = $('#movies-container');
        container.html('<div style="grid-column: 1/-1; text-align: center; padding: 20px;">Loading your rented movies...</div>');

        MovieUtils.ajaxCall("GET", "/api/movies/rentedMovies", null,
            data => MovieUtils.displayMovies(data, container, true),
            MovieUtils.showErrorMessage
        );
    },

    initIndexPage: function () {
        const container = $('#movies-container');
        container.html('<div style="grid-column: 1/-1; text-align: center; padding: 20px;">Loading movies...</div>');

        if (typeof movies !== 'undefined' && Array.isArray(movies)) {
            MovieUtils.displayMovies(movies, container, false);
        } else {
            MovieUtils.showErrorMessage({ 
                responseJSON: { 
                    message: 'Movies data not available. Make sure movies.js is properly loaded.' 
                } 
            });
        }
    },

    initMyMoviesPage: function () {
        const container = $('#movies-container');
        container.html('<div style="grid-column: 1/-1; text-align: center; padding: 20px;">Loading your movies...</div>');

        MovieUtils.ajaxCall("GET", "/api/movies/rentedMovies", null,
            data => MovieUtils.displayMovies(data, container, true),
            MovieUtils.showErrorMessage
        );
    },

    initCartPage: function () {
        const container = $('#movies-container');
        container.html('<div style="grid-column: 1/-1; text-align: center; padding: 20px;">Loading your cart...</div>');

        MovieUtils.ajaxCall("GET", "/api/movies", null,
            data => MovieUtils.displayMoviesCart(data, container, 1),
            MovieUtils.showErrorMessage
        );
    }
};

window.MovieUtils = MovieUtils;

//Success callback for GET request
function onGetSuccess(data) {
    var container = $('#movies-container');
    MovieUtils.displayMovies(data, container, true);
}

// Success callback for DELETE request
function onDeleteSuccess(data) {
    $.notiry("Success! Movie removed from cart.");
    // Reload the movies to refresh the list
    loadMovies();
}

// Error callback function
function onError(xhr, status, error) {
    alert("Error: " + status);
    console.error(xhr.responseText);
}





// Function to search movies by title
function searchMoviesByTitle(title) {
    var container = $('#movies-container');
    container.html('<div style="grid-column: 1/-1; text-align: center; padding: 20px;">Searching for movies with title "' + title + '"...</div>');
    
    // Get movies by title using MovieUtils.ajaxCall
    MovieUtils.ajaxCall(
        "GET",
        `/api/movies/byTitle/${title}`,
        null,
        onGetSuccess,
        onError
    );
}

// Function to search movies by date range
function searchMoviesByDateRange(startDate, endDate) {
    var container = $('#movies-container');
    container.html('<div style="grid-column: 1/-1; text-align: center; padding: 20px;">Searching for movies released between ' + startDate + ' and ' + endDate + '...</div>');
    
    // Get movies by date range using MovieUtils.ajaxCall
    MovieUtils.ajaxCall(
        "GET",
        `/api/movies/byReleaseDate?startDate=${startDate}&endDate=${endDate}`,
        null,
        onGetSuccess,
        onError
    );
}

