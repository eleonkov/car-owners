const fs = require('fs');
const fetch = require('node-fetch');
const moment = require('moment');
let Instagram = require('./instagram');

const db = require('./data/db');
const util = require('./util');

require('dotenv').config({
    path: __dirname + '/.env'
});

// Instagram = new Instagram();

// Instagram.sessionId = "10384331809%3ACIK5NgOKvRKi3K%3A20";
// Instagram.csrfToken = "5ej7GNlPNooRPg5T55nFS5rvnNDSFero";

const carAppInit = async () => {
    const CAR = process.env.CAR || 'nissan';
    const db = JSON.parse(fs.readFileSync('./data/db.json'));
    const fileName = moment().format("Do-YYYY-h-mm-ss-a");

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;


    const getResource = async (url) => {
        //const ownerData = await Instagram.getUserDataByUsername(owner);
        const res = await fetch('https://www.instagram.com/' + url);

        if (!res.ok) return null;
        // if (!ownerData) return null;
        
        return await res.json();

        // return ownerData;
    };

    const getContent = (posts) => {
        return posts.reduce((acc, post) => {
            let { shortcode, thumbnail_src, dimensions, edge_liked_by, edge_media_to_comment, __typename: typename } = post.node;

            if (typename === 'GraphVideo' && util.isFresh(post, db[CAR].lastUpdate)) {
                acc.push({ shortcode, thumbnail_src, typename, edge_liked_by, edge_media_to_comment, isReels: util.isReels(dimensions) });

                return acc;
            }

            if (util.isGoodFormat(post) && util.isFresh(post, db[CAR].lastUpdate)) {
                acc.push({ shortcode, thumbnail_src, typename, edge_liked_by, edge_media_to_comment });

                return acc;
            }

            return acc;
        }, []);
    };

    const fetchContent = async () => {
        let tmpShortcodeList = [];

        for (let owner of db[CAR].owners) {
            const res = await getResource(`${owner}/?__a=1`);
            if (res) {
                const shortcodeList = getContent(res.graphql.user.edge_owner_to_timeline_media.edges);

                if (shortcodeList.length !== 0) {
                    tmpShortcodeList = [...tmpShortcodeList, ...shortcodeList];
                };

                console.log(`${owner} (${shortcodeList.length})`);
            } else {
                console.log(`User not found: ${owner}`);
            }

            await sleep(getRandomArbitrary(1000, 5000));
        };

        return tmpShortcodeList;
    }

    const content = await fetchContent();

    fs.writeFile(`./public/${fileName}.html`, util.getView(content), (err) => {
        if (err) throw err;
        db[CAR].lastUpdate = moment().unix();

        fs.writeFile('./data/db.json', JSON.stringify(db), (err) => {
            if (err) throw err;
            console.log('Done!');
        });
    });
};

carAppInit();
