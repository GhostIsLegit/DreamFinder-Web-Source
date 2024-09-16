const serverIp = 'localhost'; // Cambia esto a la IP de tu PC
const serverPort = 3000; // Cambia esto si estás usando un puerto diferente

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchButton').addEventListener('click', searchInJson);
});

function searchInJson() {
    const searchTerm = document.getElementById('searchInput').value;
    const searchType = document.getElementById('searchType').value;

    fetch(`http://${serverIp}:${serverPort}/search?${searchType}=${encodeURIComponent(searchTerm)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetched data:', data);
        displayResults(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        displayResults([]);
    });
}

function displayResults(results) {
    const resultContainer = document.getElementById('resultContainer');
    if (!resultContainer) return;

    resultContainer.innerHTML = results.length === 0 ? '<p>No results found</p>' : '';

    if (results.length === 0) return;

    const groupedResults = results.reduce((acc, result) => {
        acc[result.file] = acc[result.file] || [];
        acc[result.file].push(result);
        return acc;
    }, {});

    const fragment = document.createDocumentFragment();

    for (const [fileName, items] of Object.entries(groupedResults)) {
        const fileSection = document.createElement('div');
        fileSection.classList.add('file-section');
        fileSection.innerHTML = `<h2>${fileName}</h2>`;

        items.forEach(result => {
            const resultCard = document.createElement('div');
            resultCard.classList.add('result-card');

            const displayText = result.password;

            const detailedText = `Name: ${result.name || 'Unknown'}, IP: ${result.ip || 'N/A'}, Password: ${result.password}`;

            resultCard.innerHTML = `
            <p><strong>Name:</strong> ${result.name || 'Unknown'}</p>
            <p><strong>IP:</strong> ${result.ip || 'N/A'}</p>
            <p><strong>Password:</strong> ${displayText}</p>
            <p>
            <button class="copy-button" data-text="${detailedText}">Copy All</button>
            </p>
            `;
            fileSection.appendChild(resultCard);
        });

        fragment.appendChild(fileSection);
    }

    resultContainer.appendChild(fragment);

    addCopyEventListeners();
}

function addCopyEventListeners() {
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const text = button.getAttribute('data-text');
            copyToClipboard(text);
        });
        button.addEventListener('touchend', (event) => {
            event.preventDefault();
            const text = button.getAttribute('data-text');
            copyToClipboard(text);
        });
    });
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard.');
        });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy using fallback: ', err);
            alert('Failed to copy to clipboard.');
        }
        document.body.removeChild(textarea);
    }
}
