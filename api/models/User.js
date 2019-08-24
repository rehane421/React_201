const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book"
  },
  issuedBooks: [
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "books"
      }
    }
  ],
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = User = mongoose.model("user", UserSchema);
