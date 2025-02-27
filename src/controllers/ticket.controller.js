const prisma = require("../prisma");

// Get all tickets (Customers see their own, Admins see all)
exports.getTickets = async (req, res) => {
  try {
    const userId = req.user.userId;
    let where = {};

    if (req.user.role === "CUSTOMER") {
      where = { customerId: userId };
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: { customer: true, executive: true, replies: true },
    });

    res.json({
      message: "Tickets fetched successfully",
      success: true,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, success: false });
  }
};

// Get a single ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: { customer: true, executive: true, replies: true },
    });

    if (!ticket) {
      return res
        .status(404)
        .json({ message: "Ticket not found", success: false });
    }

    res.json({
      message: "Ticket fetched successfully",
      success: true,
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, success: false });
  }
};

// Create a new ticket

exports.createTicket = async (req, res) => {
  try {
    const { subject, description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        message: "Subject and description are required",
        success: false,
      });
    }

    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        status: "OPEN",
        customerId: req.user.id,
        executiveId: admin ? admin.id : null,
      },
    });

    res.status(201).json({
      message: "Ticket created successfully",
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error, success: false });
  }
};

// Update a ticket (only Admins can update status or assign executives)
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, executiveId } = req.body;

    let data = {};
    if (status) data.status = status;
    if (executiveId) data.executiveId = Number(executiveId);

    const ticket = await prisma.ticket.update({
      where: { id: Number(id) },
      data,
    });

    res.json({
      message: "Ticket updated successfully",
      success: true,
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, success: false });
  }
};

// Delete a ticket (Customers can delete their own, Admins can delete any)
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
    });

    if (!ticket) {
      return res
        .status(404)
        .json({ message: "Ticket not found", success: false });
    }

    if (req.user.role === "CUSTOMER" && ticket.customerId !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    await prisma.ticket.delete({ where: { id: Number(id) } });

    res.json({ message: "Ticket deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, success: false });
  }
};
