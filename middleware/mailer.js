const { request } = require("express");
const Mailjet = require("node-mailjet");
const API_KEY = "90ed303e06e6498e6e45180e32d94949";
const Secret_Key = "77de11b01e64a8b7f04001ff0656b757";
const mailjet = Mailjet.apiConnect(API_KEY, Secret_Key);

exports.SendEmail = async (email, message, subject) => {
  try {
    console.log(email);
    const request = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "2107.subham@gmail.com",
            Name: "SFL",
          },
          To: [
            {
              Email: `${email}`,
              Name: `${email}`,
            },
          ],
          Subject: `${subject}`,
          HTMLPart: `${message}`,
          CustomID: "Passsword Reset",
        },
      ],
    });
    console.log(!!request);
  } catch (e) {
    console.log(e);
  }
};
