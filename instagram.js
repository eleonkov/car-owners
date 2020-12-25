const moment = require('moment');
const fetch = require('node-fetch');

module.exports = class Instagram {
  constructor() {
    this.lastUpdate = moment().unix();
  }

  getTypeName(node) {
    return this.isReels(node.dimensions) ? 'Reels' : node.__typename;
  }

  isFreshEdge(edge) {
    return edge.node.taken_at_timestamp > this.lastUpdate;
  };

  isReels({ height, width }) {
    return ((parseInt(height / width * 10)) / 10) == 1.7 ? true : false;
  }

  isGoodFormat(edge) {
    return edge.node.dimensions.height >= edge.node.dimensions.width;
  }

  updateUserEdge(edge) {
    let {
      shortcode,
      thumbnail_src,
      edge_liked_by,
      video_view_count = 0,
      edge_media_to_comment
    } = edge.node;

    return {
      typename: this.getTypeName(edge.node),
      thumbnail: thumbnail_src,
      shortcode: shortcode,
      insight: {
        likes: edge_liked_by.count,
        comments: edge_media_to_comment.count,
        views: video_view_count,
      }
    };
  }

  getUserDataByUsername(username) {
    return fetch(`https://www.instagram.com/${username}/?__a=1`)
      .then(res => res.json())
      .then((data) => {
        const edges = data.graphql.user.edge_owner_to_timeline_media.edges;

        return edges.filter((edge) => !this.isFreshEdge(edge) || !this.isGoodFormat(edge))
          .map(edge => this.updateUserEdge(edge));
      })
      .catch(e => {
        console.log(e.message);

        return null;
      });
  }
}