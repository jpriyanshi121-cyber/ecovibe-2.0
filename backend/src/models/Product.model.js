import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['food-beverage', 'clothing', 'home-living', 'beauty', 'electronics', 'other'],
      required: true,
    },
    images: [String],
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ecoTags: [String],
    stock: {
      type: Number,
      default: 1,
    },
    likes: [mongoose.Schema.Types.ObjectId],
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isEcoVerified: Boolean,
    recyclable: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);