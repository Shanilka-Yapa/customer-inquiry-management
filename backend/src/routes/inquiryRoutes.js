const express = require("express");
const router = express.Router();

const {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
} = require("../controllers/inquiryController");

const { authenticateToken } = require("../middleware/authMiddleware");

const {
  validateCreateInquiry,
  validateUpdateStatus,
} = require("../validators/inquiryValidator");

router.use(authenticateToken);

router.post("/", validateCreateInquiry, createInquiry);
router.get("/", getInquiries);
router.get("/:id", getInquiryById);
router.patch("/:id/status", validateUpdateStatus, updateInquiryStatus);

module.exports = router;