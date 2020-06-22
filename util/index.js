const moment = require('moment');

const isGoodFormat = (post) => post.node.dimensions.height >= post.node.dimensions.width;

const isFresh = (post, tstmp) => {
    return post.node.taken_at_timestamp > tstmp;
}

const getView = (content) => {
    const li = content.map((post) => (`
        <div class="grid-item ${post.typename}">
            <a target="_blank" href="https://www.instagram.com/p/${post.shortcode}/">
                <img src=${post.thumbnail_src} />
            </a>
        </div>
    `));

    return `<html>
        <head><link rel="stylesheet" href="./styles.css"></head>
        <body><div class="grid-container">${li.join('')}</div></body>
    </html>`;
}

exports.getView = getView;
exports.isGoodFormat = isGoodFormat;
exports.isFresh = isFresh;