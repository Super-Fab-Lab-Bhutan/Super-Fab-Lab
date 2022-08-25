const User = require("../model/user");
const Booking = require("../model/booking");
const PasswordReset = require("../model/forgotPassword");

const bcrypt = require("bcryptjs");

const { SendEmailHtml } = require("../middleware/mailer");

exports.getProfile = async (req, res) => {
  const { userID, date } = req.body;
  const UserData = await User.findById({ _id: userID });
  const bookings = await Booking.find({ userID: userID, date: date });
  try {
    res.json({ UserData, bookings });
  } catch (e) {
    console.log(e);
  }
};

exports.getUsers = async (req, res) => {
  const user = await User.find({ role: { $ne: "admin" } });
  res.render("./adminpanel/viewusers/viewusers");
};

exports.getUsersData = async (req, res) => {
  const user = await User.find({ role: { $ne: "admin" } });
  res.json(user)
}

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

  const message =`<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;" width="640">
										<tbody>
											<tr>
												<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
													<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tbody>
															<tr>
																<td class="pad" style="padding-top:30px;">
																	<div align="center" class="alignment">
																		<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
																			<tbody>
																				<tr>
																					<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;">
																						<span> </span></td>
																				</tr>
																			</tbody>
																		</table>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tbody>
															<tr>
																<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
																	<div style="font-family: Georgia, 'Times New Roman', serif">
																		<div class="txtTinyMce-wrapper" style="font-size: 12px; font-family: Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																			<p style="margin: 0; font-size: 16px; text-align: center;">
																				<span style="font-size:22px;"><strong>Welcome
																						to the family of
																						JNWSFL.</strong></span></p>
																		</div>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tbody>
															<tr>
																<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
																	<div style="font-family: Georgia, 'Times New Roman', serif">
																		<div class="txtTinyMce-wrapper" style="font-size: 12px; font-family: Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
																			<p style="margin: 0; font-size: 17px; text-align: center; mso-line-height-alt: 18px;">
																				&nbsp;</p>
																			<p style="margin: 0; font-size: 17px; text-align: center;">
																				<strong>Your Registration for SFL
																					Registration is
																					approved!</strong><br><br></p>
																			<p style="margin: 0; font-size: 17px; text-align: center; mso-line-height-alt: 25.5px;">
																				<span style="font-size:17px;">Please
																					check our website to know more about
																					your perks as a members and also,
																					book for an induction training
																					program from our booking system.
																					<br>You will get access to machines
																					only after the Induction training.
																				</span></p>
																			<p style="margin: 0; font-size: 17px; text-align: center; mso-line-height-alt: 18px;">
																				&nbsp;</p>
																			<p style="margin: 0; font-size: 17px; text-align: center; mso-line-height-alt: 25.5px;">
																				<span style="font-size:17px;">For
																					further inquires, please contact our
																					team. <br>We will see you
																					soon.</span></p>
																			<p style="margin: 0; font-size: 17px; text-align: center; mso-line-height-alt: 18px;">
																				&nbsp;</p>
																		</div>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>`;
  const subject = "Registration Successful!";
  SendEmailHtml(user.email, message, subject);
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
  const { email } = req.body;
  newEmail = email;
  const exist = await User.findOne({ email: email });
  if (!!exist) {
    sendResetEmail(exist.id, email, res);
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
                          value: "true",
                        });
                      })
                      .catch((e) => {
                        return res.json({
                          message: "saving the password failed",
                          value: "false",
                        });
                      });
                  })
                  .catch((e) => {
                    return res.json({
                      message: "hashing failed",
                      value: "false",
                    });
                  });
              } else {
                return res.json({
                  message: "Token does not match",
                  value: "false",
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

const sendResetEmail = (id, email, res) => {
  const resetString = Math.random().toString(36).substring(2, 7) + id;

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15); // expires in 15 minutes

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
              const message = `<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;"
										width="640">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="divider_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad" style="padding-top:30px;">
																	<div align="center" class="alignment">
																		<table border="0" cellpadding="0"
																			cellspacing="0" role="presentation"
																			style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
																			width="100%">
																			<tbody>
																				<tr>
																					<td class="divider_inner"
																						style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;">
																						<span>&hairsp;</span></td>
																				</tr>
																			</tbody>
																		</table>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad"
																	style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
																	<div style="font-family: Arial, sans-serif">
																		<div class="txtTinyMce-wrapper"
																			style="font-size: 12px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																			<p
																				style="margin: 0; font-size: 16px; text-align: center;">
																				<span
																					style="font-size:30px;color:#2b303a;"><strong>Forgot
																						Your Password?</strong></span>
																			</p>
																		</div>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-3" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad"
																	style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
																	<div style="font-family: sans-serif">
																		<div class="txtTinyMce-wrapper"
																			style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
																			<p
																				style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 24px;">
																				<span style="font-size:16px;">We heard
																					that you lost your pasword . Don't
																					worry, use the token below to reset
																					it. </span></p>
																			<p
																				style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 24px;">
																				<span style="font-size:16px;">This Token
																					expires in 15 minutes</span></p>
																			<p
																				style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 18px;">
																				&nbsp;</p>
																			<p
																				style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 24px;">
																				<span style="font-size:16px;">Reset
																					Token: </span></p>
																			<p
																				style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 24px;">
																				<span
																					style="font-size:16px;"><em><strong>${resetString}</strong></em></span>
																			</p>
																			<p
																				style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 18px;">
																				&nbsp;</p>
																			<p
																				style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 24px;">
																				<span style="font-size:16px;">Copy and
																					Paste the given token in the link
																					given below</span></p>
																		</div>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="button_block block-4" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad"
																	style="text-align:center;padding-top:10px;padding-right:10px;padding-bottom:70px;padding-left:10px;">
																	<div align="center" class="alignment">
																		<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${process.env.REACTSERVER}/resetpassword/${id}" style="height:52px;width:190px;v-text-anchor:middle;" arcsize="8%" stroke="false" fillcolor="#f7e10c"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#000000; font-family:Tahoma, sans-serif; font-size:21px"><![endif]--><a
																			href="${process.env.REACTSERVER}/resetpassword/${id}"
																			style="text-decoration:none;display:inline-block;color:#000000;background-color:#f7e10c;border-radius:4px;width:auto;border-top:1px solid #f7e10c;font-weight:400;border-right:1px solid #f7e10c;border-bottom:1px solid #f7e10c;border-left:1px solid #f7e10c;padding-top:5px;padding-bottom:5px;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"
																			target="_blank"><span
																				style="padding-left:20px;padding-right:20px;font-size:21px;display:inline-block;letter-spacing:normal;"><span
																					dir="ltr"
																					style="word-break: break-word; line-height: 42px;"><strong>Reset
																						Password</strong></span></span></a>
																		<!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>`;
              const subject = "Passsword Reset";
              SendEmailHtml(email, message, subject);
              return res.json({
                message: "Email sent",
                userID: id,
                value: "true",
              });
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
