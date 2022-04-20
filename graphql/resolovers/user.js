const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const {
  registerInputsValidator,
  loginInputValidator,
} = require("../../util/validators");

const User = require("../../models/User");
const { SECRETKEY } = require("../../config");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    SECRETKEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(_, { loginInput: { username, password } }) {
      const { errors, valid } = loginInputValidator(
        username,
        password
      );
      if (!valid) {
        throw new UserInputError("Errors", errors);
      }

      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User does not exits";
        throw new UserInputError(
          "User does not exist",
          errors
        );
      }

      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );
      if (!passwordMatch) {
        errors.general = "Wrong Credentials";
        throw new UserInputError(
          "Password is incorrect",
          errors
        );
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      {
        registerInput: {
          username,
          email,
          password,
          confirmPassword,
        },
      }
    ) {
      // validate user input
      const { errors, valid } = registerInputsValidator(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", errors);
      }
      // make sure user doesn't already exists
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is Taken", {
          error: "This username is taken",
        });
      }
      // hash password and generate auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
