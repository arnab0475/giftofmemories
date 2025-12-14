import { Enquiry } from "../Model/Enquiry.js";
export const postEnquiry = async (req, res) => {
  try {
    const { name, email, message, source } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const newEnquiry = new Enquiry({
      name,
      email,
      message,
      source: source || "website",
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
    const csvHeader = "Name,Email,Message,Source,Date\n";
    const csvRows = enquiries
      .map((enquiry) => {
        const name = `"${enquiry.name || ""}"`;
        const email = `"${enquiry.email || ""}"`;
        const message = `"${(enquiry.message || "").replace(/"/g, '""')}"`;
        const source = `"${enquiry.source || ""}"`;
        const date = `"${
          enquiry.createdAt ? new Date(enquiry.createdAt).toISOString() : ""
        }"`;

        return `${name},${email},${message},${source},${date}`;
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
