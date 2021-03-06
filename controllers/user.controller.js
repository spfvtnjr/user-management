const bcrypt = require('bcrypt');
const {
    auth
} = require('../middlewares/authentication');
const admin = require('../middlewares/isAdmin');

const {
    user,
    userValidation,
    loginValidation,
} = require('../Models/user.model');
const {
    formatResult
} = require('../utilis/imports');

exports.gettingUsers = async (req, res) => {
    try {
        let {
            page,
            limit
        } = req.query
        if (!page)
            page = 1
        if (!limit)
            limit = 10
        if (page < 1)
            return res.send(formatResult({
                status: 400,
                message: "page query should greater than 0"
            }))
        const options = {
            page: page,
            limit: limit
        }
        const users = await user.paginate({}, options)
        res.send(formatResult({
            data: users
        }))

    } catch (error) {
        res.send(formatResult({
            status: 500,
            message: error
        }))
    }
}

exports.createUser = async (req, res) => {
    try {
        const body = req.body;
        const {
            error
        } = userValidation(body)
        if (error)
            return res.send(formatResult({
                status: 400,
                message: error
            }))
        //password confirmation
        if (body.password != body.confirmPassword) {
            return res.send(formatResult({
                status: 400,
                message: "passwords do not match"
            }))
        }
        //avoiding same emails
        const sameEmail = await user.findOne({
            email: body.email
        })
        if (sameEmail)
            return res.send(formatResult({
                status: 403,
                message: "user with the same email already exists"
            }))
        //avoiding same usernames
        const sameUsername = await user.findOne({
            username: body.username
        })
        if (sameUsername)
            return res.send(formatResult({
                status: 403,
                message: "with the same username already exists"
            }))
        //hashing password
        const saltRounds = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, saltRounds)
        body.password = hashedPassword

        const newUser = new user(body)
        await newUser.save()

        return res.send(
            formatResult({
                status: 200,
                message: "new user registered successfully",
                data: newUser
            })
        )

    } catch (error) {
        res.send(formatResult({
            status: 500,
            message: error
        }))
    }
}

exports.userUpdate = async (req, res) => {
    try {
        const body = req.body
        const {
            error
        } = userValidation(body)
        if (error)
            return res.send(formatResult({
                status: 400,
                message: error,
            }))
        //checking if the user exists
        const userExistence = await user.findOne({
            _id: req.params.id
        })
        if (!userExistence)
            return res.send(formatResult({
                status: 403,
                message: "the user you're trying to update does not exist",
            }))
        if (res.password != req.confirmPassword)
            return res.send(formatResult({
                status: 400,
                message: "passwords do not match"
            }))
        //hashing the password 
        const saltRounds = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(body.password, saltRounds)
        body.password = hashedPassword
        const updatedUser = await user.findOneAndUpdate({
            _id: req.params.id
        }, body)
        return res.send(formatResult({
            status: 200,
            message: "user Updated successfully",
            data: updatedUser
        }))
    } catch (error) {
        res.send(formatResult({
            status: 500,
            message: error
        }))
    }
}
exports.userDeletion = async (req, res) => {
    try {
        const userToBeDeleted = await user.findOneAndDelete({
            _id: req.params.id
        })
        if (!userToBeDeleted)
            return res.send(formatResult({
                status: 404,
                message: "user not found"
            }))
        res.send(formatResult({
            status: 200,
            message: "user deleted successfully",
            data: userToBeDeleted
        }))

    } catch (error) {
        res.send(formatResult({
            status: 500,
            message: error
        }))
    }
}
exports.userLogin = async (req, res) => {
    try {
        //validating the body
        const {
            error
        } = loginValidation(req.body)
        if (error)
            return res.send(formatResult({
                status: 401,
                message: error
            }))
        //finding if the user exists
        const userw = await user.findOne({
            email: req.body.email
        })
        if (!userw)
            return res.send(formatResult({
                status: 404,
                message: "Invalid email or password"
            }))
        //comparing passwords
        const validpwd = await bcrypt.compare(req.body.password,userw.password)
        if (!validpwd)
            return res.send({
                status: 404,
                message: "invalid email or password"
            })
        res.send(formatResult({
            status: 200,
            message: "Loged in succesfully",
            data: await user.generateAuthToken()
        }))
    } catch (error) {
        res.send(formatResult({
            status: 401,
            message: error
        }))
    }
}