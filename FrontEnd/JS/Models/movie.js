// Define a Movie class
class Movie {
    constructor(id, title, description, image, year, releaseDate, language, budget, grossWorldwide, genres, isAdult, runtimeMinutes, averageRating, numVotes) {
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
    }
}
const MOVIE_GENRES = [
    "Action",
    "Adventure", 
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Sport",
    "Thriller",
    "War",
    "Western"
];

// Make it globally accessible
window.MOVIE_GENRES = MOVIE_GENRES;

// Define a MovieCard class
class MovieCard {
    constructor(movie, index, isMyMovies) {
        this.movie = movie;
        this.index = index;
        this.isMyMovies = isMyMovies;
    }

    createCard() {
        return MovieUtils.createMovieCard(this.movie, this.index, this.isMyMovies);
    }
}

// Define a constant for the port
const port = "7026";
const address ="https://localhost:";



    const MovieUtils = {
        // AJAX call function (keeping as is)
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
    


                // Format movie genres as bubbles with color coding
        formatGenres: function(genres) {
            if (!genres) return '<span class="genre-empty">Not specified</span>';
            
            // Convert string to array if needed
            const genreArray = Array.isArray(genres) ? genres : 
                              (typeof genres === 'string' ? genres.split(',') : ['Not specified']);
            
            // Common genres that will get specific colors
            const commonGenres = [
                'Action', 'Comedy', 'Drama', 'Horror', 
                'Sci-Fi', 'Romance', 'Thriller', 'Documentary'
            ];
            
            // Create HTML for genre bubbles
            let genreHtml = '';
            for (const genre of genreArray) {
                if (genre && genre.trim()) {
                    const trimmedGenre = genre.trim();
                    // Check if this is a known genre to apply specific color
                    const dataAttr = commonGenres.includes(trimmedGenre) ? 
                        `data-genre="${trimmedGenre}"` : '';
                    
                    genreHtml += `<span class="genre-bubble" ${dataAttr}>${trimmedGenre}</span>`;
                }
            }
            
            return genreHtml || '<span class="genre-empty">Not specified</span>';
        },
    
        // Truncate description to specified length
        truncateDescription: function(description, length = 150) {
            return description 
                ? description.substring(0, length) + '...' 
                : 'No description available.';
        },
    
        // Format date to readable format
        formatDate: function(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString();
        },
    
        // Format number with commas
        formatNumber: function(num) {
            return Number(num || 0).toLocaleString();
        },
        
        // Create basic card content structure
        createCardContent: function(movieInstance) {
            const content = $('<div>').addClass('movie-content');
            
            // Title
            content.append($('<div>').addClass('movie-title').text(movieInstance.title));
            
            // Year
            content.append($('<div>').addClass('movie-info')
                .html('<strong>Year:</strong> ' + (movieInstance.year || 'N/A')));
            
            // Description (truncated)
            const desc = this.truncateDescription(movieInstance.description);
            content.append($('<div>').addClass('movie-info')
                .html('<strong>Description:</strong> ' + desc));
            
            // Rating
            content.append($('<div>').addClass('movie-rating')
                .html('<strong>Rating:</strong> ' + movieInstance.averageRating));
            
            // Genres
            const genresContainer = $('<div>').addClass('movie-info genres-container');
            genresContainer.append($('<strong>').text('Genres: '));
            genresContainer.append($(this.formatGenres(movieInstance.genres)));
            content.append(genresContainer);
            
            // Footer with budget, box office and votes
            const footer = $('<div>').addClass('movie-footer mt-2').html(
                '<strong>Budget:</strong> $' + this.formatNumber(movieInstance.budget) +
                ' | <strong>Box Office:</strong> $' + this.formatNumber(movieInstance.grossWorldwide) +
                ' | <strong>Votes:</strong> ' + this.formatNumber(movieInstance.numVotes)
            );
            content.append(footer);
            
            return content;
        },
        
   
        // Create an Add Movie button
createAddButton: function(movieInstance, index) {
    // Button styling stays the same
    const addBtn = $('<button>')
        .addClass('add-movie-btn')
        .text('Add Movie')
        .css({
            'background-color': '#007bff',
            'color': 'white',
            'border': 'none',
            'padding': '8px 15px',
            'margin-top': '10px',
            'cursor': 'pointer',
            'border-radius': '4px'
        });
        
    // Set up click handler
    addBtn.on('click', function() {
        const clickedButton = $(this);
        
        // Format genres properly as a string, not HTML
        let genresValue = "";
        if (Array.isArray(movieInstance.genres)) {
            genresValue = movieInstance.genres.join(', ');
        } else if (typeof movieInstance.genres === 'string') {
            genresValue = movieInstance.genres;
        } else {
            genresValue = "string";
        }
        
        // Create movie data object for POST with correct genre format
        const movieToAdd = {
            id: index+1,
            url: "string",
            primaryTitle: movieInstance.title,
            description: movieInstance.description || "string",
            primaryImage: movieInstance.image || "string",
            year: movieInstance.year || 0,
            releaseDate: movieInstance.releaseDate || "2025-04-07T18:32:37.080Z",
            language: movieInstance.language || "string",
            budget: movieInstance.budget || 0,
            grossWorldwide: movieInstance.grossWorldwide || 0,
            genres: genresValue, // Using the properly formatted string
            isAdult: movieInstance.isAdult || false,
            runtimeMinutes: movieInstance.runtimeMinutes || 0,
            averageRating: movieInstance.averageRating || 0,
            numVotes: movieInstance.numVotes || 0
        };
        
        // For debugging - log the data being sent
        console.log("Sending movie data:", movieToAdd);
        
        // Submit via AJAX with fixed URL
        MovieUtils.ajaxCall(
            "POST", 
            "/api/movies", // Make sure this path is correct
            JSON.stringify(movieToAdd), 
            function(data) {
                console.log("Success response:", data);
                MovieUtils.showSuccessMessage(data, clickedButton);
            },
            function(xhr, status, error) {
                console.error("Error details:", xhr, status, error);
                MovieUtils.showErrorMessage(xhr);
            }
        );
    });
    
    return addBtn;
},
        // Create a Delete Movie button
        createDeleteButton: function(movieInstance) {
            const deleteBtn = $('<button>')
                .addClass('delete-movie-btn')
                .text('Delete Movie')
                .css({
                    'background-color': '#dc3545',
                    'color': 'white',
                    'border': 'none',
                    'padding': '8px 15px',
                    'margin-top': '10px',
                    'cursor': 'pointer',
                    'border-radius': '4px'
                });
                
            // Set up click handler
            deleteBtn.on('click', function() {
                if (confirm("Are you sure you want to delete this movie?")) {
                    MovieUtils.ajaxCall(
                        "DELETE", 
                        `/api/movies/${movieInstance.id}`, 
                        null, 
                        function() {
                            alert("Success! Movie deleted.");
                            MovieUtils.initMyMoviesPage();
                        }, 
                        MovieUtils.showErrorMessage
                    );
                }
            });
            
            return deleteBtn;
        },
        
        // Success message display
        showSuccessMessage: function(data, buttonElement) {
            var messageBox = $('<div>')
                .addClass('message-box')
                .css({
                    'padding': '10px',
                    'margin': '10px 0',
                    'border-radius': '4px',
                    'font-size': '14px',
                    'color': '#155724',
                    'background-color': '#d4edda',
                    'border': '1px solid #c3e6cb'
                })
                .text("Success! Movie added.");
    
            if (data === false) {
                messageBox.text("The movie was not added.")
                    .css({
                        'color': '#856404',
                        'background-color': '#fff3cd',
                        'border': '1px solid #ffeeba'
                    });
            }
    
            $(buttonElement).after(messageBox);
            setTimeout(() => messageBox.fadeOut(500, () => messageBox.remove()), 3000);
        },
    
        // Main function to create a movie card
        createMovieCard: function(movie, index, isMyMovies = false) {
            // Create movie instance
            const movieInstance = new Movie(
                movie.id,
                movie.primaryTitle,
                movie.description,
                movie.primaryImage,
                movie.year || movie.startYear,
                movie.releaseDate,
                movie.language,
                movie.budget,
                movie.grossWorldwide,
                movie.genres,
                movie.isAdult,
                movie.runtimeMinutes,
                movie.averageRating,
                movie.numVotes
            );
            
            // Create the card container
            const card = $('<div>').addClass('movie-card');
            
            // Add image if available
            if (movieInstance.image) {
                const img = $('<img>')
                    .addClass('movie-img')
                    .attr('src', movieInstance.image)
                    .attr('alt', movieInstance.title);
                card.append(img);
            }
            
            // Create content
            const content = this.createCardContent(movieInstance);
            
            // Add appropriate button based on context
            if (isMyMovies) {
                content.append(this.createDeleteButton(movieInstance));
            } else {
                content.append(this.createAddButton(movieInstance, index));
            }
            
            // Assemble the card
            card.append(content);
            return card;
        },
    
        
    
    displayMovies: function(movies, container, isMyMovies = false) {
        container.empty();

        if (movies && movies.length > 0) {
            $.each(movies, function(index, movie) {
                const card = MovieUtils.createMovieCard(movie, index, isMyMovies);
                container.append(card);
            });
        } else {
                    container.html('<div style="grid-column: 1/-1; padding: 10px; background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba;">No movie data available.</div>');
                }
            },
        
        

            loadServerMovies: function() {
                const container = $('#movies-container');
                container.html('<div style="grid-column: 1/-1; text-align: center; padding: 20px;">Loading movies...</div>');
                
                // Use the global movies variable that's loaded from the external movies.js script
                if (typeof movies !== 'undefined' && Array.isArray(movies)) {
                    // Use the existing movies variable directly
                    MovieUtils.displayMovies(movies, container, false); // false since this is the index page
                } else {
                    // Try to load from server if movies variable isn't available
                    try {
                        // Alternative: try loading the JSON if needed
                        $.getJSON('../movies.js', function(data) {
                            MovieUtils.displayMovies(data, container, false);
                        }).fail(function() {
                            MovieUtils.showErrorMessage({ 
                                responseJSON: { 
                                    message: 'Movies data not available. Make sure movies.js is properly loaded.' 
                                } 
                            });
                        });
                    } catch (error) {
                        MovieUtils.showErrorMessage({ 
                            responseJSON: { 
                                message: 'Failed to load movies: ' + error.message
                            } 
                        });
                    }
                }
            },



    showErrorMessage: function(xhr) {
        const container = $('#movies-container');
        container.html('<div style="grid-column: 1/-1; padding: 10px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;">Error: ' + (xhr.responseJSON?.message || 'An error occurred while processing your request.') + '</div>');
    },

    initIndexPage: function() {
        MovieUtils.loadServerMovies();
    },

    initMyMoviesPage: function() {
        const container = $('#movies-container');
        container.html('<div style="grid-column: 1/-1; text-align: center; padding: 20px;">Loading your movies...</div>');

        // Get movies from server
        MovieUtils.ajaxCall(
            "GET",
            "/api/movies",
            null,
            function(data) {
                if (data && data.length > 0) {
                    MovieUtils.displayMovies(data, container, true);
                } else {
                    container.html('<div style="grid-column: 1/-1; padding: 10px; background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba;">You have no saved movies.</div>');
                }
            },
            MovieUtils.showErrorMessage
        );
    }
   
};

