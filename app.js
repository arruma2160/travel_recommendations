function loadNavbar() {
    const placeholder = document.getElementById('nav-placeholder');

    if (placeholder) {
        fetch('navbar.html')
            .then(response => {
                if (!response.ok) throw new Error('Navbar file not found');
                return response.text();
            })
            .then(data => {
                placeholder.innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading the navbar:', error);
                placeholder.innerHTML = "<p style='color:white; text-align:center;'>Error loading navigation.</p>";
            });
        fetch('navbar.html')
            .then(res => res.text())
            .then(_ => {
                const btnSearch = document.getElementById('searchBtn')
                btnSearch.addEventListener('click', () => {
                    let value = document.getElementById('searchBar').value;
                    recommendationSearch(value);
                });
                const btnReset = document.getElementById('resetBtn')
                btnReset.addEventListener('click', () => {
                    window.location.href = 'home.html';
                });
            });
    }
}

function loadHomeContent() {
    const contentPlaceholder = document.getElementById('home-content-placeholder');

    if (contentPlaceholder) {
        fetch('https://baconipsum.com/api/?type=all-meat&paras=5')
            .then(response => response.json())
            .then(paras => {
                // The API returns an array of strings, so we join them into one big block
                const fullText = paras.join('<br><br>');

                contentPlaceholder.innerHTML = `
                    <div class="home-content">
                        <h1>Explore Dream Destinations</h1>
                        <div class="scroll-text"> <p>${fullText}</p> </div>
                        <button class="btn-book">Book Now</button>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Error fetching text:', error);
                contentPlaceholder.innerHTML = "<p>Welcome to TravelBloom! Start your journey today.</p>";
            });
    }
}

function loadAboutUsContent() {
    const contentPlaceholder = document.getElementById('aboutus-content-placeholder');

    if (contentPlaceholder) {
        fetch('https://baconipsum.com/api/?type=all-meat&paras=5')
            .then(response => response.json())
            .then(paras => {
                // The API returns an array of strings, so we join them into one big block
                const fullText = paras.join('<br><br>');

                contentPlaceholder.innerHTML = `
                <div class="home-content">
                    <h1>About Us</h1>
                    <div class="scroll-text">
                        <p>${fullText}</p>
                    </div>
                    <div class="horizontal-container">
                        <h1>Our Team</h1>
                        <h3>Subtitle One</h3>
                        <h3>Subtitle Two</h3>
                        <h3>Subtitle Three</h3>
                    </div>
                </div>
                `;
            })
            .catch(error => {
                console.error('Error fetching text:', error);
                contentPlaceholder.innerHTML = "<p>Welcome to TravelBloom! Start your journey today.</p>";
            });
    }
}


function loadContactContent() {
    const contactPlaceholder = document.getElementById('contactus-content-placeholder');

    if (contactPlaceholder) {
        contactPlaceholder.innerHTML = `
            <div class="contact-wrapper">
                <!-- Left Side: Info -->
                <div class="contact-info">
                    <h1>Contact Us</h1>
                    <p>Get in touch</p>
                    <div class="contact-details">
                        <p><i class="fas fa-envelope"></i> hello@travelbloom.com</p>
                        <p><i class="fas fa-map-marker-alt"></i> Malmö, Sweden</p>
                    </div>
                </div>

                <!-- Right Side: Form -->
                <div class="contact-form-container">
                    <form id="contact-form">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" placeholder="Enter your name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" placeholder="Enter your email" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" rows="5" placeholder="How can we help?"></textarea>
                        </div>
                        <button type="submit" class="btn-submit">Submit</button>
                    </form>
                </div>
            </div>
        `;

        // Optional: Add a listener for the form submission
        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you! Your message has been sent.');
        });
    }
}

function recommendationSearch(criteria) {
    let found = []
    // 1. Fetch the external file
    fetch('searches.html')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text(); // Convert the response to a string
        })
        .then(htmlString => {
            // 2. Replace the body content
            document.body.innerHTML = htmlString;
            console.log(htmlString);
        })
        .then ( _ => {
            fetch('travel_recommendation.json')
            .then(response => response.json())
            .then(data => {
                if (['countries', 'country'].includes(criteria.toLowerCase()))
                    data.countries.forEach((country) => {
                        found = [...found, ...country.cities];
                    })
                else if (['temples', 'temple'].includes(criteria.toLowerCase()))
                    data.temples.forEach((temple) => {
                        found.push({name: temple.name, imageUrl: temple.imageUrl, description: temple.description})
                    });
                else if (['beaches', 'beach'].includes(criteria.toLowerCase()))
                    data.beaches.forEach((beach) => {
                        let {name, imageUrl, description} = beach;
                        found.push({name, imageUrl, description})
                        console.log(found);
                    });

            })
            .then( _ => {
                loadNavbar();
                const container = document.getElementById('searches-content-placeholder');
                container.innerHTML = ''; // Clear existing content
                container.className = 'cards-grid-container'; // Use a specific class for the grid

                found.forEach((item) => {
                    const card = document.createElement('div');
                    card.className = 'travel-card';

                    const imageHtml = item.imageUrl
                        ? `<img src="${item.imageUrl}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
                        : '';

                    card.innerHTML = `
                        <div class="image-container">
                            ${imageHtml}
                            <div class="image-placeholder" style="${item.imageUrl ? 'display:none;' : 'display:flex;'}">
                                <span>${item.imageUrl || 'No Image Path'}</span>
                            </div>
                        </div>
                        <div class="card-content">
                            <h2>${item.name}</h2>
                            <p>${item.description}</p>
                        </div>
                    `;
                    container.appendChild(card);
                });
            })
    })
}

window.onload = () => {
    loadNavbar();

    loadHomeContent();
    loadAboutUsContent();
    loadContactContent();
};
