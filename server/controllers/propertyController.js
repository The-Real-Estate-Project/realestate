const Property = require('../models/Property');
const path = require('path');
const fs = require('fs');

// True when running in production with Cloudinary
const useCloudinary = Boolean(process.env.CLOUDINARY_CLOUD_NAME);

// Map a multer file object to the URL we store in the DB
// Cloudinary: file.path is the full https:// URL
// Disk:       file.filename is just the filename → prepend /uploads/
const mapFilePath = (f) => (useCloudinary ? f.path : `/uploads/${f.filename}`);

// Delete a stored image (Cloudinary or local disk)
const deleteStoredFile = async (filePath) => {
  if (useCloudinary) {
    const { deleteFile } = require('../config/cloudinary');
    await deleteFile(filePath);
  } else {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
};

// @desc    Get all properties (with filters)
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const { category, propertyType, unitType, search, page = 1, limit = 12, featured } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (propertyType) query.propertyType = propertyType;
    if (unitType) query.unitType = unitType;
    if (featured === 'true') query.isFeatured = true;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } },
        { overview: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: properties,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get newly launched properties
// @route   GET /api/properties/new-launches
// @access  Public
const getNewLaunches = async (req, res) => {
  try {
    const properties = await Property.find({ isNewLaunch: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isFeatured: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(8);
    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single property by ID or slug
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    let property;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      property = await Property.findOne({ _id: id, isActive: true });
    } else {
      property = await Property.findOne({ slug: id, isActive: true });
    }

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create property (Admin only)
// @route   POST /api/properties
// @access  Private
const createProperty = async (req, res) => {
  try {
    const {
      title, category, propertyType, unitType, location, area, address,
      priceMin, priceMax, priceUnit, estimatedEMI, projectSize, configurations,
      totalUnits, possessionDate, overview, amenities, landmarks,
      mapEmbed, mapLink, isNewLaunch, isFeatured, isActive,
      whatsappNumber, contactEmail, contactPhone,
    } = req.body;

    const photos = req.files?.['photos']
      ? req.files['photos'].map(mapFilePath)
      : [];

    const floorPlans = req.files?.['floorPlans']
      ? req.files['floorPlans'].map(mapFilePath)
      : [];

    const videos = req.files?.['videos']
      ? req.files['videos'].map(mapFilePath)
      : [];

    const property = new Property({
      title,
      category,
      propertyType,
      unitType,
      location,
      area,
      address,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      priceUnit: priceUnit || 'Cr',
      estimatedEMI,
      projectSize,
      configurations: configurations
        ? (Array.isArray(configurations) ? configurations : JSON.parse(configurations))
        : [],
      totalUnits: totalUnits ? Number(totalUnits) : undefined,
      possessionDate,
      overview,
      amenities: amenities
        ? (Array.isArray(amenities) ? amenities : JSON.parse(amenities))
        : [],
      landmarks: landmarks
        ? (Array.isArray(landmarks) ? landmarks : JSON.parse(landmarks))
        : [],
      photos,
      floorPlans,
      videos,
      mapEmbed,
      mapLink,
      isNewLaunch: isNewLaunch === 'true' || isNewLaunch === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isActive: isActive !== 'false' && isActive !== false,
      whatsappNumber,
      contactEmail,
      contactPhone,
    });

    await property.save();
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update property (Admin only)
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const updateData = { ...req.body };

    // Parse JSON arrays
    if (updateData.configurations && typeof updateData.configurations === 'string') {
      updateData.configurations = JSON.parse(updateData.configurations);
    }
    if (updateData.amenities && typeof updateData.amenities === 'string') {
      updateData.amenities = JSON.parse(updateData.amenities);
    }
    if (updateData.landmarks && typeof updateData.landmarks === 'string') {
      updateData.landmarks = JSON.parse(updateData.landmarks);
    }

    // Handle booleans
    if (updateData.isNewLaunch !== undefined) {
      updateData.isNewLaunch = updateData.isNewLaunch === 'true' || updateData.isNewLaunch === true;
    }
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
    }
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive !== 'false' && updateData.isActive !== false;
    }

    // Append new uploads to existing arrays
    if (req.files?.['photos']) {
      const newPhotos = req.files['photos'].map(mapFilePath);
      updateData.photos = [...(property.photos || []), ...newPhotos];
    }
    if (req.files?.['floorPlans']) {
      const newFloorPlans = req.files['floorPlans'].map(mapFilePath);
      updateData.floorPlans = [...(property.floorPlans || []), ...newFloorPlans];
    }
    if (req.files?.['videos']) {
      const newVideos = req.files['videos'].map(mapFilePath);
      updateData.videos = [...(property.videos || []), ...newVideos];
    }

    // Parse numeric fields
    if (updateData.priceMin) updateData.priceMin = Number(updateData.priceMin);
    if (updateData.priceMax) updateData.priceMax = Number(updateData.priceMax);
    if (updateData.totalUnits) updateData.totalUnits = Number(updateData.totalUnits);

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedProperty });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete property (Admin only)
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Delete all associated images and videos
    const allFiles = [...(property.photos || []), ...(property.floorPlans || []), ...(property.videos || [])];
    await Promise.all(allFiles.map(deleteStoredFile));

    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a specific photo from property
// @route   DELETE /api/properties/:id/photo
// @access  Private
const deletePropertyPhoto = async (req, res) => {
  try {
    const { photoPath } = req.body;
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    property.photos = property.photos.filter((p) => p !== photoPath);
    await property.save();

    await deleteStoredFile(photoPath);

    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all properties (Admin - including inactive)
// @route   GET /api/properties/admin/all
// @access  Private
const getAllPropertiesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: properties,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProperties,
  getNewLaunches,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  deletePropertyPhoto,
  getAllPropertiesAdmin,
};
