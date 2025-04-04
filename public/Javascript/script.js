document.querySelectorAll('.nav-links').forEach((Item, index) => {
    // Highlight the active item based on localStorage
    if (localStorage.getItem('selectedItemIndex') == index) {
        Item.classList.add('active');
    }

    if (window.location.pathname === "/") {

    }
    // Add click event to each navigation link
    Item.addEventListener('click', function () {
        // Remove 'active' class from all nav items
        document.querySelectorAll('.nav-links').forEach(Button => {
            Button.classList.remove('active');
        });
        // Add 'active' class to the clicked nav item
        Item.classList.add('active');
        // Save the index of the active item in localStorage
        localStorage.setItem('selectedItemIndex', index);
    });
});


document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname === '/') {
        // Remove the logout element if it exists
        const logoutElement = document.querySelector('.Logout');
        if (logoutElement) {
            logoutElement.remove();
        }

        // Remove the .nav-links element if it exists
        const navLinksElement = document.querySelector('.nav-links');
        if (navLinksElement) {
            navLinksElement.remove();
        }

        // Create a new nav-link with the login link
        const newNavLink = document.createElement('a');
        newNavLink.href = '/Home';
        newNavLink.textContent = 'Next';
        newNavLink.classList.add('Baby');

        // Find the parent element where the new link should be added (e.g., .navbar)
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.appendChild(newNavLink);
        }
    }
});
