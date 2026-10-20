const prisma = require("../services/prisma");

const createInquiry = async (req, res) => {
  try {
    const { customerName, contact, subject, description } = req.body;

    const inquiry = await prisma.inquiry.create({
      data: {
        customerName,
        contact,
        subject,
        description,
        createdById: req.user.id,
      },
    });

    return res.status(201).json({
      message: "Inquiry created successfully",
      inquiry,
    });
  } catch (error) {
    console.error("Create inquiry error:", error);

    return res.status(500).json({
      message: "Failed to create inquiry",
    });
  }
};

const getInquiries = async (req, res) => {
  try {
    const { status, search } = req.query;

    const where = {
      createdById: req.user.id,
    };

    if (status) {
      const allowedStatuses = ["NEW", "IN_PROGRESS", "RESOLVED"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid inquiry status",
        });
      }

      where.status = status;
    }

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ];
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return res.status(200).json({ inquiries });
  } catch (error) {
    console.error("Get inquiries error:", error);

    return res.status(500).json({
      message: "Failed to retrieve inquiries",
    });
  }
};

const getInquiryById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid inquiry ID",
      });
    }

    const inquiry = await prisma.inquiry.findFirst({
      where: {
        id,
        createdById: req.user.id,
      },
    });

    if (!inquiry) {
      return res.status(404).json({
        message: "Inquiry not found",
      });
    }

    return res.status(200).json({ inquiry });
  } catch (error) {
    console.error("Get inquiry error:", error);

    return res.status(500).json({
      message: "Failed to retrieve inquiry",
    });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid inquiry ID",
      });
    }

    const { status } = req.body;

    const existingInquiry = await prisma.inquiry.findFirst({
      where: {
        id,
        createdById: req.user.id,
      },
    });

    if (!existingInquiry) {
      return res.status(404).json({
        message: "Inquiry not found",
      });
    }

    if (existingInquiry.status === status) {
      return res.status(200).json({
        message: "Inquiry status is unchanged",
        inquiry: existingInquiry,
      });
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json({
      message: "Inquiry status updated successfully",
      inquiry,
    });
  } catch (error) {
    console.error("Update inquiry status error:", error);

    return res.status(500).json({
      message: "Failed to update inquiry status",
    });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
};