const postResolovers = require("./post");
const userResolvers = require("./user");
const commentResolvers = require("./comment");
const likeResolvers = require("./like");

module.exports = {
  Query: {
    ...postResolovers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolovers.Mutation,
    ...commentResolvers.Mutation,
    ...likeResolvers.Mutation,
  },
  Post: {
    likeCount(parent) {
      return parent.likes.length;
    },
    commentCount(parent) {
      return parent.comments.length;
    },
  },
};
