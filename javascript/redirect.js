/* This file is just for the redirecting the user when then
go to search in a page that isnt the home page. */

const searchInput = document.getElementById('search-redirect-text');

/* listen for changes to input */
searchInput.addEventListener('keyup', function (event) {
    const search = searchInput.value.trim();

    /* If there is any value in the search box */
    if (search.length > 0) {
        /* Custom message to see if user wants to leave */
        const userConfirmed = confirm('You must be on the home page to search. Would you like to be redirected?');

        /* if the user wants to redirect */
        if (userConfirmed) {
            window.location.href = `index.html`;
        } 
    }
});