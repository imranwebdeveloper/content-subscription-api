const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sampleArticles: [{ title: String, url: String }],
});

module.exports = mongoose.model("Category", categorySchema);
