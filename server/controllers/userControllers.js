const users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const pdf = require("html-pdf");
const path = require("path");
const pdfTemplate = require("../documents/document");
const moment = require("moment");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fs = require("fs");

//User registration
module.exports.postuser = async (req, res) => {
  console.log(req.body);

  const { name, associateId, location, facility, email, password } = req.body;

  if (!name || !associateId || !location || !facility || !email || !password) {
    return res.status(422).json("Please fill in all the required fields.");
  }

  try {
    const preuser = await users.findOne({ associateId: associateId });
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    console.log(preuser);
    if (preuser) {
      return res.status(422).json("This user already exists.");
    } else {
      const adduser = new users({
        name,
        associateId,
        location,
        facility,
        email,
        userName: associateId,
        password: hash,
      });
      await adduser.save();
      console.log(adduser);
      let smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "Gmail",
        port: 465,
        secure: true,
        auth: {
          user: "bedudooriramya@gmail.com",
          pass: "dejqdsfjeacfcdre",
        },
        tls: { rejectUnauthorized: false },
      });
      console.log("send email");
      smtpTransport.sendMail(
        {
          from: "bedudooriramya@gmail.com",
          to: email,
          subject: "Registration Confirmation",
          text: `Your Registration is succesfull.
            userName:${associateId}
            password:${password}
          Kindly use above credinatials to login and change your password`,
        },

        function (error, info) {
          if (error) {
            console.log(error);
            console.log("Error sending the email.");
          } else {
            console.log(
              "Mail has been sent to your email. Check your mail",

              info
            );
          }
        }
      );
      return res.status(201).json(adduser);
    }
  } catch (error) {
    return res.status(422).json(error);
  }
};

module.exports.checkinUser = async (req, res) => {
  console.log(req.body);
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(422).json("Please fill in all the required fields.");
  }
  try {
    let exist = await users.findOne({ userName });
    if (!exist) {
      return res.status(400).send("User Not Found");
    }
    const isPasswordCorrect = await bcrypt.compare(password, exist.password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid credentials");
    }
    let payload = {
      user: {
        id: exist.id,
        userName: exist.userName,
        password: exist.password,
        name: exist.name,
        location: exist.location,
        facility: exist.facility,
        email: exist.email,
        associateId: exist.associateId,
        isAdmin: exist.isAdmin,
      },
    };

    jwt.sign(payload, "jwtSecret", { expiresIn: 3600000 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (error) {
    return res.status(422).json("Please enter valid credintials");
  }
};

// All associate details
module.exports.getAssociates = async (req, res) => {
  try {
    const associates = await users.find();
    console.log(associates);

    return res.status(200).json(associates);
  } catch (error) {
    return res.status(422).json(error);
  }
};

// Associates based on id
module.exports.getAssociate = async (req, res) => {
  try {
    const associate = await users.findById(req.params.id);
    console.log(associate);

    return res.status(200).json(associate);
  } catch (error) {
    return res.status(422).json(error);
  }
};

// Updating associate
module.exports.updateAssociate = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAssociate = await users.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log(updatedAssociate);
    const associates = await users.find();
    res.status(201).json(associates);
  } catch (error) {
    res.status(422).json(error);
  }
};

//Delete Associate
module.exports.deleteAssociate = async (req, res) => {
  try {
    console.log("cartdelete", req.params.id);

    const deleteuser = await users.findByIdAndDelete({ _id: req.params.id });
    console.log("deleteuser", deleteuser);
    const associates = await users.find();
    console.log(associates);
    return res.status(200).json(associates);
  } catch (error) {
    return res.status(422).json(error);
  }
};

// Password change
module.exports.passwordChange = async (req, res) => {
  console.log(req.body);
  let { currentPassword, newPassword } = req.body;
  console.log(req.params.id);
  try {
    let exist = await users.findById(req.params.id);
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      exist.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).send("Please enter the coorect current password");
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);
      const updatedUser = await users.findByIdAndUpdate(req.params.id, {
        password: hash,
      });
      console.log(updatedUser);
      res.status(200).json({ message: "Password changed successfully!" });
    }
  } catch (error) {
    console.log(error);
    res.status(422).json(error);
  }
};

module.exports.saveDates = async (req, res) => {
  try {
    const { id, dates } = req.body;
    console.log("Dates", dates);
    let associate = await users.findById(id);
    let previousDates = associate?.checkInDates?.reduce(function (acc, curr) {
      acc.push(curr.toISOString().split("T")[0]);
      return acc;
    }, []);
    console.log(previousDates);
    let checkedInDates = dates.reduce(function (acc, curr) {
      if (!previousDates.includes(curr)) acc.push(curr);
      return acc;
    }, []);
    console.log("type", typeof associate.checkInDates[0]);
    console.log(checkedInDates, "checkedInDates");
    console.log(associate, [...associate.checkInDates, ...checkedInDates]);
    await users.findByIdAndUpdate(id, {
      $push: { checkInDates: [...checkedInDates] },
    });
    return res.status(200).json({ message: "Dates saved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred" });
  }
};

