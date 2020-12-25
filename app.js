const fs = require('fs');
const moment = require('moment');

const db = require('./data/db');
const Instagram = require('./instagram');

require('dotenv').config({
    path: __dirname + '/.env'
});

const view = (data) => `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body><div id="root"></div><script>window._sharedData=${data}</script></body></html>`;

(async () => {
    const instagram = new Instagram();
    instagram.lastUpdate = db[process.env.CAR].lastUpdate;
    let sharedData = [];

    for (const userName of db[process.env.CAR].owners) {
        let userData = await instagram.getUserDataByUsername(userName);
        if (!userData) {
            console.log(`User: ${userName}. Information has not been received.`);
        } else {
            sharedData = [...sharedData, ...userData];
        }
        
        await new Promise((resolve) => setTimeout(resolve, 4000));
    }

    fs.writeFile(`./frontend/public/index.html`, view(JSON.stringify(sharedData)), (err) => {
        if (err) throw err;

        db[process.env.CAR].lastUpdate = moment().unix();

        fs.writeFile('./data/db.json', JSON.stringify(db), (err) => {
            if (err) throw err;
            console.log('Done!');
        });
    });
})();

