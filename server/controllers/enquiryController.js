const Enquiry = require('../models/Enquiry');

// @desc    Submit an enquiry
// @route   POST /api/enquiry
// @access  Public
const submitEnquiry = async (req, res) => {
  try {
    const { name, phone, email, message, propertyId, propertyTitle, propertyLocation, enquiryType } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    const enquiry = await Enquiry.create({
      name,
      phone,
      email,
      message,
      propertyId,
      propertyTitle,
      propertyLocation,
      enquiryType: enquiryType || 'general',
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! We will contact you soon.',
      data: enquiry,
    });
  } catch (error) {
    console.error('Enquiry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all enquiries (Admin only)
// @route   GET /api/enquiry
// @access  Private
const getEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: enquiries,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update enquiry status (Admin only)
// @route   PUT /api/enquiry/:id
// @access  Private
const updateEnquiryStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete enquiry (Admin only)
// @route   DELETE /api/enquiry/:id
// @access  Private
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitEnquiry, getEnquiries, updateEnquiryStatus, deleteEnquiry };
