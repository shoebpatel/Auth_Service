const constants = require('../helper/constants.json');

module.exports = (req, res, next) => {
  if (req && req.headers && req.headers.authorization) {
    let requestedToken = req.headers.authorization;
    if (requestedToken === constants.authtoken) {
      next()
    } else {
      res.status(401).send({
        status: false,
        message: 'Access denied! Invalid auth token'
      })
    }
  } else {
    res.status(401).send({
      status: false,
      message: 'Access denied! Auth token is mandatory'
    })
  }
};