const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailCheck = require("email-check");
const jwtSecret = process.env.secret;

exports.register = async (req, res, next) => {
  const { email, password, role, phoneNumber, organization, username, gender } =
    req.body;
  var valid;

  await emailCheck(email)
    .then(function (res) {
      valid = res;
    })
    .catch(function (err) {
      valid = false;
    });

  if (!valid) {
    return res.json({
      status: 400,
      message: "Email Does not Exist",
    });
  }
  if (password.length < 6) {
    return res.json({
      status: 400,
      message: "Password less than 6 characters",
    });
  }
  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      email,
      password: hash,
      role,
      phoneNumber,
      organization,
      username,
      gender,
    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, email, role: user.role },
          jwtSecret,
          {
            expiresIn: maxAge, // 3hrs
          }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        });
        res.json({
          status: 200,
          message: "User successfully created",
        });
      })
      .catch((error) =>
        res.json({
          status: 400,
          message: "User not successfully created",
          error: error.message,
        })
      );
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
 
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.json({
        status: 400,
        message: "Login not successful",
        error: "User not found",
      });
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
            expiresIn: maxAge, // 3hrs in sec
          });
          res.cookie("jwt", token, {
            httpOnly: false,
            maxAge: maxAge * 1000,
          });

          res.json({
            status: 200,
            message: "User successfully Logged in",
            user: user._id,
            role: user.role,
            jwt: token,
          });
        } else {
          res.json({
            status: 401,
            message: "Login not succesful",
            error: "Incorrect Password",
          });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.getGateway = (req, res) => {
  res.redirect("/login");
};

exports.logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
};

exports.getAdmin = async (req, res) => {
  const id = req.userId;
  const user = await User.findById(id);
  res.render("./adminpanel/admin", { user });
};

exports.adminLogin = async (req, res) => {
  res.render("./login");
};

exports.get404 = async (req, res) => {
  res.render("./404");
};
