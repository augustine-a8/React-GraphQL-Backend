const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { SECRETKEY } = require("../config");

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRETKEY);
        return user;
      } catch (err) {
        throw new AuthenticationError(err);
      }
    }
    throw new Error(
      "Authentication header must have the format 'Bearer {token}'"
    );
  }
  throw new Error("Authorization header must be provided");
};
