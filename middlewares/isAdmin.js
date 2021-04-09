const { user } = require("../Models/user.model")

function admin(req, res, next) {
    if (req.userw.isAdmin='false') return res.send('access denied').status(403)
    next()
}
module.exports = admin
