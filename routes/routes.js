const express = require("express");
const router = express.Router()
const { createUser ,gettingUsers,userDeletion,userUpdate } = require("../controllers/user.controller");
router.route("/")
.get(gettingUsers)
.post(createUser)
router.route("/:id")
.put(userUpdate)
.delete(userDeletion)
module.exports.userRoutes = router;