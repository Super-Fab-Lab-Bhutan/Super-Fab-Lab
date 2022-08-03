// const sgMail = require('@sendgrid/mail')
// API='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'
// sgMail.setApiKey(API)

// exports.SendEmail = async (email, message, subject) => {

//   const msg = {
//     to: `${email}`,
//     from: 'bhutansuperfablab@gmail.com', // Change to your verified sender
//     subject: `${subject}`,
//     html: `${message}`,
//   }
//   sgMail
//     .send(msg)
//     .then(() => {
//       const d='Email sent'
//     })
//     .catch((error) => {
//       console.error(error)
//     })
// };

const nodemailer = require("nodemailer");
//create app specific password for your gmail and use that password here{not actual email password}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//send text message
exports.SendEmail = async (email, message, subject) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error.message);
    } else {
      // console.log("Email sent: " + info.response);
    }
  });
};

//send html message
exports.SendEmailHtml = async (email, message, subject) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error.message);
    } else {
      // console.log("Email sent: " + info.response);
    }
  });
};
