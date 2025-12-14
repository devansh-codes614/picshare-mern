const jwt = require('jsonwebtoken');

const authCheck = function (req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'token missing' });
    }

    try{
         const decodedData = jwt.verify(authHeader,'picshare_secret');
         req.userId = decodedData.id;
            next();
    } catch (err) {
        return res.status(401).send({ message: 'invalid token' });
    }

};

module.exports = authCheck;