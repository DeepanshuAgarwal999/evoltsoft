const createToken = (id, options) => {
  const options = {
    expiresIn: "7d",
    ...options,
  };
  return jwt.sign({ id }, process.env.JWT_SECRET, options);
};
