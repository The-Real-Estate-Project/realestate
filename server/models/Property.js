const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    // Buy, Rent, New Launch, Plots/Lands
    category: {
      type: String,
      required: true,
      enum: ['buy', 'rent', 'new-launch', 'plots-lands'],
    },
    // Residential only
    propertyType: {
      type: String,
      required: true,
      enum: ['residential'],
    },
    // Site, Flat, Land
    unitType: {
      type: String,
      required: true,
      enum: ['site', 'flat', 'land'],
    },
    // Location details (Bengaluru only)
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    // Pricing
    priceMin: {
      type: Number,
    },
    priceMax: {
      type: Number,
    },
    priceUnit: {
      type: String,
      enum: ['Cr', 'L', 'K'],
      default: 'Cr',
    },
    estimatedEMI: {
      type: String,
    },
    // Project details
    projectSize: {
      type: String,
    },
    configurations: [String], // ['2 BHK', '3 BHK', etc.]
    totalUnits: {
      type: Number,
    },
    possessionDate: {
      type: String,
    },
    // Description
    overview: {
      type: String,
    },
    amenities: [String],
    landmarks: [String],
    // Media
    photos: [String],
    floorPlans: [String],
    videos: [String],
    mapEmbed: {
      type: String,
    },
    mapLink: {
      type: String,
    },
    // Flags
    isNewLaunch: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // Contact
    whatsappNumber: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title
propertySchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-') +
      '-' +
      Date.now();
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);
