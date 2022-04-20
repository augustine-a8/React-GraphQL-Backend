const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post!
  }

  type Mutation {
    register(registerInput: RegisterInput!): User!
    login(loginInput: LoginInput!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(
      createCommentInput: CreateCommentInput!
    ): Post!
    deleteComment(
      deleteCommentInput: DeleteCommentInput!
    ): Post!
    likePost(postId: ID!): Post!
  }

  input CreateCommentInput {
    postId: ID!
    body: String!
  }

  input DeleteCommentInput {
    postId: ID!
    commentId: ID!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  type User {
    id: ID!
    username: String!
    token: String!
    email: String!
    createdAt: String!
  }

  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    likes: [Like!]!
    comments: [Comment!]!
    likeCount: Int!
    commentCount: Int!
  }

  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }

  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }
`;
