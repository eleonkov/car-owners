const fs = require('fs');
const fetch = require('node-fetch');
const moment = require('moment');

const db = require('./data/db');
const util = require('./util');

require('dotenv').config({
    path: __dirname + '/.env'
});

const carAppInit = async () => {
    const CAR = process.env.CAR || 'nissan';
    const db = JSON.parse(fs.readFileSync('./data/db.json'));
    const fileName = moment().format("Do-YYYY-h-mm-ss-a");

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

    const getResource = async (url) => {
        const res = await fetch('https://www.instagram.com/' + url);
        if (!res.ok) throw new Error(`Could not fetch ${url}, received ${res.status}`);
        return await res.json();
    };

    const getContent = (posts) => {
        return posts.reduce((acc, post) => {
            let { shortcode, thumbnail_src, edge_liked_by, __typename: typename } = post.node;

            if (typename === 'GraphVideo' && util.isFresh(post, db[CAR].lastUpdate)) {
                acc.push({ shortcode, thumbnail_src, typename, edge_liked_by });

                return acc;
            }

            if (util.isGoodFormat(post) && util.isFresh(post, db[CAR].lastUpdate)) {
                acc.push({ shortcode, thumbnail_src, typename, edge_liked_by });

                return acc;
            }

            return acc;
        }, []);
    };

    const fetchContent = async () => {
        let tmpShortcodeList = [];

        for (let owner of db[CAR].owners) {
            const res = await getResource(`${owner}/?__a=1`);
            const shortcodeList = getContent(res.graphql.user.edge_owner_to_timeline_media.edges);
            if (shortcodeList.length !== 0) {
                tmpShortcodeList = [...tmpShortcodeList, ...shortcodeList];
            };
            console.log(`${owner} (${shortcodeList.length})`);
            await sleep(getRandomArbitrary(1000, 5000));
        };

        return tmpShortcodeList;
    }

    const content = await fetchContent();

    fs.writeFile(`./public/${fileName}.html`, util.getView(content), (err) => {
        if (err) throw err;
        db[CAR].lastUpdate = moment().unix();

        fs.writeFile('./data/db.json',  JSON.stringify(db), (err) => {
            if (err) throw err;
            console.log('Done!');
        });
    });
};

carAppInit();
