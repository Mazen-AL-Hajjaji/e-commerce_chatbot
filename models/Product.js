const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: String,
  productName: String,
  description: String,

  images: [String],
  imageUri: String,

  catName: String,
  catId: String,
  subCatId: String,
  subCat: String,
  subCatName: String,
  category: { type: Schema.Types.ObjectId, ref: "category" },

  brand: String,
  productBrand: String,
  price: Number,
  oldPrice: Number,
  discount: Number,
  isFeatured: Boolean,
  rating: Number,
  countInStock: Number,

  productColor: Schema.Types.Mixed,
  color: Schema.Types.Mixed,

  productSize: Schema.Types.Mixed,
  size: Schema.Types.Mixed,

  materialType: String,
  styleType: String,
  season: String,
  gender: String,

  productRam: [String],
  productWeight: [String],

  location: [
    {
      value: String,
      label: String,
      _id: Schema.Types.ObjectId,
    },
  ],

  link: String, 
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("product", productSchema);
