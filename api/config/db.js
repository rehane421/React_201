const mongoose = require("mongoose");
const db = require("./default.json").mongoURI;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
  }
};
module.exports = connectDB;
