const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  CategoryCode: {
    type: String,
    required: true,
  },
  CategoryName: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Value: {
    type: String,
  },
});

const CategoryModel = mongoose.model("category", CategorySchema);

module.exports = CategoryModel;