module.exports.sendEmail = async (req, res) => {
  const associates = await users.find();

  pdf
    .create(pdfTemplate(associates), { timeout: 60000 })
    .toFile("report.pdf", (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        console.log("PDF generated succesfully");
      }
    });

  const filePath = path.join(__dirname, "report.pdf"); // Get the absolute file path

  let smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
      user: "bedudooriramya@gmail.com",
      pass: "dejqdsfjeacfcdre",
    },
    tls: { rejectUnauthorized: false },
  });

  smtpTransport.sendMail(
    {
      from: "bedudooriramya@gmail.com",
      to: req.body.email,
      subject: "Pdf Generate document",
      html: `
        Testing Pdf Generate document Thanks.`,
      attachments: [
        {
          path: filePath, // Use 'path' instead of 'content'
        },
      ],
    },

    function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).send("Error sending the email.");
      } else {
        res.send("Mail has been sent to your email. Check your mail");
      }
    }
  );
};

module.exports.getCheckInDates = async (req, res) => {
  try {
    const userId = req.params.id;
    // Find the user by their ID
    const associate = await users.findById(userId);
    if (!associate) {
      return res.status(404).json({ error: "User not found" });
    }
    // Return the saved dates for the user
    return res.status(200).json({
      message: "Dates retrieved successfully",

      savedDates: associate.checkInDates,
    });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "bedudooriramya@gmail.com",
    pass: "dejqdsfjeacfcdre",
  },
});

module.exports.sendPdfEmail = async (req, res) => {
  try {
    const { originalname, buffer } = req.file;

    // Create a temporary file to store the PDF

    const tempDir = path.join(__dirname, "temp");

    // Create the "temp" directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Define the path for the PDF file
    const tempFilePath = path.join(tempDir, originalname);

    // Write the buffer to the temporary file
    fs.writeFileSync(tempFilePath, buffer);

    // Define email options
    const mailOptions = {
      from: "bedudooriramya@gmail.com",
      to: "saranya6400@gmail.com",
      subject: "Location Distribution Report",
      text: "Please find the Location Distribution Report attached.",
      attachments: [
        {
          filename: originalname,
          path: tempFilePath,
        },
      ],
    };

    // Send the email with the attached PDF
    await transporter.sendMail(mailOptions);

    // Delete the temporary file
    fs.unlinkSync(tempFilePath);

    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Email sending failed." });
  }
};
// module.exports.getCheckInDatesByLocation =
//   // Controller function to get check-in dates by location
//   async (req, res) => {
//     try {
//       const location = req.params.location;
//       const use = await users.find({ location });
//       const checkInDates = use.map((user) => user.checkInDates).flat(); // Flatten the check-in dates array
//       res.json({ checkInDates });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   };

// module.exports.getCheckInDatesByLocation = async (req, res) => {
//     try {
//       const { location, month } = req.params;
//       const use = await users.find({ location }); // Filter users who checked in for the specified month
//       const usersInMonth = use.filter((user) => {
//         return user.checkInDates.some((date) => {
//           return moment(date).format("YYYY-MM") === month;
//         });
//       });
//       const count = usersInMonth.length;
//       console.log(count)
//       res.json({ count });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }

// Define a function to generate a random OTP
function generateRandomOTP(length) {
  const characters = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters.charAt(randomIndex);
  }

  return otp;
}

// Define a route to send OTP to the user's email
let storedOTP = 129878;

module.exports.sendOtp = async (req, res) => {
  try {
    // Generate a random OTP (you can use a library for this)
    const otp = generateRandomOTP(6); // Generate a 6-digit OTP
    storedOTP = otp;

    // Send the OTP to the user's email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 465,
      secure: true,
      auth: {
        user: "bedudooriramya@gmail.com",
        pass: "dejqdsfjeacfcdre",
      },
    });

    const mailOptions = {
      from: "bedudooriramya@gmail.com",
      to: req.body.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    // Respond with a success message
    res.status(200).json({ message: "OTP sent to the user's email." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP." });
  }
};


module.exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log("Entered OTP:", otp);
    console.log("Stored OTP:", storedOTP);

    if (otp !== storedOTP) {
      console.error("Invalid OTP.");
      return res.status(400).json({ error: "Invalid OTP." });
    }

    // Hash the new password before updating it in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await users.findOne({ email });

    console.log("User found:", user);

    if (!user) {
      console.error("User not found.");
      return res.status(404).json({ error: "User not found." });
    }

    // Add more logging for the update operation
    console.log("Updating user password...");

    user.password = hashedPassword;
    await user.save();

    console.log("Password update successful.");

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Failed to reset password." });
  }
};
