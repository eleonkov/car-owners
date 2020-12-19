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

const getView = (content) => {
    const sortedContent = content.sort((a, b) => b.edge_liked_by.count - a.edge_liked_by.count);
    const sortedByComents = content.sort((a, b) => b.edge_media_to_comment.count - a.edge_media_to_comment.count);

    const getPosts = getGridPost(sortedContent);

    const graphReelsList = getReels(sortedContent);
    const graphVideoList = getPosts('GraphVideo');
    const GraphSidecarList = getPosts('GraphSidecar');
    const graphImageList = getPosts('GraphImage');

    sortedByComents.length = 30;

    const comment = sortedByComents.map((post) => (`
    <div class="grid-item ${post.typename}">
        <span>❤ ${post.edge_media_to_comment.count}</span>
        <a target="_blank" href="https://www.instagram.com/p/${post.shortcode}/">
            <img src=${post.thumbnail_src} />
        </a>
    </div>
`)).join('');

    return `<html>
        <head><link rel="stylesheet" href="./styles.css">
		<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet"></head>
        <body>
            <h1 style="font-family: 'Montserrat';">30 коменнтируемых</h1>
            <div class="grid-container">${comment}</div>
            <h1 style="font-family: 'Montserrat';">Graph Reels</h1>
            <div class="grid-container">${graphReelsList}</div>
            <h1 style="font-family: 'Montserrat';">Graph Video</h1>
            <div class="grid-container">${graphVideoList}</div>
            <h1 style="font-family: 'Montserrat';">Graph Sidecar</h1>
            <div class="grid-container">${GraphSidecarList}</div>
            <h1 style="font-family: 'Montserrat';">Graph Image</h1>
            <div class="grid-container">${graphImageList}</div>
        </body>
    </html>`;
}

exports.getView = getView;
exports.isGoodFormat = isGoodFormat;
exports.isFresh = isFresh;
exports.isReels = isReels;
