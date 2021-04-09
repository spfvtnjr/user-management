const express = require("express");
const router = express.Router()
const { createUser ,gettingUsers,userDeletion,userUpdate, userLogin } = require("../controllers/user.controller");
const { auth } = require("../middlewares/authentication");
// const admin = require("../middlewares/isAdmin");
router.route("/")
.get([auth,gettingUsers])
.post(createUser)
router.route("/:id")
.put(userUpdate)
.delete(userDeletion)
router.route("/login")
.post(userLogin)
module.exports.userRoutes = router;