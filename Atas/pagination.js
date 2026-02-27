// Function to fetch a specific page of data from an API
async function fetchPage(pageNumber, itemsPerPage = 10) {
    // Construct the URL with query parameters
    const apiUrl = `https://sapl.tapira.mg.leg.br/api/sessao/sessaoplenaria/`;
    const params = `?data_inicio__year=${ano}&o=-data_inicio&page=${pageNumber}&limit=${itemsPerPage}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response into a JavaScript object
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to handle the display and pagination controls
async function handlePagination() {
    let currentPage = 1;
    const limit = 10;
    const resultsContainer = document.getElementById('results');
    const nextButton = document.getElementById('nextPage');
    const prevButton = document.getElementById('prevPage');

    async function loadPage(page) {
        // Clear previous results
        resultsContainer.innerHTML = 'Loading...';
        const data = await fetchPage(page, limit);

        // Process and display the current page's data (assuming 'data.items' array)
        resultsContainer.innerHTML = ''; // Clear 'Loading...'
        if (data && data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.textContent = `Item: ${item.name}`;
                resultsContainer.appendChild(itemElement);
            });
        } else {
            resultsContainer.textContent = 'No more results.';
        }

        // Update button states based on pagination info from the API response (e.g., `data.pagination.totalPages`)
        // The API response structure determines how you check for next/prev pages
        // Example: If API provides a "next" link, enable the button
    }

    nextButton.addEventListener('click', () => {
        currentPage++;
        loadPage(currentPage);
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadPage(currentPage);
        }
    });

    // Initial load
    loadPage(currentPage);
}

// Call the main handler when the page loads (or a certain event occurs)
// handlePagination();
