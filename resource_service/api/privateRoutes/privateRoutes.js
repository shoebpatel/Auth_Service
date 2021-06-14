const express = require('express');
const router = express.Router();
const validateAuthToken = require('../../middleware/authToken');
const {
    safePromise,
    _
} = require('../../helper/require-helper');
const User = require('../../model/user');

// * REST Api to get User data
router.get('/getUserData/:id', validateAuthToken, async (req, res) => {
    console.log('req.param.id', req.params.id);

    let [userErr, userRes] = await safePromise(User.findOne({
        where: {
            userId: req.params.id
        },
        attributes: ['userId', 'email', 'userTypeID', 'CreateDate', 'UpdateDate', 'Active']
    }))

    if (userErr) {
        console.log('userErr: ', userErr);
        return res.json({
            status: 'error',
            message: 'Something went wrong'
        }).status(500)
    }

    if (_.isEmpty(userRes)) {
        return res.json({
            status: 'error',
            message: 'User does not exist'
        }).status(400)
    }

    return res.json({
        status: 'success',
        data: userRes
    }).status(200);

});

// * REST Api to get Admin data
router.get('/admin', validateAuthToken, async (req, res) => {
    console.log('admin route!!!!!!');

    return res.json({
        status: 'success',
        data: {
            userTypeID: 2,
            Description: 'Admin',
            Access: 'can remove any user from the system'
        }
    }).status(200);
});

// * REST Api to get Owner data
router.get('/owner', validateAuthToken, async (req, res) => {
    console.log('owner route!!!!!!');

    return res.json({
        status: 'success',
        data: {
            userTypeID: 3,
            Description: 'Owner',
            Access: 'I am the owner of this website'
        }
    }).status(200);
});

module.exports = router;