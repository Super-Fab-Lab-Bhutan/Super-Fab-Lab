const sgMail = require('@sendgrid/mail')
API='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'
sgMail.setApiKey(API)

exports.SendEmail = async (email, message, subject) => {

  const msg = {
    to: `${email}`, 
    from: 'bhutansuperfablab@gmail.com', // Change to your verified sender
    subject: `${subject}`,
    html: `${message}`,
  }
  sgMail
    .send(msg)
    .then(() => {
      const d='Email sent'
    })
    .catch((error) => {
      console.error(error)
    })
};
