import { body, validationResult } from "express-validator";

const User = require('../models/user');
const Message = require('../models/message');
const async = require('async');
const bcryptjs = require("bcryptjs");
// const number = require("../public/javascripts/number");
const passport = require("passport");

 exports.index = (req, res, next) => {
     res.render('index', { title: "Exclusive ClubHouse" });
 };

 exports.home = (req, res, next) => {
   async.parallel(
    {
      user_count(callback) {
        User.countDocuments({}, callback);
      },
      message_count(callback) {
        Message.countDocuments({}, callback);
      },
    },
   (err, results) => {
    res.render("home_form",{
     title: "Lobby" ,
     error: err,
     data: results,
    });
   }
    );
};

exports.signup_get = (req, res, next) => {
    res.render("signup_form", { title: "Sign Up" });
 };

exports.signup_post = [ 
body("first_name")
 .trim()
 .isLength({ min: 1 })
 .escape()
 .withMessage("First name must be specified."),
body("last_name")
 .trim()
 .isLength({ min: 1 })
 .escape()
 .withMessage("Last name must be specified."),
body("username")
 .trim()
 .isLength({ min: 1 })
 .escape()
 .withMessage("Username must be specified."),
body("password")
 .trim()
 .isLength({ min: 4 })
 .escape(),

(req, res, next) => {
 const errors = validationResult(req);    
  if (!errors.isEmpty()) {
   res.render("signup_form", {
     title: "Sign Up",
     user: req.body,
     errors: errors.array(),
   });
   return;
 }

bcryptjs.hash(req.body.password, 10, async (err, hashedPassword) => {
  const user = new User({
   first_name: req.body.first_name,
   last_name: req.body.last_name,
   username: req.body.username,
   password: hashedPassword,
 });
  await user.save()
  .then(() => {
    res.redirect("/auth/user/login")
  })
  .catch ((err) => {
    console.log(err)
   });
  });
 }
]

 exports.login_get = (req, res, next) => {
    res.render("login_form", {
       title: "Log In",
      });
 };

 exports.login_post =
    passport.authenticate("local", {
        session: false,
        successRedirect: "/auth/home",
        failureRedirect: "/auth/user/login",
   })

 exports.member_get = (req, res, next) => {
    res.render("member", { title: "Member Validation" });
 };

 exports.member_post = (req, res, next) => {  
   res.app.locals.randomNumber
  try {
   const { pin } = req.body;
     if (randomNumber === pin) {
        return done(null, { message: "Validation Success."});
      }
     else { randomNumber !== pin
        return done(null, false, { message: "Validation Error." }) 
      }
  } catch (err){
    console.log(err);
  }
  res.redirect(User.url);
 };

exports.logout_get = (req, res, next) => {
   res.render("logout_form", { title: "Log out"});
};

exports.logout_post = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next (err);
    }
    res.redirect("/auth/user/login")
   });
};

exports.user_list = function(req, res, next) {
  User.find()
  .exec(function (err, list_users) {
    if (err) {
      return next(err);
    }
  res.render("user_list", {
     title: "Account List",
     user_list: list_users 
    });
  })
};

exports.user_detail = (req, res, next) => {
  async.parallel(
    {
      user(callback) {
       User.findById(req.params.id).exec(callback);
      },
      user_messages(callback) {
       Message.findById({ user: req.params.id}, "message summary").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.user == null) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }
    res.render("user_detail", { 
      title: "Account Detail",
      user: results.user,
      user_messages: results.user_messages,
    });
    }
  );
};

exports.user_update_get = (req, res, next) => {
  async.parallel(
    {
      user(callback) {
        User.findById(req.params.id).exec(callback);
      },
      messages(callback) {
        Message.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.user == null) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }
    res.render("user_form", {
       title: "Update Account",
       user: results.user,
       messages: results.messages,
      });
    }
  );
};

exports.user_update_post = [ 
  body("first_name")
   .trim()
   .isLength({ min: 1 })
   .escape()
   .withMessage("First name must be specified."),
  body("last_name")
   .trim()
   .isLength({ min: 1 })
   .escape()
   .withMessage("Last name must be specified."),
  body("username")
   .trim()
   .isLength({ min: 1 })
   .escape()
   .withMessage("Username must be specified."),
  body("password")
   .trim()
   .isLength({ min: 4 })
   .escape(),

(req, res, next) => {
  const errors = validationResult(req);

 bcryptjs.hash(req.body.password, 10, async (err, hashedPassword) => {
    const user = new User({
     first_name: req.body.first_name,
     last_name: req.body.last_name,
     username: req.body.username,
     password: hashedPassword,
    _id: req.params.id,
  });
})
    if (!errors.isEmpty()) {
      async.parallel({
        messages(callback) {
          Message.find(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
      res.render("user_form", {
        title: "Update Account",
        messages: results.messages,
        user: req.body.user,
        errors: errors.array(),
      });
    });
    return;
    }
    User.findByIdAndUpdate(req.params.id, user, {}, (err, theuser) => {
      if (err) {
        return next(err);
      }
      res.redirect(theuser.url);
    }); 
  }
]

exports.user_delete_get = (req, res, next) => {
  async.parallel(
    {
      user(callback) {
        User.findById(req.params.id).exec(callback);
      },
      user_messages(callback) {
        Message.find({ user: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.user == null) {
        res.redirect("/auth/users");
      }
      res.render("user_delete", {
        title: "Delete Account", 
        user: results.user,
        user_messages: results.user_messages,
      });
    }
  );
};

exports.user_delete_post = (req, res, next) => {
  async.parallel(
    {
      user(callback) {
        User.findById(req.body.userid).exec(callback);
      },
      user_messages(callback) {
        Message.find({ user: req.body.userid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.user_messages.length > 0) {
        res.render("user_delete", {
          title: "Delete Account",
          user: results.user,
          user_messages: results.user_messages,
        });
        return;
      }
      User.findByIdAndRemove(req.body.userid, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  );
};
