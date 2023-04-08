const bcryptjs = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const async = require("async");
const User = require("../models/user");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
 new LocalStrategy(async(username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    };
    if (user.password !== password) {
      return done(null, false, { message: "Incorrect password" });
    };
    return done(null, user);
  } catch(err) {
    return done(err);
   };
  });
);

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
   } catch(err) {
     done(err);
   };
});

// Index or Home Page. Implement with care.

// Display User sign-up form on GET.
router.get('/signup', function(req, res, next) => {
  res.render("signup_form", { title: "Sign Up" });
};


// Handle User create on POST.
router.post('/signup',
  // Validate and sanitize fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("username")
    .isEmail()
    .withMessage("Username must be an email")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 4 })
    .escape(),
  body('passwordConfirmation')
    .trim()
    .isLength({ min: 4 })
    .escape(),
  check('password').exists(),
  check(
    'passwordConfirmation',
    'passwordConfirmation field must have the same value as the password field',
  )
    .exists()
    .custom((value, { req }) => value === req.body.password),
);

  // Process request after validation and sanitization.
  function(req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("signup_form", {
        title: "Sign Up",
        user: req.body,
        errors: errors.array(),
      });
      return;
    }
    // Create a User object with escaped and trimmed data.
    const user = new User({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      username: req.body.username,
      password: req.body.password,
    });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful - redirect to home.
      res.redirect('/member');
    });
  };

router.get("/member", function(req, res, next) => {
    res.render('member', { title: "Account Validation" });
};

router.post("/member",{
  res.redirect("/login");
 });

router.get("/login", function(req, res, next) => {
    res.render('login_form', { title: "Log In" });
};

router.post("/login",
     passport.authenticate("local", {
       successRedirect: "/",
       failureRedirect: "/login",
  })
);

router.get("/message", function (req, res, next) => {
     res.render('/message_form', { title: "Create Message" });
};

// Handle Message create on Post
router.post("/message",
  // Validate and sanitize fields.
  body("title")
   .trim()
   .isLength({ min: 1 })
   .escape()
  body("content")
   .trim()
   .isLength({ min: 1 })
   .escape()

   // Process request after validation and sanitization.
   function(req, res, next) => {
     const errors = validationResult(req);

     if(!errors.isEmpty()) {
        res.render("message_form", {
           title: "Create Message",
            user: req.body,
            errors: errors.array(),
         });
         return;
      }
   // Create message object with escaped and trimmed data.
      const user = new User({
        title: req.body.title,
        content: req.body.content,
      });
      user.save((err) => {
        if (err) {
          return next(err);
      }
        // Successful
       res.redirect('/');
    });
  };
