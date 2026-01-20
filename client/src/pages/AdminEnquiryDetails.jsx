import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { ArrowLeft, Mail, Phone, Clock, Tag, User } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const AdminEnquiryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Approve/Reject modal state
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [emailInfo, setEmailInfo] = useState(null); // store last email send info

  const openModal = (status) => {
    setModalStatus(status);
    setFeedback("");
    setShowModal(true);
  };
  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setModalStatus("");
    setFeedback("");
  };

  const submitStatus = async () => {
    if (!modalStatus) return;
    if (modalStatus === "responded" && !feedback.trim()) {
      toast.error("Please write a response before sending");
      return;
    }

    // Prevent responding to enquiries that are already approved or rejected
    if (
      modalStatus === "responded" &&
      (enquiry?.status === "approved" || enquiry?.status === "rejected")
    ) {
      toast.error(
        "Cannot send a response for enquiries that are approved or rejected"
      );
      return;
    }

    setSaving(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_NODE_URL}/api/enquiry/enquiries/${id}/status`,
        { status: modalStatus, feedback },
        { withCredentials: true }
      );
      setEnquiry(res.data.enquiry);
      const emailInfo = res.data.emailInfo;
      setEmailInfo(emailInfo || null);
      setShowModal(false);
      setModalStatus("");
      setFeedback("");

      if (emailInfo?.sent && emailInfo.preview) {
        try {
          await navigator.clipboard.writeText(emailInfo.preview);
          toast.info("Email preview URL copied to clipboard (dev)");
        } catch (e) {
          toast.success("Email queued — preview available (dev)");
        }
        console.info("Email preview:", emailInfo.preview);
      } else if (emailInfo?.sent) {
        toast.success("Status updated and email sent");
      } else {
        toast.warning(
          "Status updated but email not sent: " +
            (emailInfo?.reason || emailInfo?.error || "SMTP not configured")
        );
        console.warn("Email info:", emailInfo);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/enquiry/enquiries/${id}`,
          {
            withCredentials: true,
          }
        );
        setEnquiry(res.data);
      } catch (err) {
        setError("Failed to load enquiry");
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiry();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-warm-ivory font-inter">
      <Sidebar />
      <div className="flex-1 ml-65 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-md bg-white border border-slate-gray/5 hover:bg-warm-ivory"
                  aria-label="Back"
                >
                  <ArrowLeft size={18} className="text-charcoal-black" />
                </button>

                <div>
                  <h2 className="font-playfair text-2xl font-bold text-charcoal-black">
                    {enquiry?.name || "Enquiry"}
                  </h2>
                  <p className="text-slate-gray/60 text-sm mt-1">
                    Enquiry from{" "}
                    {enquiry?.source ? capitalize(enquiry.source) : "Website"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={enquiry?.status} />
                <div className="text-slate-gray text-sm">
                  {enquiry?.createdAt
                    ? new Date(enquiry.createdAt).toLocaleString()
                    : ""}
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <button
                    onClick={() => openModal("approved")}
                    disabled={enquiry?.status === "approved"}
                    className={`py-2 px-4 rounded-md text-sm font-semibold shadow-sm transition-colors ${
                      enquiry?.status === "approved"
                        ? "opacity-50 cursor-not-allowed bg-charcoal-black text-gold-accent"
                        : "bg-charcoal-black text-gold-accent hover:bg-[#0c0c0c]"
                    }`}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => openModal("responded")}
                    disabled={
                      enquiry?.status === "responded" ||
                      enquiry?.status === "approved" ||
                      enquiry?.status === "rejected"
                    }
                    className={`py-2 px-4 rounded-md text-sm font-semibold shadow-sm transition-colors ${
                      enquiry?.status === "responded" ||
                      enquiry?.status === "approved" ||
                      enquiry?.status === "rejected"
                        ? "opacity-50 cursor-not-allowed bg-[#2ECC71] text-white"
                        : "bg-[#2ECC71] text-white hover:opacity-90"
                    }`}
                  >
                    Respond
                  </button>

                  <button
                    onClick={() => openModal("rejected")}
                    disabled={enquiry?.status === "rejected"}
                    className={`py-2 px-4 rounded-md text-sm font-semibold shadow-sm transition-colors ${
                      enquiry?.status === "rejected"
                        ? "opacity-50 cursor-not-allowed bg-white text-slate-gray border border-slate-gray/10"
                        : "bg-white text-[#E74C3C] border border-[#E74C3C] hover:bg-[#E74C3C] hover:text-white"
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-10">
                <Loader />
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-10">{error}</div>
            ) : enquiry ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-6 rounded-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-gray/5">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Mail className="text-[#C9A24D]" />
                      <div>
                        <div className="text-slate-gray/60 text-xs">Email</div>
                        <div className="text-charcoal-black font-medium">
                          {enquiry.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Phone className="text-[#C9A24D]" />
                      <div>
                        <div className="text-slate-gray/60 text-xs">Phone</div>
                        <div className="text-charcoal-black font-medium">
                          {enquiry.phone}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="bg-[#FAF9F6] p-3 rounded-md border border-slate-gray/5">
                        <div className="text-slate-gray/60 text-xs">Event</div>
                        <div className="text-charcoal-black font-medium">
                          {enquiry.eventType}
                        </div>
                      </div>

                      <div className="bg-[#FAF9F6] p-3 rounded-md border border-slate-gray/5">
                        <div className="text-slate-gray/60 text-xs">Date</div>
                        <div className="text-charcoal-black font-medium">
                          {enquiry.eventDate
                            ? new Date(enquiry.eventDate).toLocaleDateString()
                            : "-"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-slate-gray/60 text-xs mb-2">
                        Message
                      </div>
                      <div className="bg-warm-ivory p-4 rounded-md border border-slate-gray/5 text-charcoal-black whitespace-pre-wrap">
                        {enquiry.message}
                      </div>
                    </div>

                    {enquiry.adminFeedback && (
                      <div className="mt-4">
                        <div className="text-slate-gray/60 text-xs mb-2">
                          Admin Feedback
                        </div>
                        <div className="bg-[#FAF9F6] p-3 rounded-md border border-slate-gray/5 text-charcoal-black whitespace-pre-wrap">
                          {enquiry.adminFeedback}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <aside className="bg-white p-6 rounded-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-gray/5">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <User className="text-[#C9A24D]" />
                      <div>
                        <div className="text-slate-gray/60 text-xs">Source</div>
                        <div className="text-charcoal-black font-medium">
                          {enquiry.source
                            ? capitalize(enquiry.source)
                            : "Website"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="text-[#C9A24D]" />
                      <div>
                        <div className="text-slate-gray/60 text-xs">
                          Received
                        </div>
                        <div className="text-charcoal-black font-medium">
                          {enquiry.createdAt
                            ? new Date(enquiry.createdAt).toLocaleString()
                            : "-"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Tag className="text-[#C9A24D]" />
                      <div>
                        <div className="text-slate-gray/60 text-xs">Status</div>
                        <div className="text-charcoal-black font-medium">
                          {enquiry.status
                            ? capitalize(enquiry.status)
                            : "Pending"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        className="w-full py-3 bg-charcoal-black text-gold-accent font-semibold rounded-md hover:opacity-95"
                        onClick={() =>
                          navigator.clipboard.writeText(window.location.href)
                        }
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                </aside>
              </div>
            ) : (
              <div className="text-center text-slate-gray/60 py-10">
                No enquiry found
              </div>
            )}

            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg">
                  <h3 className="font-playfair text-lg font-semibold mb-2">
                    {modalStatus === "approved"
                      ? "Approve Enquiry"
                      : modalStatus === "responded"
                      ? "Send Response"
                      : "Reject Enquiry"}
                  </h3>
                  <p className="text-sm text-slate-gray/60 mb-4">
                    {modalStatus === "responded"
                      ? "Write the response that will be sent to the user (required)"
                      : "Add feedback to be sent to the user (optional)"}
                  </p>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                    className="w-full p-3 border border-slate-gray/10 rounded-md mb-4"
                    placeholder={
                      modalStatus === "responded"
                        ? "Write your message to the user"
                        : "Write feedback to the user"
                    }
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={closeModal}
                      className="py-2 px-4 bg-white border rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitStatus}
                      disabled={saving}
                      className={`py-2 px-4 rounded-md font-semibold shadow-sm transition-colors ${
                        modalStatus === "approved"
                          ? "bg-charcoal-black text-gold-accent hover:bg-[#0c0c0c]"
                          : modalStatus === "responded"
                          ? "bg-[#2ECC71] text-white hover:opacity-90"
                          : "bg-[#E74C3C] text-white hover:opacity-95"
                      } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {saving
                        ? "Sending..."
                        : modalStatus === "approved"
                        ? "Send Approval"
                        : modalStatus === "responded"
                        ? "Send Response"
                        : "Send Rejection"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Inline email confirmation panel (last email attempt) */}
            {emailInfo && (
              <div className="mt-4 bg-white p-4 rounded-md border border-slate-gray/5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-slate-gray/60">
                      Email Delivery
                    </div>
                    <div className="text-sm text-charcoal-black">
                      {emailInfo.sent ? (
                        <>
                          Sent to{" "}
                          <span className="font-medium">
                            {emailInfo.to || enquiry.email}
                          </span>
                          {emailInfo.messageId ? (
                            <span className="ml-2">
                              · {emailInfo.messageId}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-red-600">
                          Not sent: {emailInfo.reason || emailInfo.error}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {emailInfo.preview && (
                      <>
                        <a
                          href={emailInfo.preview}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-charcoal-black hover:underline"
                        >
                          Open Preview
                        </a>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(emailInfo.preview)
                          }
                          className="py-1 px-3 bg-charcoal-black text-gold-accent rounded-md text-sm"
                        >
                          Copy Preview URL
                        </button>
                      </>
                    )}

                    <button
                      onClick={async () => {
                        toast.info("Resending email...");
                        try {
                          const res = await axios.put(
                            `${
                              import.meta.env.VITE_NODE_URL
                            }/api/enquiry/enquiries/${id}/status`,
                            {
                              status: enquiry.status,
                              feedback: enquiry.adminFeedback || "",
                            },
                            { withCredentials: true }
                          );
                          setEmailInfo(res.data.emailInfo || null);
                          toast.success("Resend attempted");
                        } catch (err) {
                          console.error(err);
                          toast.error("Resend failed");
                        }
                      }}
                      className="py-1 px-3 bg-white border rounded-md text-sm"
                    >
                      Resend Email
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-4 items-center">
    <div className="text-slate-gray/60 text-sm font-semibold">{label}</div>
    <div className="col-span-2 text-charcoal-black">{value}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const s = (status || "pending").toLowerCase();
  const map = {
    new: "bg-[#C9A24D]/10 text-[#C9A24D] border-[#C9A24D]/20",
    responded: "bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/20",
    pending: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide border ${
        map[s] || map.pending
      }`}
    >
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
};

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

export default AdminEnquiryDetails;
