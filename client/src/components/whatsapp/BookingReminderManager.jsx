import { useState, useEffect } from "react";
import { Bell, Calendar, Users, Plus, Trash2, Edit2, Image as ImageIcon, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const BookingReminderManager = () => {
  const [reminders, setReminders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("active");
  const [isLoading, setIsLoading] = useState(false);
  
  // Get current IST time
  const getCurrentISTTime = () => {
    const now = new Date();
    // IST is UTC+5:30
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset + (now.getTimezoneOffset() * 60 * 1000));
    return istTime.toTimeString().slice(0, 5);
  };
  
  const [formData, setFormData] = useState({
    customerId: "",
    bookingDate: "",
    reminders: [
      { daysBefore: 30, enabled: false, message: "", imageFile: null, sendTime: getCurrentISTTime() },
      { daysBefore: 15, enabled: false, message: "", imageFile: null, sendTime: getCurrentISTTime() },
      { daysBefore: 7, enabled: false, message: "", imageFile: null, sendTime: getCurrentISTTime() },
      { daysBefore: 3, enabled: false, message: "", imageFile: null, sendTime: getCurrentISTTime() },
      { daysBefore: 1, enabled: false, message: "", imageFile: null, sendTime: getCurrentISTTime() }
    ]
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchReminders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_NODE_URL}/api/whatsapp-reminder/booking-reminders`, { withCredentials: true });
      setReminders(res.data);
    } catch (error) {
      console.error("Failed to fetch booking reminders:", error);
      toast.error("Failed to fetch booking reminders");
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_NODE_URL}/api/whatsapp-reminder/customers`, { withCredentials: true });
      setCustomers(res.data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error("Failed to fetch customers");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchReminders();
      await fetchCustomers();
    };
    loadData();
  }, []);

  const handleReminderChange = (index, field, value) => {
    const newReminders = [...formData.reminders];
    newReminders[index][field] = value;
    setFormData({ ...formData, reminders: newReminders });
  };

  const handleImageUpload = (index, file) => {
    const newReminders = [...formData.reminders];
    newReminders[index].imageFile = file;
    newReminders[index].imageUrl = file ? file.name : '';
    setFormData({ ...formData, reminders: newReminders });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Filter only enabled reminders that are valid
    const enabledReminders = formData.reminders.filter(r => 
      r.enabled && isReminderOptionValid(r.daysBefore)
    );
    
    if (enabledReminders.length === 0) {
      toast.error("Please select at least one valid reminder to send");
      setIsLoading(false);
      return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append('customerId', formData.customerId);
    formDataToSend.append('bookingDate', formData.bookingDate);
    formDataToSend.append('customMessage', formData.customMessage);
    formDataToSend.append('reminders', JSON.stringify(enabledReminders.map(r => ({
      daysBefore: r.daysBefore,
      message: r.message,
      sendTime: r.sendTime,
      imageUrl: r.imageUrl || ''
    }))));
    
    // Append each image file separately using correct index
    enabledReminders.forEach((reminder, index) => {
      if (reminder.imageFile) {
        formDataToSend.append(`reminderImage${index}`, reminder.imageFile);
      }
    });
    
    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }

    try {
      if (editingReminder) {
        await axios.put(`${import.meta.env.VITE_NODE_URL}/api/whatsapp-reminder/booking-reminders/${editingReminder._id}`, formDataToSend, { withCredentials: true });
        toast.success("Booking reminder updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_NODE_URL}/api/whatsapp-reminder/booking-reminders`, formDataToSend, { withCredentials: true });
        toast.success("Booking reminder created successfully");
      }
      
      resetForm();
      fetchReminders();
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save booking reminder");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: "",
      bookingDate: "",
      reminders: [
        { daysBefore: 30, enabled: false, message: "", imageFile: null, sendTime: getCurrentISTTime() },
        { daysBefore: 15, enabled: false, message: "", imageFile: null, sendTime: getCurrentISTTime() },
        { daysBefore: 7, enabled: false, message: "", imageFile: null, sendTime: getCurrentISTTime() },
        { daysBefore: 3, enabled: false, message: "", imageFile: null, sendTime: getCurrentISTTime() },
        { daysBefore: 1, enabled: false, message: "", imageFile: null, sendTime: getCurrentISTTime() }
      ]
    });
    setSelectedImage(null);
    setShowAddForm(true);
    setEditingReminder(null);
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      customerId: reminder.customer._id,
      bookingDate: new Date(reminder.bookingDate).toISOString().split('T')[0],
      reminders: reminder.reminders.map(r => ({
        daysBefore: r.daysBefore,
        enabled: true, // All existing reminders are enabled
        message: r.message || "",
        imageFile: null,
        imageUrl: r.imageUrl || "",
        sendTime: r.sendTime || getCurrentISTTime()
      }))
    });
    setShowAddForm(true);
  };

  const handleDelete = async (reminderId) => {
    if (!confirm("Are you sure you want to cancel this booking reminder?")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_NODE_URL}/api/whatsapp-reminder/booking-reminders/${reminderId}`, { withCredentials: true });
      toast.success("Booking reminder cancelled successfully");
      fetchReminders();
    } catch (error) {
      console.error("Failed to cancel reminder:", error);
      toast.error("Failed to cancel reminder");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-600';
      case 'cancelled': return 'bg-slate-gray/10 text-slate-gray';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReminderStatus = (reminders) => {
    const sentCount = reminders.filter(r => r.status === 'sent').length;
    const totalCount = reminders.length;
    return `${sentCount}/${totalCount} sent`;
  };

  const filteredReminders = reminders.filter(reminder => {
    if (statusFilter === 'all') {
      return true;
    }
    return reminder.status === statusFilter;
  });

  // Function to check if a reminder option is valid based on booking date
  const isReminderOptionValid = (daysBefore) => {
    if (!formData.bookingDate) return false;
    
    const bookingDate = new Date(formData.bookingDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Calculate the date when this reminder should be sent
    const reminderDate = new Date(bookingDate);
    reminderDate.setDate(reminderDate.getDate() - daysBefore);
    reminderDate.setHours(0, 0, 0, 0);
    
    // Check if reminder date is today or in the future
    return reminderDate >= currentDate;
  };

  // Function to get reminder option status text
  const getReminderOptionStatus = (daysBefore) => {
    if (!formData.bookingDate) return "Please select booking date first";
    
    if (!isReminderOptionValid(daysBefore)) {
      const bookingDate = new Date(formData.bookingDate);
      const reminderDate = new Date(bookingDate);
      reminderDate.setDate(reminderDate.getDate() - daysBefore);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      const daysPast = Math.floor((currentDate - reminderDate) / (1000 * 60 * 60 * 24));
      return `Not possible - ${daysPast} days past`;
    }
    
    return "Available";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="text-gold-accent" size={24} />
          <h2 className="font-playfair text-xl font-bold text-charcoal-black">Booking Reminders</h2>
        </div>
        
        <button
          onClick={() => {
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gold-accent text-charcoal-black rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-charcoal-black hover:text-gold-accent transition-all shadow-lg"
        >
          <Plus size={16} />
          Create Reminder
        </button>
      </div>

      
      {/* Add/Edit Reminder Form */}
      {showAddForm && (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-charcoal-black/5">
          <h3 className="font-playfair text-lg font-bold text-charcoal-black mb-6">
            {editingReminder ? "Edit Booking Reminder" : "Create New Booking Reminder"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal-black mb-2">
                  Customer *
                </label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full h-12 px-4 bg-warm-ivory/30 border border-charcoal-black/10 rounded-xl text-sm focus:ring-1 focus:ring-gold-accent outline-none"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name} ({customer.phone})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal-black mb-2">
                  Booking Date *
                </label>
                <input
                  type="date"
                  value={formData.bookingDate}
                  onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-12 px-4 bg-warm-ivory/30 border border-charcoal-black/10 rounded-xl text-sm focus:ring-1 focus:ring-gold-accent outline-none"
                  required
                />
              </div>
            </div>
            
            {/* Individual Reminder Messages */}
            <div>
              <h4 className="font-bold text-charcoal-black mb-4">Select Reminder Days</h4>
              <div className="space-y-4">
                {formData.reminders.map((reminder, index) => {
                  const isValid = isReminderOptionValid(reminder.daysBefore);
                  const statusText = getReminderOptionStatus(reminder.daysBefore);
                  
                  return (
                    <div key={reminder.daysBefore} className={`bg-warm-ivory/20 rounded-xl p-4 ${!isValid ? 'opacity-60' : ''}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={reminder.enabled}
                          onChange={(e) => handleReminderChange(index, 'enabled', e.target.checked)}
                          disabled={!isValid}
                          className={`w-5 h-5 text-gold-accent bg-white border-charcoal-black/20 rounded focus:ring-gold-accent focus:ring-2 ${
                            !isValid ? 'cursor-not-allowed opacity-50' : ''
                          }`}
                        />
                        <Calendar size={16} className={`${!isValid ? 'text-slate-gray' : 'text-gold-accent'}`} />
                        <span className={`font-bold ${!isValid ? 'text-slate-gray' : 'text-charcoal-black'}`}>
                          {reminder.daysBefore} Days Before
                        </span>
                        {!isValid && (
                          <span className="ml-auto text-xs text-red-500 font-medium">
                            {statusText}
                          </span>
                        )}
                      </div>
                      
                      {reminder.enabled && isValid && (
                        <div className="space-y-3 ml-8">
                          <textarea
                            value={reminder.message}
                            onChange={(e) => handleReminderChange(index, 'message', e.target.value)}
                            placeholder={`Message to send ${reminder.daysBefore} days before booking...`}
                            rows={3}
                            className="w-full p-3 bg-white border border-charcoal-black/10 rounded-xl text-sm focus:ring-1 focus:ring-gold-accent outline-none resize-none"
                          />
                          
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="time"
                              value={reminder.sendTime}
                              onChange={(e) => handleReminderChange(index, 'sendTime', e.target.value)}
                              className="w-full h-10 px-3 bg-white border border-charcoal-black/10 rounded-xl text-sm focus:ring-1 focus:ring-gold-accent outline-none"
                            />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                className="hidden"
                                id={`image-upload-${index}`}
                              />
                              <label
                                htmlFor={`image-upload-${index}`}
                                className="w-full h-10 px-3 bg-white border border-charcoal-black/10 rounded-xl text-sm flex items-center justify-center cursor-pointer hover:bg-gold-accent/10 transition-colors"
                              >
                                {reminder.imageFile ? (
                                  <span className="text-emerald-600 text-xs truncate">{reminder.imageFile.name}</span>
                                ) : reminder.imageUrl ? (
                                  <span className="text-gold-accent text-xs truncate">{reminder.imageUrl}</span>
                                ) : (
                                  <span className="text-slate-gray text-xs">Upload Image (optional)</span>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {!isValid && formData.bookingDate && (
                        <div className="ml-8 text-xs text-slate-gray">
                          This reminder option is not available for the selected booking date.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 bg-charcoal-black text-gold-accent rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-gold-accent hover:text-charcoal-black transition-all shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? "Processing..." : (editingReminder ? "Update Reminder" : "Create Reminder")}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-slate-gray text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-charcoal-black transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex items-center justify-center gap-2 p-2 bg-white rounded-full shadow-sm border border-charcoal-black/5 w-fit mx-auto my-6">
        {['active', 'completed', 'cancelled', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all capitalize ${
              statusFilter === status
                ? 'bg-charcoal-black text-gold-accent shadow-md'
                : 'text-slate-gray hover:bg-warm-ivory/30'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {filteredReminders.map((reminder) => (
          <div key={reminder._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-charcoal-black/5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gold-accent/10 rounded-full flex items-center justify-center">
                    <Users size={18} className="text-gold-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal-black">{reminder.customer.name}</h4>
                    <p className="text-slate-gray text-sm">{reminder.customer.phone}</p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(reminder.status)}`}>
                    {reminder.status}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-slate-gray text-xs mb-2">
                    <Calendar size={14} />
                    <span>Booking Date: {formatDate(reminder.bookingDate)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {reminder.reminders.map((r) => (
                      <div key={r.daysBefore} className="bg-warm-ivory/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-charcoal-black text-xs">{r.daysBefore}d</span>
                          <span className={`w-2 h-2 rounded-full ${
                            r.status === 'sent' ? 'bg-emerald-500' : 
                            r.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'
                          }`} />
                        </div>
                        <p className="text-slate-gray text-xs truncate mb-1">{r.message || 'No message'}</p>
                        <p className="text-gold-accent text-xs font-medium">
                          {r.sendTime ? `${r.sendTime} IST` : r.daysBefore === 1 ? 'Send Today' : 'Time not set'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-gray text-xs">
                  <span>Progress: {getReminderStatus(reminder.reminders)}</span>
                  {reminder.customImageUrl && (
                    <div className="flex items-center gap-1">
                      <ImageIcon size={14} />
                      <span>Custom image attached</span>
                    </div>
                  )}
                </div>
              </div>
              
              {reminder.status === 'active' && (
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(reminder)}
                    className="p-2 text-gold-accent hover:bg-gold-accent/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(reminder._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {filteredReminders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-[2rem] shadow-sm border border-charcoal-black/5">
            <Bell className="mx-auto text-slate-gray/30 mb-4" size={48} />
            {reminders.length === 0 ? (
              <p className="text-slate-gray">No booking reminders found</p>
            ) : (
              <p className="text-slate-gray">No booking reminders with status "{statusFilter}"</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingReminderManager;