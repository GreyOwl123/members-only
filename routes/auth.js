var express = require('express');
var router = express.Router();

const message_controller = require("../controllers/messageController");
const user_controller = require("../controllers/userController");



// User routes

router.get('/', user_controller.index)

router.get('/home', user_controller.home)

router.get('/user/signup', user_controller.signup_get)

router.post('/user/signup', user_controller.signup_post)

router.get("/user/member", user_controller.member_get) 

router.post("/user/member", user_controller.member_post)

router.get("/user/login", user_controller.login_get)

router.post("/user/login", user_controller.login_post)

router.get("/user/logout", user_controller.logout_get)

router.post("/user/logout", user_controller.logout_post)

router.get("/user/update", user_controller.user_update_get)

router.post("/user/update", user_controller.user_update_post)

router.get("/user/delete", user_controller.user_update_get)

router.post("/user/delete", user_controller.user_update_post)

router.get("/users", user_controller.user_list)

router.get("/user/:id", user_controller.user_detail)

// Message routes.

router.get("/messages", message_controller.message_list)

router.get("/message/:id", message_controller.message_detail)

router.get('/message/create', message_controller.message_create_get)

router.post('/message/create', message_controller.message_create_post)
  
router.get('/message/update', message_controller.message_update_get)

router.post('/message/update', message_controller.message_update_post)

router.get('/message/delete', message_controller.message_delete_get)

router.get('/message/delete', message_controller.message_delete_post)  


module.exports = router;