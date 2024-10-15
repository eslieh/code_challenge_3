document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();

    // Function to list all movies
    function movielist() {
        fetch("http://localhost:3000/films") 
        .then((response) => response.json()) 
        .then((data) => {
            const ul = document.getElementById("films"); 

            // Loop through each movie in the response data
            data.forEach((movie) => {
                let soldOut = Math.abs(movie.capacity - movie.tickets_sold); 
                const movielists = document.createElement("li"); 
                movielists.innerHTML = `<span class="film item">${movie.title}</span>`; 

                // Add click event listener to movie list item
                movielists.addEventListener("click", () => {
                    displayMovieDetails(movie); // Call function to display movie details
                });

                // Check if the movie is sold out
                if (soldOut < 1) {
                    movielists.classList.add("sold-out"); 
                }

                // Function to delete the movie
                function deleteMovie() {
                    let deleteButton = document.createElement("button"); 
                    deleteButton.innerText = "Delete Movie"; 

                    // Add a click event listener to the delete button
                    deleteButton.addEventListener("click", (event) => {
                        event.stopPropagation(); // Prevent the click event from bubbling up
                        let movieId = movie.id; 

                        fetch(`http://localhost:3000/films/${movieId}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })
                        .then((r) => r.json()) 
                        .then((data) => {
                            console.log(data); 
                            movielists.remove(); 
                        });
                    });

                    movielists.appendChild(deleteButton); 
                }

                deleteMovie(); 
                ul.appendChild(movielists); 
            });
        })
        .catch((error) => {
            console.error("Error fetching movie data:", error); 
        });
    }

    // Function to display the selected movie details
    function displayMovieDetails(movie) {
        const imageHolder = document.getElementById("poster"); 
        const title = document.getElementById("title"); 
        const runtime = document.getElementById("runtime"); 
        const filmInfo = document.getElementById("film-info"); 
        const showtime = document.getElementById("showtime"); 
        const ticketNum = document.getElementById("ticket-num"); 
        const buybtn = document.getElementById("buy-ticket"); 

        // Set the movie details in the respective elements
        imageHolder.src = movie.poster; 
        imageHolder.alt = movie.title; 
        title.innerText = movie.title;
        runtime.innerText = movie.runtime;
        filmInfo.innerText = movie.description;
        showtime.innerText = movie.showtime;
        ticketNum.innerText = Math.abs(movie.capacity - movie.tickets_sold); 

        let remaining = ticketNum.innerText; 

        // When the Buy Ticket button is clicked
        buybtn.onclick = (e) => {
            e.preventDefault(); 
            if (remaining > 0) {
                let sold_data = Math.abs(movie.tickets_sold + 1); 

                // Prepare data to update tickets_sold
                let patchData = {
                    tickets_sold: sold_data,
                };

                fetch(`http://localhost:3000/films/${movie.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(patchData), 
                })
                .then((response) => response.json()) 
                .then(data => {
                    console.log("Success");
                    remaining--; 
                    ticketNum.innerText = remaining; 

                    // Function to POST the new ticket data
                    function postTicket(filmId, numberOfTickets) {
                        const postData = {
                            film_id: filmId,
                            number_of_tickets: numberOfTickets
                        };

                        fetch("http://localhost:3000/tickets", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(postData) 
                        })
                        .then(response => response.json()) 
                        .then(ticketData => {
                            console.log("Ticket created successfully:", ticketData); 
                        })
                    }
                    postTicket(data.id, Math.abs(data.capacity - sold_data)); 
                });
            } else {
                buybtn.innerText = "Sold Out"; 
            }
        };
    }

    // Call the functions to load movie details, poster, and list of movies
    movielist();
});
