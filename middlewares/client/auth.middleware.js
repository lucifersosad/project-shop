module.exports.requireAuth = async (req, res, next) => {
  const user = res.locals.user;

  if (!user) {
    res.redirect(`/user/login`);
    return;
  }

  next();
};
