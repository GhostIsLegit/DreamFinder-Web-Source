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
            console.log('Fetched data:', data); // Depuración
            displayResults(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayResults([]); // Mostrar mensaje de error en la interfaz
        });
}

function determineHashType(password) {
    if (/^SHA512\$.+?\$.+$/i.test(password)) return 'SHA512Custom';
    if (/^[a-fA-F0-9]{128}$/i.test(password)) return 'SHA512';
    if (/^[a-fA-F0-9]{64}$/i.test(password)) return 'SHA256';
    if (/^\$SHA(?:512)?\$\S+\$\S+$/i.test(password)) return 'SHA';
    return 'PlainText';
}

function getPasswordInfo(password, hashType) {
    const sha256Pattern = /^[a-fA-F0-9]{64}$/;
    const sha512Pattern = /^[a-fA-F0-9]{128}$/;
    const shaPattern = /^\$SHA(?:512)?\$(\S+)\$(\S+)$/;
    const sha512CustomPattern = /^SHA512\$([a-fA-F0-9]+)\$([a-fA-F0-9]+)$/;

    if (hashType === 'SHA256' && sha256Pattern.test(password)) {
        return { hash: password, salt: '' };
    }
    if (hashType === 'SHA512' && sha512Pattern.test(password)) {
        return { hash: password, salt: '' };
    }
    if (hashType === 'SHA' && shaPattern.test(password)) {
        const shaMatch = password.match(shaPattern);
        return { hash: shaMatch[2], salt: shaMatch[1] };
    }
    if (hashType === 'SHA512Custom' && sha512CustomPattern.test(password)) {
        const sha512Match = password.match(sha512CustomPattern);
        return { hash: sha512Match[2], salt: sha512Match[1] };
    }
    return { hash: '', salt: '' };
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

            const hashType = determineHashType(result.password);
            console.log(`Password: ${result.password}, HashType: ${hashType}`);

            let hashSaltText = '';
            let detailedText = '';
            let passwordText = '';

            if (hashType === 'SHA512Custom') {
                hashSaltText = `${result.password.split('$')[1]}:${result.password.split('$')[2]}`;
                detailedText = `Name: ${result.name || 'Unknown'}, IP: ${result.ip || 'N/A'}, Hash: ${result.password.split('$')[1]}, Salt: ${result.password.split('$')[2]}, Password: ${result.password}`;
                passwordText = 'Encrypted'; // Puedes personalizar esto según tus necesidades
            } else {
                const { hash, salt } = getPasswordInfo(result.password, hashType);
                hashSaltText = salt ? `${hash}:${salt}` : hash;
                detailedText = `Name: ${result.name || 'Unknown'}, IP: ${result.ip || 'N/A'}, Hash: ${hash}, Salt: ${salt ? salt : 'N/A'}, Password: ${result.password}`;
                passwordText = hashType === 'PlainText' ? result.password : 'Encrypted';
            }

            resultCard.innerHTML = `
                <p><strong>Name:</strong> ${result.name || 'Unknown'}</p>
                <p><strong>IP:</strong> ${result.ip || 'N/A'}</p>
                <p><strong>Password:</strong> ${passwordText}</p>
                <p>
                    <button class="copy-button" data-text="${hashSaltText}">Copy Hash & Salt</button>
                    <button class="copy-button detailed" data-text="${detailedText}">Copy All</button>
                </p>
            `;
            fileSection.appendChild(resultCard);
        });

        fragment.appendChild(fileSection);
    }

    resultContainer.appendChild(fragment);

    // Agregar event listeners después de agregar el contenido
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
        // Fallback for older browsers or specific devices
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
