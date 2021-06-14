const {
    jwt
} = require('../helper/require-helper');

const {
    JWT_SECRET
} = require('../helper/secret.json');

module.exports = (req, res, next) => {

    console.log('req.headers.authorization:: ', req.headers.authorization);
    let token = req.headers.authorization

    if (!token) {
        return res.status(401).send("Access Denied");
    }

    token = req.headers.authorization.replace("Bearer ", "");

    console.log('token:: ', token);

    try {
        const user = jwt.verify(token, JWT_SECRET);
        console.log('user: ', user);

        let req_url = req.baseUrl + req.route.path;

        // * Check authorization 
        // * 1 = User
        if (req_url.includes("/getUserData")) {
            if (user.userTypeID !== 1) {
                return res.status(401).send("Unauthorized!");
            }
            console.log('I am User');
        }

        // * 2 = Admin, 3 = Owner
        if (req_url.includes("/admin")) {
            if (user.userTypeID === 1) {
                return res.status(401).send("Unauthorized!");
            }
            console.log('I must be Admin Or Owner');
        }

        // * 3 = Owner
        if (req_url.includes("/owner")) {
            if (user.userTypeID !== 3) {
                return res.status(401).send("Unauthorized!");
            }
            console.log('I am Owner');
        }
        req.user = user;
        next();
    } catch (error) {
        console.log('Error:: ', error)
        return res.status(302).redirect("/login.html");
    }
}