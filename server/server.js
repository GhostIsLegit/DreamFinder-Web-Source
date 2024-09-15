const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const cors = require('cors');

const app = express();
const port = 3000;

let databaseCache = {};

const loadDatabasesIntoMemory = () => {
    const dirPath = path.join(__dirname, '../dbs/');
    
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        const jsonFiles = files.filter(file => file.endsWith('.json'));
        let fileReadPromises = jsonFiles.map(file => {
            return new Promise((resolve, reject) => {
                fs.readFile(path.join(dirPath, file), 'utf8', (err, data) => {
                    if (err) return reject(err);
                    
                    try {
                        const jsonData = JSON.parse(data);
                        databaseCache[file] = jsonData;
                    } catch (parseError) {
                        console.error(`Error parsing JSON in file ${file}:`, parseError);
                    } finally {
                        resolve();
                    }
                });
            });
        });

        Promise.all(fileReadPromises)
            .then(() => {
                console.log('Databases loaded into memory.');
            })
            .catch(err => {
                console.error('Error loading databases into memory:', err);
            });
    });
};

loadDatabasesIntoMemory();

app.use(cors());
app.use(express.static(path.join(__dirname, '../public/')));
app.use('../dbs', express.static(path.join(__dirname, '../dbs/')));

app.get('/list-files', (req, res) => {
    const files = Object.keys(databaseCache);
    res.json(files);
});

app.get('/search', (req, res) => {
    const userSearchTerm = req.query.user ? req.query.user : '';
    const ipSearchTerm = req.query.ip ? req.query.ip.toLowerCase() : '';
    let results = [];

    console.log(`Received search request - User: "${userSearchTerm}", IP: "${ipSearchTerm}"`);

    for (const [file, jsonData] of Object.entries(databaseCache)) {
        console.log(`Searching in file ${file}`);
        const filteredData = jsonData.filter(item => 
            (userSearchTerm && item.name && item.name === userSearchTerm) ||  
            (ipSearchTerm && item.ip && item.ip.toLowerCase() === ipSearchTerm)
        );
        
        const fileNameWithoutExtension = path.basename(file, '.json');
        results = results.concat(filteredData.map(result => ({
            ...result,
            file: fileNameWithoutExtension
        })));
    }

    console.log(`Results found: ${results.length}`);

    res.json(results);
});

app.get('/local-ips', (req, res) => {
    const networkInterfaces = os.networkInterfaces();
    const ips = [];

    for (const [name, interfaces] of Object.entries(networkInterfaces)) {
        interfaces.forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(iface.address);
            }
        });
    }

    if (ips.length > 0) {
        res.json({ ips });
    } else {
        res.status(404).json({ message: 'No IPs found' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log('Local IPs:', getLocalIPs());
});

function getLocalIPs() {
    const networkInterfaces = os.networkInterfaces();
    const ips = [];

    for (const [name, interfaces] of Object.entries(networkInterfaces)) {
        interfaces.forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(iface.address);
            }
        });
    }

    return ips;
}
