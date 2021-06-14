const _ = require("underscore");
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { sequelize } = require('../helper/dbsource');

const safePromise = promise => promise.then(data => ([null, data])).catch(err => ([err]));

module.exports._ = _;
module.exports.Joi = Joi;
module.exports.bcrypt = bcrypt;
module.exports.sequelize = sequelize;
module.exports.safePromise = safePromise;
