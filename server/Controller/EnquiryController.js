import { Enquiry } from "../Model/Enquiry.js";
export const postEnquiry = async (req, res) => {
  try {
    const { name, email, phone, eventType, eventDate, message } = req.body;
    if (!name || !email || !phone || !eventType || !eventDate || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ""))) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
    const parsedDate = new Date(eventDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid event date" });
    }
    const newEnquiry = new Enquiry({
      name,
      email,
      phone,
      eventType,
      eventDate: parsedDate,
      message,
    });
    await newEnquiry.save();
    res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiry: newEnquiry,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const exportEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    const csvHeader =
      "Name,Email,Phone,EventType,EventDate,Message,CreatedAt\n";
    const csvRows = enquiries
      .map((enquiry) => {
        const name = `"${enquiry.name || ""}"`;
        const email = `"${enquiry.email || ""}"`;
        const phone = `"${enquiry.phone || ""}"`;
        const eventType = `"${enquiry.eventType || ""}"`;
        const eventDate = `"${
          enquiry.eventDate
            ? new Date(enquiry.eventDate).toISOString().split("T")[0]
            : ""
        }"`;
        const message = `"${(enquiry.message || "").replace(/"/g, '""')}"`;
        const createdAt = `"${
          enquiry.createdAt ? new Date(enquiry.createdAt).toISOString() : ""
        }"`;
        return `${name},${email},${phone},${eventType},${eventDate},${message},${createdAt}`;
      })
      .join("\n");
    const csv = csvHeader + csvRows;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=enquiries-${Date.now()}.csv`
    );
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
