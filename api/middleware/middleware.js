const { getById } = require("./../users/users-model");
const yup = require("yup");

function logger(req, res, next) {
  console.log(`[${req.method}]: [${req.url}]`);
  next();
}

function validateUserId(req, res, next) {
  const { id } = req.params;
  getById(id)
    .then((user) => {
      user
        ? ((req.user = user), next())
        : next({
            status: 404,
            message: `user not found`,
          });
    })
    .catch(next);
}

const userSchema = yup.object({
  name: yup.string().trim().required(),
});

function validateUser(req, res, next) {
  userSchema
    .validate(req.body)
    .then((user) => {
      req.body = user;
      next();
    })
    .catch(() => {
      next({
        status: 400,
        message: "missing required name field",
      });
    });
}

const postSchema = yup.object({
  text: yup.string().trim().required(),
});

function validatePost(req, res, next) {
  postSchema
    .validate(req.body)
    .then((post) => {
      req.body = post;
      next();
    })
    .catch(() => {
      next({
        status: 400,
        message: "missing required text field",
      });
    });
}

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
