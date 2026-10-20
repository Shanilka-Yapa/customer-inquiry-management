const { z } = require("zod");

const createInquirySchema = z.object({
  customerName: z.string().trim().min(1).max(100),
  contact: z.string().trim().min(1).max(100),
  subject: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1).max(2000),
});

const updateStatusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED"]),
});

const validateCreateInquiry = (req, res, next) => {
  const result = createInquirySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  next();
};

const validateUpdateStatus = (req, res, next) => {
  const result = updateStatusSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid inquiry status",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  next();
};

module.exports = {
  validateCreateInquiry,
  validateUpdateStatus,
};