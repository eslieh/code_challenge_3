document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault() 
    // Prevent the default action of DOMContentLoaded (not necessary here)

    // Function to list all movies
    function movielist() {
        fetch("http://localhost:3000/films") 
        // Fetch all movies from the API
        .then((response) => response.json()) 
        // Parse the JSON response
        .then((data) => {
            const ul = document.getElementById("films"); 
            // Get the <ul> element to hold the movie list

            // Loop through each movie in the response data
            data.forEach((movie) => {
                let soldOut = Math.abs(movie.capacity - movie.tickets_sold); 
                // Calculate available tickets
                const movielists = document.createElement("li"); 
                // Create a <li> for each movie
                movielists.innerHTML = `<li class="film item">${movie.title}</li>`; 
                // Set the movie title in the list

                // Check if the movie is sold out
                if (soldOut < 1) {
                    movielists.classList.add("sold-out"); 
                    // Add "sold-out" class if no tickets are available
                    movielists.append(); 
                    // Append the element
                }

                // Function to delete the movie
                function deleteMovie() {
                    let deleteButton = document.createElement("button"); 
                    // Create a delete button
                    deleteButton.innerText = "Delete Movie"; 
                    // Set button text

                    // Add a click event listener to the delete button
                    deleteButton.addEventListener("click", (event) => {
                        event.preventDefault(); 
                        // Prevent default button behavior
                        let movieId = movie.id; 
                        // Get the movie ID

                        // Make a DELETE request to remove the movie from the server
                        fetch(`http://localhost:3000/films/${movieId}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json", 
                                // Specify content type
                            },
                        })
                        .then((r) => r.json()) 
                        // Parse the response
                        .then((data) => {
                            console.log(data); 
                            // Log the response
                            movielists.remove(); 
                            // Remove the movie from the DOM
                        });
                    });
                    movielists.appendChild(deleteButton); 
                    // Add the delete button to the movie list item
                }

                deleteMovie(); 
                // Call the deleteMovie function
                ul.appendChild(movielists); 
                // Add the movie list item to the <ul>
            });
        })
        .catch((error) => {
            console.error("Error fetching movie data:", error); 
            // Handle errors
        });
    }

    // Function to display the poster of the first movie
    function imgPoster() {
        fetch("http://localhost:3000/films/1") 
        // Fetch details for the first movie
        .then((response) => response.json()) 
        // Parse the response
        .then((data) => {
            const imageHolder = document.getElementById("poster"); 
            // Get the poster image element
            imageHolder.src = data.poster; 
            // Set the image source to the movie poster URL
            imageHolder.alt = data.title; 
            // Set the alt text to the movie title
            imageHolder.append(); 
            // Append the image
        });
    }

    // Function to display the details of the first movie
    function movieDetails() {
        fetch("http://localhost:3000/films/1") 
        // Fetch details for the first movie
        .then((response) => response.json()) 
        // Parse the response
        .then((data) => {
            const title = document.getElementById("title"); 
            // Get the title element
            const runtime = document.getElementById("runtime"); 
            // Get the runtime element
            const filmInfo = document.getElementById("film-info"); 
            // Get the film info element
            const showtime = document.getElementById("showtime"); 
            // Get the showtime element
            const ticketNum = document.getElementById("ticket-num"); 
            // Get the available tickets element

            // Set the movie details in the respective elements
            title.innerText = data.title;
            runtime.innerText = data.runtime;
            filmInfo.innerText = data.description;
            showtime.innerText = data.showtime;
            ticketNum.innerText = Math.abs(data.capacity - data.tickets_sold); 
            // Calculate and set available tickets

            let remaining = ticketNum.innerText; 
            // Store the remaining tickets

            const buybtn = document.getElementById("buy-ticket"); 
            // Get the "Buy Ticket" button
            if (remaining < 1) {
                buybtn.innerText = "Sold Out"; 
                // If no tickets are available, change button text to "Sold Out"
                buybtn.append(); 
                // Append the button
            }

            // When the Buy Ticket button is clicked
            buybtn.onclick = (e) => {
                e.preventDefault(); 
                // Prevent default button behavior
                if (remaining > 0) {
                    let sold_data = Math.abs(data.tickets_sold + 1); 
                    // Increase the number of tickets sold

                    // Prepare data to update tickets_sold
                    let patchData = {
                        tickets_sold: sold_data,
                    };

                    // Make a PATCH request to update the number of tickets sold
                    fetch("http://localhost:3000/films/1", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(patchData), 
                        // Send the updated tickets_sold data
                    })
                    .then((response) => response.json()) 
                    // Parse the response
                    .then(data => {
                        console.log("Success");
                        remaining--; 
                        // Decrease the remaining tickets count
                        ticketNum.innerText = remaining; 
                        // Update the UI with the new remaining tickets

                        // Function to POST the new ticket data
                        function postTicket(filmId, numberOfTickets){
                            const postData = {
                                film_id: filmId,
                                number_of_tickets: numberOfTickets
                            };
                        
                            // Make a POST request to create a new ticket
                            fetch("http://localhost:3000/tickets", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(postData) 
                                // Send the new ticket data
                            })
                            .then(response => response.json()) 
                            // Parse the response
                            .then(ticketData => {
                                console.log("Ticket created successfully:", ticketData); 
                                // Log the created ticket
                            })
                        }
                        postTicket(data.id, Math.abs(data.capacity - sold_data)); 
                        // Call the postTicket function
                    });
                } else {
                    buybtn.innerText = "Sold Out"; 
                    // If no tickets remain, change button text to "Sold Out"
                }
            };

            // Append all the updated movie details
            title.append();
            runtime.append();
            filmInfo.append();
            showtime.append();
            ticketNum.append();
        });
    }

    // Call the functions to load movie details, poster, and list of movies
    movieDetails();
    imgPoster();
    movielist();
});
