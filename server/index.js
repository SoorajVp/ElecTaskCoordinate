import http from 'http';
import fs from 'fs';

const port = 5000;

const server = http.createServer((req, res) => {

    if (req.method === 'GET' && req.url === '/electricians') {
        fs.readFile('constants/electricians.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data)
        })

    } else if (req.method == 'GET' && req.url === '/sites') {
        fs.readFile('constants/sites.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data)
        })

    } else if (req.method === 'GET' && req.url === '/auto-assign') {

        fs.readFile('constants/sites.json', 'utf8', (siteErr, sitesData) => {
            if (siteErr) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }

            fs.readFile('constants/electricians.json', 'utf8', (electErr, electriciansData) => {
                if (electErr) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                }

                let sites = JSON.parse(sitesData)
                let electricians = JSON.parse(electriciansData)

                for (let i = 0; i < sites.length; i++) {
                    for (let j = 0; j < electricians.length; j++) {

                        if (sites[i].AssignedElectritian.length) break;
                        if (sites[i].grievance && electricians[j].grievanceElectrician) {
                            sites[i].AssignedElectritian.push({ electricianName: electricians[j].name, electricianAssignDate: new Date() })
                            break;
                        } else if (!sites[i].grievance && !electricians[j].grievanceElectrician) {
                            sites[i].AssignedElectritian.push({ electricianName: electricians[j].name, electricianAssignDate: new Date() })
                            break;
                        }
                    }
                }

                const updatedData = JSON.stringify(sites);
                fs.writeFile('constants/sites.json', updatedData, 'utf8', (writeErr) => {
                    if (writeErr) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(updatedData)
                })

            })

        })
    }
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})