import nodemailer from "nodemailer";
import mailGun from "nodemailer-mailgun-transport";

export const sendMail = (link) => {
  const auth = {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
  };
  const transporter = nodemailer.createTransport(mailGun(auth));
  const mailOptions = {
    from: process.env.MAILGUN_SRC_MAIL,
    to: process.env.MAILGUN_DST_MAIL,
    subject: "RESET PASSWORD LINK",
    text: link,
  };
  return transporter.sendMail(mailOptions);
};
