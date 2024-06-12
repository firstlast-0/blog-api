var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

// router.get('/', function (req, res, next) {
//     res.render('index');
// });

// router.post('/', asyncHandler(async (req, res, next) => {
//     let user = new User( {username: 'q', password: 'q'} );
//     await user.save();
// }));

module.exports = router;
