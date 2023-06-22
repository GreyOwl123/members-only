const { body, validationResult } = require("express-validator");
const async = require("async");
const Message = require("../models/message");


exports.message_list = function(req, res, next) {
   Message.find()
   .exec(function (err, list_messages) {
      if (err) {
         return next(err);
      }
   res.render("message_list", {
       title: "Message List",
      message_list: list_messages
    });
   });
};

exports.message_detail = (req, res, next) => {
   async.parallel(
      {
         message(callback) {
            Message.findById(req.params.id).exec(callback);
         },
      },
      (err, results) => {
         if (err) {
            return next(err);
         }
         if (results.message == null) {
            const err = new Error("Message not found");
            err.status = 404;
            return next(err);
         }
         res.render("message_detail", {
             title: "Message Detail",
            message: results.message,
       });
      }
   );
};

exports.message_create_get = (req, res, next) => {
    res.render("message_form", { title: "Write Message" });
};

exports.message_create_post = [
  body("title")
  .trim()
  .isLength({ min: 1 })
  .escape(),
 body("content")
  .trim()
  .isLength({ min: 1 })
  .escape(),

 async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
       res.render("message_form", {
          title: "Create Message",
           user: req.body,
           errors: errors.array(),
        });
        return;
     }
     try {
      const message = new Message({
       title: req.body.title,
       content: req.body.content,
     });
      await message.save()
      .then(() => {
         res.redirect('/home')
      })
   } catch(err) {
    return done(err)
   }
  }
]

exports.message_update_get = (req, res, next) => {
   async.parallel(
      {
        message(callback) {
          Message.findById(req.params.id).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.message == null) {
          const err = new Error("Message not found");
          err.status = 404;
          return next(err);
        }
      res.render("message_form", {
         title: "Edit Message",
         message: results.message,
        });
      }
    );
};

exports.message_update_post = [
   body("title")
  .trim()
  .isLength({ min: 1 })
  .escape(),
 body("content")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  
   (req, res, next) => {
   const errors = validationResult(req);
   
   const message = new Message({
      title: req.body.title,
      content: req.body.content,
      _id: req.params.id,
    });

    if(!errors.isEmpty()) {
      (err, results) => {
         if (err) {
            return next(err);
         }
         res.render("message_form", {
            title: "Edit Message",
            message, 
            errors: errors.array(),
         });
         return;
      }
      Message.findByIdAndUpdate(req.params.id, message, {}, (err, themessage) => {
         if (err) {
            return next(err);
         }
         res.redirect(themessage.url)
      })
    }
 }
]

exports.message_delete_get = (req, res, next) => {
   async.parallel(
      {
        message(callback) {
          Message.findById(req.params.id).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.message == null) {
          res.redirect("/auth/messages");
        }
        res.render("message_delete", {
          title: "Delete Message", 
          message: results.message,
        });
      }
    );
};

exports.message_delete_post = (req, res, next) => {
   async.parallel(
      {
        message(callback) {
          Message.findById(req.body.messageid).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        } 
          res.render("user_delete", {
            title: "Delete Account",
            user: results.user,
            user_messages: results.user_messages,
          });

        Message.findByIdAndRemove(req.body.messageid, (err) => {
          if (err) {
            return next(err);
          }
          // route for user messages?
          res.redirect("/auth/messages");
        });
      }
    );
};