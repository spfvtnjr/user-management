const express = require("express");
const router=express.Router()
const { gettingUsers, createUser, userDeletion, userUpdate } = require("../controllers/user.controller");
router.route("/")
.get(gettingUsers)
.post(createUser)
router.route("/:id")
.put(userUpdate)
.delete(userDeletion)
exports.userRoutes=router