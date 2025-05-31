import jwt from "jsonwebtoken";

const createToken = (id, option) => {
  const options = {
    expiresIn: "7d",
    ...option,
  };
  return jwt.sign({ id }, process.env.JWT_SECRET, options);
};

export default createToken;