//Success callback for GET request
function onGetSuccess(data) {
    var container = $('#movies-container');
    MovieUtils.displayMovies(data, container, true);
}

// Success callback for DELETE request
function onDeleteSuccess(data) {
    alert("Success! Movie deleted.");
    // Reload the movies to refresh the list
    loadMovies();
}

// Error callback function
function onError(xhr, status, error) {
    alert("Error: " + status);
    console.error(xhr.responseText);
}

// Function to delete a movie using AJAX
function deleteMovie(id) {
    if (confirm("Are you sure you want to delete this movie?")) {
        // Call the AJAX function with DELETE method
        ajaxCall(
            "DELETE", 
            "https://localhost:7026/api/movies/" + id, 
            null, 
            onDeleteSuccess, 
            onError
        );
    }
}



// Function to search movies by title
function searchMoviesByTitle(title) {
    var container = $('#movies-container');
    container.html('<div style="grid-column: 1/-1; text-align: center; padding: 20px;">Searching for movies with title "' + title + '"...</div>');
    
    // Get movies by title
    MovieUtils.ajaxCall("GET","/api/movies/(title)?title=" + title,null,onGetSuccess,onError);
   
}

// Function to search movies by date range
function searchMoviesByDateRange(startDate, endDate) {
    var container = $('#movies-container');
    container.html('<div style="grid-column: 1/-1; text-align: center; padding: 20px;">Searching for movies released between ' + startDate + ' and ' + endDate + '...</div>');
    
    // Get movies by date range
    ajaxCall(
        "GET",
        "https://localhost:7026/api/movies/GetByReleaseDate/startDate/" + startDate + "/endDate/" + endDate,
        null,
        onGetSuccess,
        onError
    );
}



