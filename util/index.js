const moment = require('moment');

const isGoodFormat = (post) => post.node.dimensions.height >= post.node.dimensions.width;

const isFresh = (post, tstmp) => {
    return post.node.taken_at_timestamp > tstmp;
}

const isReels = ({ height, width }) => {
    return ((parseInt(height / width * 10)) / 10) == 1.7 ? true : false;
}

const getReels = (sortedContent) => {
    const grapContent = sortedContent.filter(elem => {
        return (elem.typename === 'GraphVideo' && elem.isReels) ? true : false
    });

    return grapContent.map((post) => (`
        <div class="grid-item ${post.typename}">
            <span>❤ ${post.edge_liked_by.count}</span>
            <a target="_blank" href="https://www.instagram.com/p/${post.shortcode}/">
                <img src=${post.thumbnail_src} />
            </a>
        </div>
    `)).join('');
}

const getGridPost = (sortedContent) => {

    return function (typename) {
        const grapContent = sortedContent.filter(elem => elem.typename === typename);

        return grapContent.map((post) => (`
            <div class="grid-item ${post.typename}">
                <span>❤ ${post.edge_liked_by.count}</span>
                <a target="_blank" href="https://www.instagram.com/p/${post.shortcode}/">
                    <img src=${post.thumbnail_src} />
                </a>
            </div>
        `)).join('');
    }
}

const getView = (sharedData) => {

    const sortedByComents = sharedData.sort((a, b) => b.insight.comments - a.insight.comments);

    const comments = sortedByComents.map((post) => (`
    <div class="grid-item ${post.typename}">
        <span>❤ ${post.insight.likes}</span>
        <a target="_blank" href="https://www.instagram.com/p/${post.shortcode}/">
            <img src=${post.thumbnail} />
        </a>
    </div>
`)).join('');

    return `<html>
        <head><link rel="stylesheet" href="./styles.css">
		<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet"></head>
        <body>
            <h1 style="font-family: 'Montserrat';">Top comments</h1>
            <div class="grid-container">${comments}</div>
          
        </body>
    </html>`;
}

exports.getView = getView;
exports.isGoodFormat = isGoodFormat;
exports.isFresh = isFresh;
exports.isReels = isReels