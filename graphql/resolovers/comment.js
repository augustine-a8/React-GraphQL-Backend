const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");

module.exports = {
  Mutation: {
    async deleteComment(
      _,
      { deleteCommentInput: { postId, commentId } },
      context
    ) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );
        if (commentIndex !== -1) {
          console.log(commentIndex);
          if (
            post.comments[commentIndex].username ===
            username
          ) {
            post.comments.splice(commentIndex, 1);
            await post.save();
            return post;
          }
          throw new AuthenticationError(
            "Action not allowed"
          );
        }
        throw new UserInputError("Comment does not exist");
      }
      throw new UserInputError("Post does not exist");
    },
    async createComment(
      _,
      { createCommentInput: { postId, body } },
      context
    ) {
      const { username } = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Empty Comment", {
          errors: {
            body: "Comment body must be provided",
          },
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      }
      throw new UserInputError("Post not found");
    },
  },
};
