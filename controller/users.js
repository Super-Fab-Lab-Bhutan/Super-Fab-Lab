const User = require("../model/user");
const Booking = require("../model/booking");
const PasswordReset = require("../model/forgotPassword");

const bcrypt = require("bcryptjs");

const { SendEmail } = require("../middleware/mailer");


exports.getProfile = async (req, res) => {
  const id = req.body.userID;
  const UserData = await User.findById({ _id: id });
  const bookings = await Booking.find({ user: id });
  try {
    res.json({ UserData, bookings });
  } catch (e) {
    console.log(e);
  }
};

exports.getUsers = async (req, res) => {
  const user = await User.find({ role: { $ne: "admin" } });
  res.render("./adminpanel/viewusers/viewusers", { users: user });
};

exports.editUsers = async (req, res) => {
  const { id } = req.params;
  const users = await User.findById(id);
  res.render("./adminpanel/viewusers/edit", { user: users });
};

exports.patchUsers = async (req, res) => {
  const updatedUser = req.body;
  const { id } = req.params;
  await User.findByIdAndUpdate(id, updatedUser);
  res.redirect("/admin/users");
};

exports.patchApprove = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { isVerified: true });

  const message =
    "<p><b> Your Registration for SFL Registration is approved, Now you can log in for booking</b> </p>";
  const subject = "Registration approved!!";
  SendEmail(user.email, message, subject);
  res.redirect("/admin/users");
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);

  res.redirect("/admin/users");
};

exports.getApproval = async (req, res) => {
  const approve = await User.find({ isVerified: false });
  res.render("./adminpanel/viewusers/approve", { approve });
};

exports.forgotPassword = async (req, res) => {
  const { email, redirectUrl } = req.body;
  newEmail = email;
  const exist = await User.findOne({ email: email });
  if (!!exist) {
    sendResetEmail(exist.id, email, redirectUrl, res);
  } else {
    return res.json({
      message: "Email does not exist",
      value: "false",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { userId, resetString, newPassword } = req.body;

  PasswordReset.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        const { expiresAt } = result[0];
        const hashedResetString = result[0].uniqueString;

        if (expiresAt.getTime() < new Date().getTime()) {
          PasswordReset.deleteOne({ userId })
            .then(() => {
              return res.json({
                message: "Reset Link Expired",
                value: "false",
              });
            })
            .catch((error) => {
              return res.json({
                message: "clearing expired token failed",
                value: "false",
              });
            });
        } else {
          bcrypt
            .compare(resetString, hashedResetString)
            .then((result) => {
              if (result) {
                bcrypt
                  .hash(newPassword, 10)
                  .then((newHashedPassword) => {
                    User.updateOne(
                      { _id: userId },
                      { password: newHashedPassword }
                    )
                      .then(() => {
                        PasswordReset.deleteOne({ userId });

                        return res.json({
                          message: "Password Reset Sucessful",
                          value: e,
                        });
                      })
                      .catch((e) => {
                        return res.json({
                          message: "saving the password failed",
                          value: e,
                        });
                      });
                  })
                  .catch((e) => {
                    return res.json({
                      message: "hashing failed",
                      value: e,
                    });
                  });
              } else {
                return res.json({
                  message: "Token does not match",
                  value: e,
                });
              }
            })
            .catch((e) => {
              return res.json({
                message: "comparing token failed",
                value: "false",
              });
            });
        }
      } else {
        return res.json({
          message: "password reset not found",
          value: "false",
        });
      }
    })
    .catch((error) => {
      return res.json({
        message: "Checking for existing reset token failed",
        value: error,
      });
    });
};

const sendResetEmail = (id, email, redirectUrl, res) => {
  const resetString = Math.random().toString(36).substring(2, 7) + id;

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 360);

  PasswordReset.deleteMany({ userId: id })
    .then((result) => {
      bcrypt
        .hash(resetString, 10)
        .then((hashedResetString) => {
          const newPasswordReset = new PasswordReset({
            userId: id,
            uniqueString: hashedResetString,
            createdAt: new Date(),
            expiresAt: expiresAt,
          });
          newPasswordReset
            .save()
            .then(() => {
              const message = `<p>We heard that you lost your pasword . </p> 
              <p>Don't worry, use the link below to reset it.</p>
              <p>This link <b>expires in 6 hours</b>.</p>
              <p>Enter the user id and reset token after going to this link</p>
              <a href="https://jnwbhutansuperfablab.bt/resetpassword">Reset Password</a>
              <p>User ID: ${id} </p>
              <p>Reset Token:  ${resetString} </p>`
              const subject = "Passsword Reset Link"
              SendEmail(email,message,subject)
            })
            .catch((error) => {
              return res.json({
                message: "error occured while saving the token",
                value: "false",
              });
            });
        })
        .catch((error) => {
          return res.json({
            message: "erroe occured",
            value: "false",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.json({
        message: "Clearing existing pass failed",
        value: "false",
      });
    });
};
