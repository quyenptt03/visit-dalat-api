const createTokenUser = (user) => {
  return {
    email: user.email,
    name: user.name,
    userId: user._id,
    role: user.role,
  };
};

module.exports = createTokenUser;
