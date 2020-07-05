const moment = require('moment');

const isGoodFormat = (post) => post.node.dimensions.height >= post.node.dimensions.width;

const isFresh = (post, tstmp) => {
    return post.node.taken_at_timestamp > tstmp;
}

const getView = (content) => {
	const sortedContent = content.sort((a, b) => b.edge_liked_by.count -  a.edge_liked_by.count);
	
    const li = sortedContent.map((post) => (`
        <div class="grid-item ${post.typename}">
			<span>❤ ${post.edge_liked_by.count}</span>
            <a target="_blank" href="https://www.instagram.com/p/${post.shortcode}/">
                <img src=${post.thumbnail_src} />
            </a>
        </div>
    `));

    return `<html>
        <head><link rel="stylesheet" href="./styles.css">
		<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet"></head>
        <body><div class="grid-container">${li.join('')}</div></body>
    </html>`;
}

exports.getView = getView;
exports.isGoodFormat = isGoodFormat;
exports.isFresh = isFresh;