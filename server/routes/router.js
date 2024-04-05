const { Router } = require("express");
const middleware = require("../middleware");
const multer = require("multer");
const storage = multer.memoryStorage(); // or use disk storage if needed
const upload = multer({ storage: storage });
const {
  postuser,
  checkinUser,
  getAssociates,
  deleteAssociate,
  getAssociate,
  updateAssociate,
  sendEmail,
  passwordChange,
  saveDates,
  getCheckInDates,
  sendPdfEmail,
  sendOtp,
  resetPassword
  
} = require("../controllers/userControllers");

const router = Router();
router.post("/register", postuser);
router.post("/checkin", checkinUser);
router.get("/associates",middleware, getAssociates);
router.post("/send-otp" , sendOtp)
router.post('/reset-password',resetPassword)
router.get("/associate/:id",middleware, getAssociate);
router.patch("/associate/:id",middleware, updateAssociate);
router.delete("/delete/associate/:id",middleware, deleteAssociate);
router.put("/password-change/:id", passwordChange)
router.post("/save-dates",saveDates)
// router.get("/associates/location", getLocation)
router.post("/send-email",sendEmail)
router.get("/associate/:id/dates", getCheckInDates)
router.post("/send-pdf-email", upload.single("pdf"), sendPdfEmail);

module.exports = router;
