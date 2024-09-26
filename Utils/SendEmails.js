import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: "opencommunitytest@gmail.com",
    // pass: "opencommunity123",

    user: "color6wrld@gmail.com",
    pass: "gyva yaxg ddia ouns",
  },
});

const notifyUsersOfEventChange = (users, eventName) => {
  users.forEach((email) => {
    //const { name, email } = person;

    // Customize the email message for each person with HTML content
    const mailOptions = {
      from: "color6wrld@gmail.com",
      to: email,
      subject: `Event RSVP Reminder - ${eventName}`,
      html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #bcd727;">Hey </h2>
              <p> A change was made to event "<strong>${eventName}</strong>" .</p>
              <p>The RSVP deadline is on <strong>${deadline}</strong>.</p>
              <p style="margin-top: 20px;">
                <a href="https://localhost:3000/Home/community/sfjNQtaUvxfoDNCFacvn" 
                   style="
                     background-color: #bcd727;
                     color: white;
                     padding: 10px 20px;
                     text-decoration: none;
                     border-radius: 5px;
                     display: inline-block;
                     font-weight: bold;
                   ">
                   RSVP Now
                </a>
              </p>
              <p>If you have any questions, feel free to reply to this email.</p>
              <p>Best regards,<br>The Admin</p>
            </div>
          `,
    };

    // Assuming 'transporter' is already configured and available in your scope
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(`Error sending email to ${email}:`, error);
      }
      console.log(`Email sent to ${email}: ${info.response}`);
    });
  });
};

export { notifyUsersOfEventChange };
